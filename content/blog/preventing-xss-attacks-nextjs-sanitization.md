---
title: "Preventing XSS Attacks in Next.js: A Practical Guide to Input Sanitization"
description: "Learn how we implemented input sanitization in our Next.js application to prevent Cross-Site Scripting (XSS) attacks. Practical examples and code you can use in your own projects."
date: "2025-12-22"
author: "Randy Caballero"
image: "/og-image.jpg"
tags: ["Security", "XSS", "Next.js", "Web Development", "Sanitization", "Best Practices"]
---

# Preventing XSS Attacks in Next.js: A Practical Guide to Input Sanitization

Security isn't optional. When building web applications, protecting your users from Cross-Site Scripting (XSS) attacks should be a priority from day one. In this article, I'll share how we implemented input sanitization in our Next.js application.

---

## What is XSS?

Cross-Site Scripting (XSS) occurs when an attacker injects malicious scripts into content that other users view. For example, imagine someone submits this as their "name" in a contact form:

```html
<script>alert('Hacked!')</script>
```

If your application renders this directly in an email or webpage without sanitization, the script could execute and potentially steal user data, session cookies, or perform actions on behalf of the user.

---

## The Solution: HTML Escaping

The fix is straightforward: convert dangerous characters into safe HTML entities before rendering. Here's our implementation:

```typescript
// src/lib/sanitize.ts

const htmlEscapes: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
  "`": "&#x60;",
  "=": "&#x3D;",
};

export function escapeHtml(text: string | null | undefined): string {
  if (!text) return "";
  return text.replace(/[&<>"'`=/]/g, (char) => htmlEscapes[char] || char);
}
```

Now, malicious input becomes harmless:

| Input | Output |
|-------|--------|
| `<script>alert('hack')</script>` | `&lt;script&gt;alert(&#x27;hack&#x27;)&lt;/script&gt;` |

The browser displays the text literally instead of executing it as code.

---

## Specialized Sanitizers

Different data types need different handling:

### Email Sanitization

```typescript
export function sanitizeEmail(email: string | null | undefined): string {
  if (!email) return "";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return escapeHtml(email);
  }
  return escapeHtml(email);
}
```

### Phone Number Sanitization

```typescript
export function sanitizePhone(phone: string | null | undefined): string {
  if (!phone) return "";
  // Remove everything except digits, spaces, and phone-related characters
  const sanitized = phone.replace(/[^\d\s+()-]/g, "");
  return escapeHtml(sanitized);
}
```

---

## Where to Apply Sanitization

**Always sanitize when user input will be rendered as HTML:**

- Email templates
- Web pages that display user-generated content
- PDF generation
- Any HTML response

**You may not need sanitization when:**

- Data is stored in a database (use parameterized queries instead)
- Data is sent to external APIs (they handle their own security)
- Data comes from trusted internal sources

### Our Implementation

We apply sanitization in two key places:

1. **Contact Form API** (`/api/receive-mail/route.ts`)
2. **Contact Form Action** (`createContactAction.ts`)

Both of these render user input in HTML emails sent to our admin.

```typescript
// In our contact action
const safeName = escapeHtml(name);
const safeEmail = sanitizeEmail(email);
const safePhone = sanitizePhone(phone);
const safeMessage = escapeHtml(message);

// Use sanitized values in the email template
await resend.emails.send({
  subject: `New message from ${safeName}`,
  html: `<p>Message: ${safeMessage}</p>`
});
```

---

## Common Mistakes to Avoid

### 1. Sanitizing Too Late

```typescript
// Wrong: sanitizing after storing
const user = await prisma.user.create({ data: { name: userInput } });
const safeName = escapeHtml(user.name); // Too late if already rendered elsewhere
```

### 2. Forgetting Edge Cases

```typescript
// Wrong: not handling null/undefined
function escapeHtml(text: string): string {
  return text.replace(/</g, "&lt;"); // Crashes if text is null
}

// Correct: handle edge cases
function escapeHtml(text: string | null | undefined): string {
  if (!text) return "";
  // ...
}
```

### 3. Over-Sanitizing

Don't sanitize data that doesn't need it. If you're storing an email address in a database with parameterized queries, you don't need to escape HTML characters—the database driver handles SQL injection prevention.

---

## Testing Your Sanitization

Try these test inputs in your forms:

```
<script>alert('XSS')</script>
"><img src=x onerror=alert('XSS')>
javascript:alert('XSS')
<iframe src="javascript:alert('XSS')">
```

If any of these execute instead of displaying as text, you have a vulnerability.

---

## Conclusion

Input sanitization is one of the simplest yet most important security measures you can implement. The key principles:

1. **Never trust user input**
2. **Sanitize before rendering, not before storing**
3. **Use the right sanitization for each data type**
4. **Test with malicious inputs**

Security is an ongoing process, not a one-time task. Start with these basics and build from there.

---

*Need help securing your web application? [Contact us](/contact) for a security review.*
