# SMS Opt-in/Opt-out Setup Guide

This guide explains how to configure the automatic SMS subscription system for RC Web Solutions.

## 📋 Overview

Users can now text commands to your Twilio number to subscribe/unsubscribe:
- **START/SUBSCRIBE/YES** - Subscribe to marketing messages
- **STOP/UNSUBSCRIBE/CANCEL** - Unsubscribe from messages
- **HELP/INFO** - Get information about the service

## ✅ What's Already Implemented

1. ✅ **API Webhook Endpoint:** `/api/twilio/sms/incoming`
2. ✅ **Database Schema:** Updated with `source`, `type`, and `SmsLog` table
3. ✅ **Auto-responses:** TwiML responses for each command
4. ✅ **Database Updates:** Automatically updates `marketingConsent` field
5. ✅ **Logging:** All SMS interactions logged in `SmsLog` table

## 🔧 Twilio Configuration Required

### Step 1: Configure SMS Webhook

1. Go to [Twilio Console > Phone Numbers](https://console.twilio.com/us1/develop/phone-numbers/manage/incoming)

2. Click on your number: **+1 (346) 375-7534**

3. Scroll to **"Messaging Configuration"** section

4. Under **"A MESSAGE COMES IN"**, configure:
   - **When a message comes in:** `Webhook`
   - **URL:** `https://rcweb.dev/api/twilio/sms/incoming`
   - **HTTP Method:** `POST`

5. Click **"Save Configuration"**

### Step 2: Verify Webhook is Working

Send a test message to **+1 (346) 375-7534**:

```
START
```

You should receive an automatic response:
```
RC Web Solutions: You are now subscribed to marketing updates about our web development services. For help reply HELP. To opt-out reply STOP. Msg&data rates may apply.
```

### Step 3: Test All Commands

Test each command:

| Command | Expected Response |
|---------|-------------------|
| `START` | Subscription confirmation |
| `STOP` | Unsubscribe confirmation |
| `HELP` | Information about the service |

## 📊 Database Updates

### When user sends START/SUBSCRIBE:
```sql
-- Creates or updates Contact
UPDATE Contact
SET marketingConsent = true,
    source = 'SMS_OPT_IN',
    updatedAt = NOW()
```

### When user sends STOP:
```sql
-- Updates existing or creates Contact with opt-out
UPDATE Contact
SET marketingConsent = false,
    updatedAt = NOW()
```

### All interactions logged:
```sql
-- Every SMS is tracked
INSERT INTO SmsLog (phoneNumber, message, direction, command, status)
VALUES ('+18325465983', 'START', 'received', 'OPT_IN', 'received')
```

## 🔍 Monitoring

### View SMS Logs in Database:

```sql
-- Recent SMS interactions
SELECT * FROM "SmsLog"
ORDER BY "createdAt" DESC
LIMIT 50;

-- Opt-in stats
SELECT command, COUNT(*) as count
FROM "SmsLog"
WHERE command IN ('OPT_IN', 'OPT_OUT')
GROUP BY command;

-- Check specific number
SELECT * FROM "SmsLog"
WHERE "phoneNumber" = '+18325465983'
ORDER BY "createdAt" DESC;
```

### View in Twilio Console:

1. Go to [Twilio Console > Messaging Logs](https://console.twilio.com/us1/monitor/logs/sms)
2. Filter by your number: `+13463757534`
3. Check both incoming and outgoing messages

## 🚨 Troubleshooting

### Webhook not receiving messages:

1. **Check webhook URL is correct:**
   - Must be `https://rcweb.dev/api/twilio/sms/incoming`
   - Must use `POST` method
   - Must be HTTPS (not HTTP)

2. **Test endpoint directly:**
   ```bash
   curl https://rcweb.dev/api/twilio/sms/incoming
   ```

   Should return:
   ```json
   {
     "message": "Twilio SMS Webhook Endpoint",
     "status": "active",
     "supportedCommands": ["START", "SUBSCRIBE", "STOP", "HELP"]
   }
   ```

3. **Check Twilio Debugger:**
   - Go to [Twilio Debugger](https://console.twilio.com/us1/monitor/debugger)
   - Look for webhook errors
   - Check HTTP status codes

### Database not updating:

1. **Check server logs** for errors during SMS processing
2. **Verify database connection** in `.env`
3. **Check Prisma schema** is up to date:
   ```bash
   npx prisma generate
   ```

### Auto-responses not sending:

1. **Verify Messaging Service** is configured
2. **Check TWILIO_MESSAGING_SERVICE_SID** in `.env`
3. **Review Twilio logs** for outgoing message errors

## 💰 Costs

Each interaction has a cost:

- **Incoming SMS (user sends START):** $0.0079
- **Outgoing SMS (your auto-reply):** $0.0079
- **Total per subscription:** ~$0.016

**Monthly estimate:**
- 100 new subscribers/month: ~$1.60
- 1000 new subscribers/month: ~$16.00

## 📝 A2P 10DLC Campaign Requirements

For the A2P campaign registration, you can now include:

### Opt-in Keywords:
```
START, SUBSCRIBE, YES
```

### Opt-in Message:
```
RC Web Solutions: You are now subscribed to marketing updates about our web development services. For help reply HELP. To opt-out reply STOP. Msg&data rates may apply.
```

### Opt-out Keywords (handled automatically by Twilio):
```
STOP, UNSUBSCRIBE, CANCEL, END, QUIT
```

### Help Keywords:
```
HELP, INFO
```

### Help Message:
```
RC Web Solutions - Professional web development services. Reply START to subscribe to updates or STOP to unsubscribe. Questions? Call (346) 375-7534 or visit rcweb.dev
```

## 🎯 Next Steps

1. ✅ Configure webhook in Twilio Console (see Step 1 above)
2. ✅ Test all commands (START, STOP, HELP)
3. ✅ Update A2P campaign with opt-in/opt-out info
4. ✅ Monitor SmsLog table for interactions
5. ✅ Wait for A2P campaign approval
6. 🎉 Start sending marketing campaigns!

## 📞 Support

If you encounter issues:
1. Check server logs: `npm run dev` and watch console
2. Check Twilio logs: https://console.twilio.com/us1/monitor/logs/sms
3. Check database: Query `SmsLog` table
4. Test endpoint: `curl https://rcweb.dev/api/twilio/sms/incoming`

---

**Created:** 2025-10-14
**Updated:** 2025-10-14
**Version:** 1.0.0
