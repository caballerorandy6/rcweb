// scripts/test-twilio.ts
// Ejecutar con: npx tsx scripts/test-twilio.ts

import twilio from "twilio";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config({ path: ".env.local" });

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !fromNumber) {
  console.error("❌ Missing Twilio credentials in .env.local");
  process.exit(1);
}

const client = twilio(accountSid, authToken);

async function testSMS() {
  try {
    // Reemplaza con tu número de teléfono
    const TO_NUMBER = "+18325465983"; // Tu número con código de país

    console.log("📱 Sending test SMS...");
    console.log(`From: ${fromNumber}`);
    console.log(`To: ${TO_NUMBER}`);

    const message = await client.messages.create({
      body: "Test from RC Web! Your Twilio integration is working correctly. Reply STOP to unsubscribe.",
      from: fromNumber,
      to: TO_NUMBER,
    });

    console.log("✅ SMS sent successfully!");
    console.log("Message SID:", message.sid);
    console.log("Status:", message.status);
    console.log("Price:", message.price || "Pending");

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
