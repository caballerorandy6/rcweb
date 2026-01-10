import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { del } from "@vercel/blob";

/**
 * Script para eliminar completamente un proyecto y toda su información relacionada
 * 
 * Uso:
 *   npx tsx scripts/delete-project.ts <projectCode>
 *   o
 *   npx tsx scripts/delete-project.ts --email <email>
 * 
 * Ejemplo:
 *   npx tsx scripts/delete-project.ts W8QKFF
 *   npx tsx scripts/delete-project.ts --email caballerorandy6@gmail.com
 */

async function deleteProject(projectCode?: string, email?: string) {
  if (!projectCode && !email) {
    console.error("❌ Error: Debes proporcionar un projectCode o un email");
    console.log("\nUso:");
    console.log("  npx tsx scripts/delete-project.ts <projectCode>");
    console.log("  npx tsx scripts/delete-project.ts --email <email>");
    process.exit(1);
  }

  try {
    let payment;

    if (projectCode) {
      console.log(`🔍 Buscando proyecto con código: ${projectCode}...`);
      payment = await prisma.payment.findUnique({
        where: { projectCode: projectCode.toUpperCase() },
        include: {
          invoices: true,
          deliverables: true,
          milestones: {
            include: {
              notifications: true,
            },
          },
          termsAcceptance: true,
        },
      });
    } else if (email) {
      console.log(`🔍 Buscando proyectos del cliente: ${email}...`);
      const payments = await prisma.payment.findMany({
        where: { email: email.toLowerCase() },
        include: {
          invoices: true,
          deliverables: true,
          milestones: {
            include: {
              notifications: true,
            },
          },
          termsAcceptance: true,
        },
      });

      if (payments.length === 0) {
        console.error(`❌ No se encontraron proyectos para el email: ${email}`);
        process.exit(1);
      }

      if (payments.length > 1) {
        console.log(`\n⚠️  Se encontraron ${payments.length} proyectos:`);
        payments.forEach((p, index) => {
          console.log(
            `   ${index + 1}. ${p.projectCode} - ${p.planName} (${p.projectStatus})`
          );
        });
        console.log(
          "\n💡 Para eliminar un proyecto específico, usa el projectCode:"
        );
        console.log("   npx tsx scripts/delete-project.ts <projectCode>");
        process.exit(1);
      }

      payment = payments[0];
    }

    if (!payment) {
      console.error("❌ Proyecto no encontrado");
      process.exit(1);
    }

    console.log(`\n📋 Información del proyecto:`);
    console.log(`   Código: ${payment.projectCode}`);
    console.log(`   Cliente: ${payment.name} (${payment.email})`);
    console.log(`   Plan: ${payment.planName}`);
    console.log(`   Status: ${payment.projectStatus}`);
    console.log(`   Invoices: ${payment.invoices.length}`);
    console.log(`   Deliverables: ${payment.deliverables.length}`);
    console.log(`   Milestones: ${payment.milestones.length}`);
    console.log(
      `   Milestone Notifications: ${payment.milestones.reduce(
        (acc, m) => acc + m.notifications.length,
        0
      )}`
    );
    console.log(
      `   Terms Acceptance: ${payment.termsAcceptance ? "Sí" : "No"}`
    );

    console.log("\n🗑️  Iniciando eliminación...");

    // 1. Eliminar archivos de Vercel Blob (Invoices PDFs)
    console.log("\n📄 Eliminando PDFs de invoices de Vercel Blob...");
    let deletedInvoices = 0;
    for (const invoice of payment.invoices) {
      if (invoice.pdfBlobKey) {
        try {
          await del(invoice.pdfBlobKey);
          deletedInvoices++;
          console.log(`   ✅ PDF eliminado: ${invoice.invoiceNumber}`);
        } catch (error) {
          console.warn(
            `   ⚠️  No se pudo eliminar PDF ${invoice.invoiceNumber}:`,
            error instanceof Error ? error.message : "Unknown error"
          );
        }
      } else if (invoice.pdfUrl) {
        try {
          await del(invoice.pdfUrl);
          deletedInvoices++;
          console.log(`   ✅ PDF eliminado (por URL): ${invoice.invoiceNumber}`);
        } catch (error) {
          console.warn(
            `   ⚠️  No se pudo eliminar PDF ${invoice.invoiceNumber}:`,
            error instanceof Error ? error.message : "Unknown error"
          );
        }
      }
    }
    console.log(`   ✅ ${deletedInvoices}/${payment.invoices.length} PDFs eliminados`);

    // 2. Eliminar archivos de Vercel Blob (Deliverables)
    console.log("\n📦 Eliminando archivos de deliverables de Vercel Blob...");
    let deletedDeliverables = 0;
    for (const deliverable of payment.deliverables) {
      if (deliverable.blobKey) {
        try {
          await del(deliverable.blobKey);
          deletedDeliverables++;
          console.log(`   ✅ Archivo eliminado: ${deliverable.name}`);
        } catch (error) {
          console.warn(
            `   ⚠️  No se pudo eliminar archivo ${deliverable.name}:`,
            error instanceof Error ? error.message : "Unknown error"
          );
        }
      } else if (deliverable.fileUrl && deliverable.fileUrl.startsWith("http")) {
        try {
          await del(deliverable.fileUrl);
          deletedDeliverables++;
          console.log(`   ✅ Archivo eliminado (por URL): ${deliverable.name}`);
        } catch (error) {
          console.warn(
            `   ⚠️  No se pudo eliminar archivo ${deliverable.name}:`,
            error instanceof Error ? error.message : "Unknown error"
          );
        }
      } else {
        console.log(
          `   ℹ️  Archivo con URL de ejemplo (no eliminado): ${deliverable.name}`
        );
      }
    }
    console.log(
      `   ✅ ${deletedDeliverables}/${payment.deliverables.length} archivos eliminados`
    );

    // 3. Eliminar el Payment (esto eliminará en cascada todos los registros relacionados)
    console.log("\n🗄️  Eliminando registro del proyecto de la base de datos...");
    await prisma.payment.delete({
      where: { id: payment.id },
    });

    console.log("\n✅ ¡Proyecto eliminado completamente!");
    console.log(`\n📊 Resumen de eliminación:`);
    console.log(`   ✅ Proyecto: ${payment.projectCode}`);
    console.log(`   ✅ Invoices: ${payment.invoices.length} (${deletedInvoices} PDFs eliminados)`);
    console.log(
      `   ✅ Deliverables: ${payment.deliverables.length} (${deletedDeliverables} archivos eliminados)`
    );
    console.log(`   ✅ Milestones: ${payment.milestones.length}`);
    console.log(
      `   ✅ Milestone Notifications: ${payment.milestones.reduce(
        (acc, m) => acc + m.notifications.length,
        0
      )}`
    );
    console.log(
      `   ✅ Terms Acceptance: ${payment.termsAcceptance ? "1" : "0"}`
    );
    console.log(
      `\n💡 Nota: El cliente (${payment.email}) NO fue eliminado, solo el proyecto.`
    );
  } catch (error) {
    console.error("\n❌ Error al eliminar el proyecto:", error);
    if (error instanceof Error) {
      console.error("   Mensaje:", error.message);
      console.error("   Stack:", error.stack);
    }
    process.exit(1);
  }
}

// Parse arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("❌ Error: Debes proporcionar un projectCode o un email");
  console.log("\nUso:");
  console.log("  npx tsx scripts/delete-project.ts <projectCode>");
  console.log("  npx tsx scripts/delete-project.ts --email <email>");
  process.exit(1);
}

if (args[0] === "--email" && args[1]) {
  deleteProject(undefined, args[1]);
} else {
  deleteProject(args[0]);
}
