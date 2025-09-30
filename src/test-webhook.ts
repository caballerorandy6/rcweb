// src/test-webhook.ts
// Script para diagnosticar problemas con el webhook de Stripe
// Ejecutar con: npm run test:webhook

import * as dotenv from 'dotenv';
import * as path from 'path';

// IMPORTANTE: Cargar variables de entorno ANTES de importar Stripe
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import Stripe from "stripe";

// Verificar que tenemos la clave antes de crear la instancia
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ Error: STRIPE_SECRET_KEY no está configurada");
  console.error("   Verifica que tienes un archivo .env.local o .env con:");
  console.error("   STRIPE_SECRET_KEY=sk_test_...");
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function checkWebhookConfiguration() {
  console.log("🔍 Verificando configuración del Webhook de Stripe...\n");

  try {
    // 1. Verificar que las variables de entorno existen
    console.log("1️⃣ Variables de entorno:");
    console.log(
      "   STRIPE_SECRET_KEY:",
      process.env.STRIPE_SECRET_KEY ? "✅ Configurada" : "❌ NO configurada"
    );
    console.log(
      "   STRIPE_WEBHOOK_SECRET:",
      process.env.STRIPE_WEBHOOK_SECRET ? "✅ Configurada" : "❌ NO configurada"
    );
    console.log(
      "   RESEND_API_KEY:",
      process.env.RESEND_API_KEY ? "✅ Configurada" : "❌ NO configurada"
    );

    // 2. Listar webhooks configurados
    console.log("\n2️⃣ Webhooks configurados en Stripe:");
    const webhookEndpoints = await stripe.webhookEndpoints.list({ limit: 10 });

    if (webhookEndpoints.data.length === 0) {
      console.log("   ❌ NO hay webhooks configurados");
    } else {
      webhookEndpoints.data.forEach((endpoint, index) => {
        console.log(`\n   Webhook ${index + 1}:`);
        console.log(`   URL: ${endpoint.url}`);
        console.log(
          `   Estado: ${endpoint.status === "enabled" ? "✅ Habilitado" : "❌ Deshabilitado"}`
        );
        console.log(`   Eventos: ${endpoint.enabled_events.join(", ")}`);
        console.log(`   Versión API: ${endpoint.api_version}`);
      });
    }

    // 3. Verificar eventos recientes
    console.log("\n3️⃣ Últimos eventos de checkout.session.completed:");
    const events = await stripe.events.list({
      type: "checkout.session.completed",
      limit: 5,
    });

    if (events.data.length === 0) {
      console.log("   ℹ️ No hay eventos recientes");
    } else {
      events.data.forEach((event, index) => {
        const session = event.data.object as Stripe.Checkout.Session;
        const timestamp = new Date(event.created * 1000);
        console.log(`\n   Evento ${index + 1}:`);
        console.log(`   ID: ${event.id}`);
        console.log(`   Fecha: ${timestamp.toLocaleString()}`);
        console.log(`   Session ID: ${session.id}`);
        console.log(
          `   Project Code: ${session.metadata?.projectCode || "N/A"}`
        );
        console.log(
          `   Estado webhook: ${event.request ? "✅ Enviado" : "❌ No enviado"}`
        );

        if (event.request) {
          console.log(`   ID solicitud: ${event.request.id}`);
        }
      });
    }

    // 4. Intentar enviar un evento de prueba
    console.log("\n4️⃣ URLs de webhook que deberías tener configuradas:");
    const domain = process.env.NEXT_PUBLIC_APP_URL || "https://tu-dominio.com";
    console.log(`   Producción: ${domain}/api/stripe/webhook`);
    console.log(
      `   Local (con ngrok/localtunnel): https://[tu-tunel].ngrok.io/api/stripe/webhook`
    );

    console.log("\n5️⃣ Recomendaciones:");
    console.log(
      "   • Verifica que la URL del webhook en Stripe Dashboard sea exactamente: " +
        domain +
        "/api/stripe/webhook"
    );
    console.log(
      '   • Asegúrate de que el evento "checkout.session.completed" esté seleccionado'
    );
    console.log(
      '   • Copia el "Signing secret" del webhook y pégalo en STRIPE_WEBHOOK_SECRET'
    );
    console.log(
      "   • Para desarrollo local, usa ngrok o localtunnel para exponer tu localhost"
    );
    console.log(
      "   • Revisa los logs del webhook en Stripe Dashboard para ver intentos fallidos"
    );
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Ejecutar el diagnóstico
checkWebhookConfiguration();