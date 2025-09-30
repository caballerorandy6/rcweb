// scripts/test-webhook.ts
// Script para diagnosticar problemas con el webhook de Stripe
// Ejecutar con: npm run test:webhook

import * as dotenv from "dotenv";
import * as path from "path";
import Stripe from "stripe";

// Cargar variables de entorno
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Verificar que tenemos la clave de Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  console.error(
    "❌ Error: STRIPE_SECRET_KEY no está configurada en las variables de entorno"
  );
  console.error(
    "   Asegúrate de tener un archivo .env.local o .env con STRIPE_SECRET_KEY=sk_..."
  );
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil", // Usar la última versión de API compatible
});

async function checkWebhookConfiguration() {
  console.log("🔍 Verificando configuración del Webhook de Stripe...\n");
  console.log("═══════════════════════════════════════════════════════\n");

  try {
    // 1. Verificar que las variables de entorno existen
    console.log("1️⃣  VERIFICACIÓN DE VARIABLES DE ENTORNO:");
    console.log(
      "   ├─ STRIPE_SECRET_KEY:",
      process.env.STRIPE_SECRET_KEY ? "✅ Configurada" : "❌ NO configurada"
    );
    console.log(
      "   ├─ STRIPE_WEBHOOK_SECRET:",
      process.env.STRIPE_WEBHOOK_SECRET ? "✅ Configurada" : "❌ NO configurada"
    );
    console.log(
      "   └─ RESEND_API_KEY:",
      process.env.RESEND_API_KEY ? "✅ Configurada" : "❌ NO configurada"
    );

    if (process.env.STRIPE_WEBHOOK_SECRET) {
      console.log(
        `\n   📝 Tu webhook secret: ${process.env.STRIPE_WEBHOOK_SECRET.substring(0, 15)}...`
      );
    }

    // 2. Verificar modo de Stripe (test o live)
    const isTestMode = process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_");
    console.log(`\n   🔧 Modo: ${isTestMode ? "🧪 TEST" : "🔴 LIVE"}`);

    // 3. Listar webhooks configurados
    console.log("\n2️⃣  WEBHOOKS CONFIGURADOS EN STRIPE:");
    try {
      const webhookEndpoints = await stripe.webhookEndpoints.list({
        limit: 10,
      });

      if (webhookEndpoints.data.length === 0) {
        console.log("   ❌ NO hay webhooks configurados");
        console.log(
          "   📝 Ve a https://dashboard.stripe.com/webhooks para crear uno"
        );
      } else {
        webhookEndpoints.data.forEach((endpoint, index) => {
          console.log(`\n   Webhook ${index + 1}:`);
          console.log(`   ├─ URL: ${endpoint.url}`);
          console.log(
            `   ├─ Estado: ${endpoint.status === "enabled" ? "✅ Habilitado" : "❌ Deshabilitado"}`
          );
          console.log(
            `   ├─ Eventos escuchados: ${endpoint.enabled_events.length} eventos`
          );

          // Verificar si escucha checkout.session.completed
          const hasCheckoutEvent = endpoint.enabled_events.includes(
            "checkout.session.completed"
          );
          console.log(
            `   ├─ checkout.session.completed: ${hasCheckoutEvent ? "✅ Sí" : "❌ No"}`
          );

          if (endpoint.enabled_events.length <= 5) {
            console.log(`   └─ Eventos: ${endpoint.enabled_events.join(", ")}`);
          } else {
            console.log(
              `   └─ Eventos: ${endpoint.enabled_events.slice(0, 3).join(", ")}... y ${endpoint.enabled_events.length - 3} más`
            );
          }
        });
      }
    } catch (error) {
      console.log(
        "   ⚠️ No se pudieron listar los webhooks (puede requerir permisos adicionales)",
        error
      );
    }

    // 4. Verificar eventos recientes
    console.log("\n3️⃣  ÚLTIMOS EVENTOS DE checkout.session.completed:");
    const events = await stripe.events.list({
      type: "checkout.session.completed",
      limit: 5,
    });

    if (events.data.length === 0) {
      console.log(
        "   ℹ️ No hay eventos recientes de checkout.session.completed"
      );
    } else {
      for (const [index, event] of events.data.entries()) {
        const session = event.data.object as Stripe.Checkout.Session;
        const timestamp = new Date(event.created * 1000);
        const timeDiff = Date.now() - timestamp.getTime();
        const minutesAgo = Math.floor(timeDiff / 60000);

        console.log(`\n   Evento ${index + 1}:`);
        console.log(`   ├─ ID: ${event.id}`);
        console.log(
          `   ├─ Fecha: ${timestamp.toLocaleString()} (hace ${minutesAgo} minutos)`
        );
        console.log(`   ├─ Session ID: ${session.id}`);
        console.log(
          `   ├─ Project Code: ${session.metadata?.projectCode || "N/A"}`
        );
        console.log(`   ├─ Cliente: ${session.customer_email || "N/A"}`);
        console.log(
          `   ├─ Monto: $${((session.amount_total || 0) / 100).toFixed(2)}`
        );

        // Verificar intentos de webhook
        if (event.request) {
          console.log(`   └─ Webhook: ✅ Enviado (ID: ${event.request.id})`);
        } else {
          console.log(`   └─ Webhook: ⚠️ No hay registro de envío`);
        }
      }

      // 5. Verificar intentos de webhook para el último evento
      if (events.data.length > 0) {
        console.log("\n4️⃣  DETALLES DEL ÚLTIMO EVENTO:");
        const lastEvent = events.data[0];

        try {
          // Intentar obtener más detalles del evento
          const eventWithAttempts = await stripe.events.retrieve(lastEvent.id);

          if (eventWithAttempts.request) {
            console.log(
              `   ├─ ID de solicitud: ${eventWithAttempts.request.id}`
            );
            console.log(`   └─ Estado: Webhook fue intentado`);
          } else {
            console.log(
              `   └─ ⚠️ Este evento no tiene intentos de webhook registrados`
            );
          }
        } catch (error) {
          console.log(
            `   └─ No se pudieron obtener detalles adicionales`,
            error
          );
        }
      }
    }

    // 6. URLs de configuración recomendadas
    console.log("\n5️⃣  CONFIGURACIÓN RECOMENDADA:");
    const domain = process.env.NEXT_PUBLIC_APP_URL || "https://tu-dominio.com";
    console.log(`\n   📍 URL del Webhook:`);
    console.log(`   └─ Producción: ${domain}/api/stripe/webhook`);

    console.log(`\n   🔧 Para desarrollo local:`);
    console.log(`   ├─ Opción 1 - Stripe CLI (Recomendado):`);
    console.log(
      `   │  stripe listen --forward-to localhost:3000/api/stripe/webhook`
    );
    console.log(`   │`);
    console.log(`   └─ Opción 2 - ngrok:`);
    console.log(`      1. ngrok http 3000`);
    console.log(`      2. Usar la URL de ngrok en Stripe Dashboard`);

    // 7. Checklist de verificación
    console.log("\n6️⃣  CHECKLIST DE VERIFICACIÓN:");
    console.log(`\n   ☐ La URL del webhook termina en /api/stripe/webhook`);
    console.log(`   ☐ El webhook está habilitado en Stripe Dashboard`);
    console.log(`   ☐ El evento checkout.session.completed está seleccionado`);
    console.log(`   ☐ El STRIPE_WEBHOOK_SECRET coincide exactamente`);
    console.log(`   ☐ No hay espacios extra en el webhook secret`);
    console.log(`   ☐ El servidor puede recibir requests POST`);
    console.log(`   ☐ No hay middleware bloqueando /api/stripe/webhook`);

    console.log("\n7️⃣  LINKS ÚTILES:");
    console.log(
      `   🔗 Stripe Dashboard Webhooks: https://dashboard.stripe.com/${isTestMode ? "test/" : ""}webhooks`
    );
    console.log(
      `   🔗 Stripe Webhook Events: https://dashboard.stripe.com/${isTestMode ? "test/" : ""}events`
    );
    console.log(`   🔗 Documentación: https://stripe.com/docs/webhooks`);
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "message" in error) {
      console.error("\n❌ Error:", error.message || error);
    } else {
      console.error("\n❌ Error:", error);
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "type" in error &&
      error.type === "StripeAuthenticationError"
    ) {
      console.error(
        "\n⚠️  Parece que hay un problema con tu STRIPE_SECRET_KEY"
      );
      console.error(
        "   Verifica que la clave sea correcta y corresponda al modo (test/live)"
      );
    }
  }

  console.log("\n═══════════════════════════════════════════════════════\n");
}

// Función para probar el webhook localmente
async function testWebhookLocally() {
  console.log("\n8️⃣  PRUEBA LOCAL DEL WEBHOOK:");
  console.log("   Para probar tu webhook localmente:");
  console.log("\n   npm run stripe:listen");
  console.log("   O");
  console.log(
    "   stripe listen --forward-to localhost:3000/api/stripe/webhook\n"
  );
}

// Ejecutar el diagnóstico
console.clear();
console.log("╔═══════════════════════════════════════════════════════╗");
console.log("║         🎯 DIAGNÓSTICO DE WEBHOOK DE STRIPE 🎯        ║");
console.log("╚═══════════════════════════════════════════════════════╝\n");

checkWebhookConfiguration()
  .then(() => testWebhookLocally())
  .then(() => {
    console.log("✅ Diagnóstico completado\n");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  });
