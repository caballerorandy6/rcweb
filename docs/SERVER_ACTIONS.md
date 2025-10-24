# Server Actions Documentation

Complete reference for all server actions in RC Web Solutions.

## Table of Contents

- [Overview](#overview)
- [Admin Actions](#admin-actions)
- [Authentication Actions](#authentication-actions)
- [Campaign Actions](#campaign-actions)
- [Contact Actions](#contact-actions)
- [Payment Actions](#payment-actions)
- [Project Actions](#project-actions)
- [Statistics Actions](#statistics-actions)
- [Usage Guidelines](#usage-guidelines)

---

## Overview

Server Actions are server-side functions that can be called directly from Client Components. They provide:

- **Type Safety** - Full TypeScript support
- **Better Performance** - No API route overhead
- **Simpler Code** - Direct function calls instead of fetch
- **Security** - Not exposed as public endpoints

### General Pattern

All server actions follow this pattern:

```typescript
"use server";

import { prisma } from "@/lib/prisma";

type ActionResult = {
  success: boolean;
  error?: string;
  data?: any;
};

export async function actionName(params: Type): Promise<ActionResult> {
  try {
    // Perform operation
    return { success: true, data };
  } catch (error) {
    console.error("Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
```

---

## Admin Actions

Located in `src/actions/admin/`

### processPendingInvoicesAction

Processes all pending invoices that haven't been created yet.

**Location:** `src/actions/admin/processPendingInvoicesAction.ts`

**Parameters:** None

**Returns:**
```typescript
{
  success: boolean;
  processed: number;
  results: InvoiceResult[];
  error?: string;
}
```

**Usage:**
```typescript
import { processPendingInvoicesAction } from "@/actions/admin/processPendingInvoicesAction";

const result = await processPendingInvoicesAction();
if (result.success) {
  console.log(`Processed ${result.processed} invoices`);
}
```

**Description:**
- Finds all payments with `firstPaid: true` but no initial invoice
- Creates and sends invoice for each payment
- Returns detailed results for each operation

---

### updateProjectStatusAction

Updates project status and sends notification email when ready.

**Location:** `src/actions/admin/updateProjectStatusAction.ts`

**Parameters:**
```typescript
projectCode: string          // Unique project identifier
status: ProjectStatus        // "in_progress" | "ready_for_payment" | "completed"
```

**Returns:**
```typescript
{
  success: boolean;
  error?: string;
}
```

**Usage:**
```typescript
import { updateProjectStatusAction } from "@/actions/admin/updateProjectStatusAction";

const result = await updateProjectStatusAction("WEB-2024-001", "ready_for_payment");
```

**Description:**
- Updates project status in database
- If status is "ready_for_payment", sends automated email to customer
- Email includes final payment amount and payment link

---

## Authentication Actions

Located in `src/actions/auth/`

### signOutAction

Signs out the current user.

**Location:** `src/actions/auth/signOutAction.ts`

**Parameters:** None

**Returns:** `void`

**Usage:**
```typescript
import { signOutAction } from "@/actions/auth/signOutAction";

<button onClick={() => signOutAction()}>
  Sign Out
</button>
```

**Description:**
- Uses NextAuth's `signOut()` function
- Redirects to login page after sign out
- Clears session cookies

---

## Campaign Actions

Located in `src/actions/campaigns/`

### sendNewsletterAction

Sends a newsletter email to a single contact.

**Location:** `src/actions/campaigns/sendNewsletterAction.ts`

**Parameters:**
```typescript
{
  email: string;
  subject: string;
  content: string;
}
```

**Returns:**
```typescript
{
  success: boolean;
  error?: string;
}
```

**Usage:**
```typescript
import { sendNewsletterAction } from "@/actions/campaigns/sendNewsletterAction";

const result = await sendNewsletterAction({
  email: "customer@example.com",
  subject: "Monthly Newsletter",
  content: "Your newsletter content here..."
});
```

---

### sendBatchNewsletterAction

Sends newsletter to multiple contacts in batch.

**Location:** `src/actions/campaigns/sendBatchNewsletterAction.ts`

**Parameters:**
```typescript
{
  subject: string;
  content: string;
  contactIds: string[];  // Array of contact IDs to send to
}
```

**Returns:**
```typescript
{
  success: boolean;
  sent: number;
  failed: number;
  results: Array<{ email: string; success: boolean; error?: string }>;
}
```

**Usage:**
```typescript
import { sendBatchNewsletterAction } from "@/actions/campaigns/sendBatchNewsletterAction";

const result = await sendBatchNewsletterAction({
  subject: "New Product Launch",
  content: "<h1>Check out our new product!</h1>",
  contactIds: ["id1", "id2", "id3"]
});

console.log(`Sent: ${result.sent}, Failed: ${result.failed}`);
```

---

### sendSMSCampaignAction

Sends SMS campaign to contacts with marketing consent.

**Location:** `src/actions/campaigns/sendSMSCampaignAction.ts`

**Parameters:**
```typescript
{
  message: string;        // SMS message (max 160 chars recommended)
  contactIds: string[];   // Contacts to send to
}
```

**Returns:**
```typescript
{
  success: boolean;
  sent: number;
  failed: number;
  results: Array<{ phone: string; success: boolean; error?: string }>;
}
```

**Usage:**
```typescript
import { sendSMSCampaignAction } from "@/actions/campaigns/sendSMSCampaignAction";

const result = await sendSMSCampaignAction({
  message: "Limited time offer! Visit rcweb.dev for details. Reply STOP to opt-out.",
  contactIds: ["id1", "id2"]
});
```

**Important:**
- Only sends to contacts with `marketingConsent: true`
- Includes automatic opt-out message
- Logs all SMS in `SmsLog` table
- Compliant with A2P 10DLC regulations

---

### sendFinalPaymentEmailAction

Sends final payment reminder email to customer.

**Location:** `src/actions/campaigns/sendFinalPaymentEmailAction.ts`

**Parameters:**
```typescript
{
  email: string;
  projectCode: string;
  amount: number;          // Amount in dollars
  planName: string;
}
```

**Returns:**
```typescript
{
  success: boolean;
  error?: string;
}
```

---

### downloadGuideAction

Sends downloadable guide to user's email.

**Location:** `src/actions/campaigns/downloadGuideAction.ts`

**Parameters:**
```typescript
email: string  // Email to send guide to
```

**Returns:**
```typescript
{
  success: boolean;
  error?: string;
}
```

---

### getMarketingConsentAction

Retrieves marketing consent status for contacts.

**Location:** `src/actions/campaigns/getMarketingConsentAction.ts`

**Returns:**
```typescript
{
  success: boolean;
  consented: number;      // Contacts who opted in
  total: number;          // Total contacts
  percentage: number;     // Consent rate
}
```

---

### unsubscribeFromEmailAction

Unsubscribes user from email marketing.

**Location:** `src/actions/campaigns/unsubscribeFromEmailAction.ts`

**Parameters:**
```typescript
email: string  // Email to unsubscribe
```

**Returns:**
```typescript
{
  success: boolean;
  error?: string;
}
```

**Description:**
- Sets `marketingConsent: false` for contact
- GDPR compliant
- Works even if contact doesn't exist (creates record with consent=false)

---

## Contact Actions

Located in `src/actions/contacts/`

### createContactAction

Creates a new contact in the CRM.

**Location:** `src/actions/contacts/createContactAction.ts`

**Parameters:**
```typescript
FormData containing:
- name: string
- email: string
- phone?: string
- message?: string
- source?: string        // Lead source
- marketingConsent?: boolean
```

**Returns:**
```typescript
{
  success: boolean;
  contact?: Contact;
  error?: string;
}
```

**Usage:**
```typescript
import { createContactAction } from "@/actions/contacts/createContactAction";

<form action={createContactAction}>
  <input name="name" required />
  <input name="email" type="email" required />
  <input name="phone" />
  <textarea name="message" />
  <button type="submit">Submit</button>
</form>
```

---

### getContactsAction

Retrieves all contacts from database.

**Location:** `src/actions/contacts/getContactsAction.ts`

**Returns:**
```typescript
{
  success: boolean;
  contacts?: Contact[];
  error?: string;
}
```

**Contact type:**
```typescript
{
  id: string;
  name: string;
  email: string;
  marketingConsent: boolean;
  source: string | null;
  createdAt: Date;
  phones: ContactPhone[];
}
```

---

### getTotalContactsAction

Gets total count of contacts.

**Location:** `src/actions/contacts/getTotalContactsAction.ts`

**Returns:**
```typescript
{
  success: boolean;
  total?: number;
  error?: string;
}
```

---

### updateContactAction

Updates existing contact information.

**Location:** `src/actions/contacts/updateContactAction.ts`

**Parameters:**
```typescript
{
  id: string;
  name?: string;
  email?: string;
  marketingConsent?: boolean;
}
```

**Returns:**
```typescript
{
  success: boolean;
  contact?: Contact;
  error?: string;
}
```

---

### deleteContactAction

Deletes a contact and all associated data.

**Location:** `src/actions/contacts/deleteContactAction.ts`

**Parameters:**
```typescript
contactId: string
```

**Returns:**
```typescript
{
  success: boolean;
  error?: string;
}
```

**Warning:** This is a permanent deletion. Associated phone numbers are also deleted.

---

## Payment Actions

Located in `src/actions/payments/`

### createStripeCheckoutAction

Creates Stripe checkout session for initial payment.

**Location:** `src/actions/payments/createStripeCheckoutAction.ts`

**Parameters:**
```typescript
{
  name: string;
  email: string;
  planName: string;
  planPrice: number;       // In cents
  planDescription: string;
}
```

**Returns:**
```typescript
{
  success: boolean;
  url?: string;            // Stripe checkout URL
  error?: string;
}
```

**Usage:**
```typescript
import { createStripeCheckoutAction } from "@/actions/payments/createStripeCheckoutAction";

const result = await createStripeCheckoutAction({
  name: "John Doe",
  email: "john@example.com",
  planName: "Professional Plan",
  planPrice: 299900,  // $2,999.00
  planDescription: "Custom web application"
});

if (result.success && result.url) {
  window.location.href = result.url;  // Redirect to Stripe
}
```

**Description:**
- Creates 50% payment (initial deposit)
- Generates unique project code
- Creates Payment record in database
- Redirects to Stripe checkout

---

### createFinalPaymentSessionAction

Creates Stripe checkout for final 50% payment.

**Location:** `src/actions/payments/createFinalPaymentSessionAction.ts`

**Parameters:**
```typescript
{
  projectCode: string;
  email: string;
}
```

**Returns:**
```typescript
{
  success: boolean;
  url?: string;
  error?: string;
}
```

**Description:**
- Verifies project code and email match
- Checks first payment was completed
- Creates checkout for remaining 50%

---

### handlePaymentSuccessAction

Handles post-payment processing (called from payment success page).

**Location:** `src/actions/payments/handlePaymentSuccessAction.ts`

**Parameters:**
```typescript
sessionId: string  // Stripe session ID
```

**Returns:**
```typescript
{
  success: boolean;
  payment?: Payment;
  fallbackUsed: boolean;
  error?: string;
}
```

**Description:**
- Waits for webhook to process payment (preferred)
- Falls back to direct processing if webhook delays
- Implements exponential backoff
- Prevents duplicate processing

---

## Project Actions

Located in `src/actions/projects/`

### getAllProjectsAction

Retrieves all projects with payment information.

**Location:** `src/actions/projects/getAllProjectsAction.ts`

**Returns:**
```typescript
{
  success: boolean;
  projects?: Payment[];  // Projects are stored as Payment records
  error?: string;
}
```

---

### getProjectStatsAction

Gets aggregated project statistics.

**Location:** `src/actions/projects/getProjectStatsAction.ts`

**Returns:**
```typescript
{
  success: boolean;
  stats?: {
    total: number;
    completed: number;
    inProgress: number;
    readyForPayment: number;
  };
  error?: string;
}
```

---

### updateProjectStatusAction

Updates project status.

**Location:** `src/actions/projects/updateProjectStatusAction.ts`

**Parameters:**
```typescript
{
  projectCode: string;
  status: "in_progress" | "ready_for_payment" | "completed";
}
```

**Returns:**
```typescript
{
  success: boolean;
  error?: string;
}
```

---

### markProjectAsCompleteAction

Marks project as completed.

**Location:** `src/actions/projects/markProjectAsCompleteAction.ts`

**Parameters:**
```typescript
projectCode: string
```

**Returns:**
```typescript
{
  success: boolean;
  error?: string;
}
```

---

### verifyProjectAccessAction

Verifies user has access to project (for final payment).

**Location:** `src/actions/projects/verifyProjectAccessAction.ts`

**Parameters:**
```typescript
{
  projectCode: string;
  email: string;
}
```

**Returns:**
```typescript
{
  success: boolean;
  hasAccess: boolean;
  payment?: Payment;
  error?: string;
}
```

---

## Statistics Actions

Located in `src/actions/stats/`

### getNewsletterStatsAction

Gets email newsletter statistics.

**Location:** `src/actions/stats/getNewsletterStatsAction.ts`

**Returns:**
```typescript
{
  success: boolean;
  stats?: {
    total: number;
    sent: number;
    failed: number;
  };
  error?: string;
}
```

---

### getTotalEmailsSentAction

Gets total count of emails sent.

**Location:** `src/actions/stats/getTotalEmailsSentAction.ts`

**Returns:**
```typescript
{
  success: boolean;
  total?: number;
  error?: string;
}
```

---

### getSmsStatsAction

Gets SMS campaign statistics.

**Location:** `src/actions/stats/getSmsStatsAction.ts`

**Returns:**
```typescript
{
  success: boolean;
  stats?: {
    total: number;
    sent: number;
    received: number;
    optIns: number;
    optOuts: number;
  };
  error?: string;
}
```

---

### getTotalSMSSentAction

Gets total SMS messages sent.

**Location:** `src/actions/stats/getTotalSMSSentAction.ts`

**Returns:**
```typescript
{
  success: boolean;
  total?: number;
  error?: string;
}
```

---

## Usage Guidelines

### 1. Importing Server Actions

```typescript
// ✅ Named imports
import { createContactAction } from "@/actions/contacts/createContactAction";

// ❌ Don't use default imports
import createContactAction from "@/actions/contacts/createContactAction";
```

### 2. Error Handling

Always handle errors gracefully:

```typescript
const result = await createContactAction(formData);

if (result.success) {
  toast.success("Contact created!");
  router.push("/contacts");
} else {
  toast.error(result.error || "Failed to create contact");
}
```

### 3. Loading States

Show loading states for better UX:

```typescript
const [isLoading, setIsLoading] = useState(false);

async function handleSubmit() {
  setIsLoading(true);
  try {
    const result = await createContactAction(data);
    // Handle result
  } finally {
    setIsLoading(false);
  }
}
```

### 4. Form Actions

Use server actions directly in forms:

```typescript
<form action={createContactAction}>
  {/* form fields */}
</form>
```

### 5. Type Safety

Always import and use types:

```typescript
import { createContactAction } from "@/actions/contacts/createContactAction";
import type { Contact } from "@prisma/client";

const result = await createContactAction(data);
if (result.success && result.contact) {
  const contact: Contact = result.contact;
  // TypeScript knows the shape of contact
}
```

---

## Best Practices

1. **Always use `"use server"` directive** at the top of server action files
2. **Return consistent result objects** with `success`, `data`, and `error`
3. **Log errors** with `console.error` for debugging
4. **Validate inputs** before processing
5. **Use transactions** for multi-step database operations
6. **Keep actions focused** - one action, one purpose
7. **Document parameters** with TypeScript types
8. **Handle edge cases** - null checks, empty arrays, etc.

---

For more information, see:
- [README.md](../README.md) - Project overview
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [Next.js Server Actions Docs](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
