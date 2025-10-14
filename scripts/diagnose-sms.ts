// scripts/diagnose-sms.ts
// Script para diagnosticar problemas de entrega de SMS
// Ejecutar con: npx tsx scripts/diagnose-sms.ts

import twilio from "twilio";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !fromNumber) {
  console.error("❌ Missing Twilio credentials in .env");
  process.exit(1);
}

const client = twilio(accountSid, authToken);

async function diagnoseNumber(phoneNumber: string) {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔍 SMS DELIVERY DIAGNOSTIC TOOL");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log(`📞 Analyzing number: ${phoneNumber}`);
  console.log(`📤 From number: ${fromNumber}\n`);

  // Step 1: Verify Twilio account
  console.log("Step 1: Checking Twilio account...");
  try {
    const account = await client.api.accounts(accountSid!).fetch();
    console.log(`  ✓ Account SID: ${account.sid}`);
    console.log(`  ✓ Account Status: ${account.status}`);
    console.log(`  ✓ Account Type: ${account.type}\n`);

    if (account.type === "Trial") {
      console.log("  ⚠️  WARNING: You are using a TRIAL account");
      console.log("  → Trial accounts can only send to verified numbers");
      console.log("  → Verify numbers at: https://console.twilio.com/us1/develop/phone-numbers/manage/verified\n");
    }
  } catch (error) {
    console.error("  ✗ Failed to fetch account info:", error);
    return;
  }

  // Step 2: Validate phone number format
  console.log("Step 2: Validating phone number format...");
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  if (!e164Regex.test(phoneNumber)) {
    console.error(`  ✗ Invalid format: ${phoneNumber}`);
    console.error("  → Use E.164 format: +1XXXXXXXXXX (for US numbers)");
    return;
  }
  console.log(`  ✓ Format is valid (E.164)\n`);

  // Step 3: Lookup phone number
  console.log("Step 3: Looking up phone number capabilities...");
  try {
    const lookup = await client.lookups.v2
      .phoneNumbers(phoneNumber)
      .fetch({ fields: "line_type_intelligence" });

    console.log(`  ✓ Phone Number: ${lookup.phoneNumber}`);
    console.log(`  ✓ Valid: ${lookup.valid}`);
    console.log(`  ✓ Calling Country Code: ${lookup.callingCountryCode}`);

    if (lookup.lineTypeIntelligence) {
      console.log(`  ✓ Carrier: ${lookup.lineTypeIntelligence.carrierName || "Unknown"}`);
      console.log(`  ✓ Type: ${lookup.lineTypeIntelligence.type || "Unknown"}`);
    }
    console.log();
  } catch (error) {
    const err = error as { message?: string; code?: number };
    console.error(`  ✗ Lookup failed: ${err.message}`);
    if (err.code === 20404) {
      console.error("  → This phone number may not exist or is invalid");
    }
    console.log();
  }

  // Step 4: Check recent messages to this number
  console.log("Step 4: Checking recent messages to this number...");
  try {
    const messages = await client.messages.list({
      to: phoneNumber,
      limit: 5,
    });

    if (messages.length === 0) {
      console.log("  ℹ No recent messages found to this number\n");
    } else {
      console.log(`  Found ${messages.length} recent message(s):\n`);
      messages.forEach((msg, index) => {
        console.log(`  Message ${index + 1}:`);
        console.log(`    - SID: ${msg.sid}`);
        console.log(`    - Status: ${msg.status}`);
        console.log(`    - Date: ${msg.dateSent?.toLocaleString() || "Pending"}`);
        console.log(`    - Error Code: ${msg.errorCode || "None"}`);
        console.log(`    - Error Message: ${msg.errorMessage || "None"}`);
        console.log();
      });
    }
  } catch (error) {
    console.error("  ✗ Failed to fetch recent messages:", error);
    console.log();
  }

  // Step 5: Send test message
  console.log("Step 5: Sending test message...");
  console.log("  (Type 'y' to proceed or any other key to skip)");

  // For automated testing, we'll skip the interactive prompt
  console.log("  Skipping test send (run manually if needed)\n");

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📋 DIAGNOSIS COMPLETE");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log("Common reasons for 'Undelivered' status:");
  console.log("  1. Phone is off or out of coverage");
  console.log("  2. Invalid phone number");
  console.log("  3. Carrier rejected the message");
  console.log("  4. Phone cannot receive SMS (landline, VoIP issues)");
  console.log("  5. Phone's inbox is full");
  console.log("  6. Trial account sending to unverified number");
  console.log("\nRecommended actions:");
  console.log("  • Verify the number in Twilio Console if using trial account");
  console.log("  • Check Twilio logs for detailed error messages");
  console.log("  • Try sending to a different number to test");
  console.log("  • Upgrade to a paid Twilio account\n");
}

// Get phone number from command line or use default
const phoneNumber = process.argv[2] || "+18325465983";

diagnoseNumber(phoneNumber).catch(console.error);
