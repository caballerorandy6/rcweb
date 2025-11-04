// scripts/test-twilio.ts
// Ejecutar con: npx tsx scripts/test-twilio.ts

import twilio from "twilio";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config({ path: ".env" });

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

if (!accountSid || !authToken || !fromNumber) {
  console.error("❌ Missing Twilio credentials in .env");
  process.exit(1);
}

const client = twilio(accountSid, authToken);

async function testSMS() {
  try {
    // Números de prueba
    const TEST_NUMBERS = [
      "+18325465983",  // Número 1
      "+13464417386",  // Yani Cruz
    ];

    console.log("📱 Sending test SMS to multiple numbers...");
    console.log(`From: ${fromNumber}`);
    if (messagingServiceSid) {
      console.log(`Using Messaging Service: ${messagingServiceSid}`);
    }
    console.log(`Recipients: ${TEST_NUMBERS.length} numbers\n`);

    let successCount = 0;
    let failedCount = 0;

    for (const TO_NUMBER of TEST_NUMBERS) {
      try {
        console.log(`📤 Sending to: ${TO_NUMBER}...`);

        const messageParams: {
          body: string;
          to: string;
          messagingServiceSid?: string;
          from?: string;
        } = {
          body: "RC Web: Test message! Your Twilio A2P campaign is working correctly. Reply STOP to unsubscribe. Msg&data rates apply.",
          to: TO_NUMBER,
        };

        // Use Messaging Service if available (required for A2P 10DLC compliance)
        if (messagingServiceSid) {
          messageParams.messagingServiceSid = messagingServiceSid;
        } else {
          messageParams.from = fromNumber;
        }

        const message = await client.messages.create(messageParams);

        console.log(`✅ SMS sent successfully to ${TO_NUMBER}`);
        console.log(`   Message SID: ${message.sid}`);
        console.log(`   Status: ${message.status}`);
        console.log(`   Price: ${message.price || "Pending"}\n`);

        successCount++;

        // Pausa de 1 segundo entre mensajes
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error: unknown) {
        failedCount++;
        if (typeof error === "object" && error !== null && "message" in error) {
          console.error(`❌ Failed to send to ${TO_NUMBER}: ${error.message}\n`);
        }
      }
    }

    console.log("\n📊 Summary:");
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${failedCount}`);

    // Verificar balance de cuenta (opcional)
    const balance = await client.balance.fetch();
    console.log("\n💰 Account Balance:", balance.balance, balance.currency);
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "message" in error) {
      console.error("❌ Error sending SMS:", error.message);

      // @ts-expect-error: error might not have code, but we check at runtime
      if (error.code === 21608) {
        console.error(
          "→ The number is not verified. Add it to Verified Caller IDs in Twilio Console."
        );
        // @ts-expect-error: error might not have code, but we check at runtime
      } else if (error.code === 21211) {
        console.error(
          "→ Invalid phone number format. Use E.164 format: +1XXXXXXXXXX"
        );
        // @ts-expect-error: error might not have code, but we check at runtime
      } else if (error.code === 20003) {
        console.error(
          "→ Authentication failed. Check your Account SID and Auth Token."
        );
      }
    } else {
      console.error("❌ Error sending SMS:", error);
    }
  }
}

// Ejecutar test
testSMS();

// # 1. Editar el TO_NUMBER con tu número personal
// const TO_NUMBER = '+17135551234'; // Tu número real aquí

// # 2. Ejecutar
// npx tsx scripts/test-twilio.ts o npm run test:twilio

// # 3. Deberías recibir un SMS en tu teléfono
