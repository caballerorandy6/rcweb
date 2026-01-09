import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { generateProjectCode } from "../src/lib/utils";

async function main() {
  console.log("🔍 Buscando clientes existentes...");

  // Buscar el primer cliente activo
  const client = await prisma.client.findFirst({
    where: {
      isActive: true,
      password: { not: null }, // Que tenga contraseña configurada
    },
  });

  if (!client) {
    console.error("❌ No se encontró ningún cliente activo con contraseña.");
    console.log("💡 Por favor, crea un cliente primero desde /client/register");
    process.exit(1);
  }

  console.log(`✅ Cliente encontrado: ${client.email} (${client.name})`);

  // Generar projectCode único
  let projectCode = generateProjectCode();
  let existingPayment = await prisma.payment.findUnique({
    where: { projectCode },
  });

  // Asegurar que el projectCode sea único
  while (existingPayment) {
    projectCode = generateProjectCode();
    existingPayment = await prisma.payment.findUnique({
      where: { projectCode },
    });
  }

  console.log(`📦 Creando proyecto con código: ${projectCode}`);

  // Crear el Payment (proyecto)
  const payment = await prisma.payment.create({
    data: {
      projectCode,
      accessToken: crypto.randomUUID(),
      email: client.email,
      name: client.name,
      planName: "Professional Website",
      totalAmount: 500000, // $5,000.00 en centavos
      firstPayment: 250000, // $2,500.00
      secondPayment: 250000, // $2,500.00
      firstPaid: true,
      secondPaid: true,
      firstPaidAt: new Date(),
      secondPaidAt: new Date(),
      projectStatus: "in_progress",
      clientId: client.id,
    },
  });

  console.log(`✅ Proyecto creado: ${payment.id}`);

  // Crear deliverables de prueba
  const deliverables = [
    {
      name: "Source Code v1.0",
      description: "Initial source code for the project",
      type: "source_code",
      fileUrl: "https://example.com/files/source-code-v1.0.zip",
      fileSize: 5242880, // 5 MB
      mimeType: "application/zip",
      uploadedBy: "admin@rcweb.dev",
    },
    {
      name: "Project Documentation",
      description: "Complete project documentation and user guide",
      type: "documentation",
      fileUrl: "https://example.com/files/documentation.pdf",
      fileSize: 2097152, // 2 MB
      mimeType: "application/pdf",
      uploadedBy: "admin@rcweb.dev",
    },
    {
      name: "Design Assets",
      description: "All design files, logos, and graphics",
      type: "assets",
      fileUrl: "https://example.com/files/design-assets.zip",
      fileSize: 10485760, // 10 MB
      mimeType: "application/zip",
      uploadedBy: "admin@rcweb.dev",
    },
  ];

  console.log(`📎 Creando ${deliverables.length} deliverables...`);

  for (const deliverableData of deliverables) {
    const deliverable = await prisma.deliverable.create({
      data: {
        paymentId: payment.id,
        ...deliverableData,
      },
    });
    console.log(`  ✅ ${deliverable.name} creado`);
  }

  console.log("\n🎉 ¡Proyecto y deliverables creados exitosamente!");
  console.log(`\n📋 Resumen:`);
  console.log(`   Cliente: ${client.email}`);
  console.log(`   Proyecto: ${projectCode}`);
  console.log(`   Plan: Professional Website`);
  console.log(`   Deliverables: ${deliverables.length}`);
  console.log(`\n🔗 Puedes ver el proyecto en: /client/dashboard`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  });

