/**
 * Sanitizes user input to prevent XSS attacks
 * Escapes HTML special characters
 */
export function escapeHtml(text: string | null | undefined): string {
  if (!text) return "";

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

  return text.replace(/[&<>"'`=/]/g, (char) => htmlEscapes[char] || char);
}

/**
 * Sanitizes email address for safe display
 * Validates format and escapes special characters
 */
export function sanitizeEmail(email: string | null | undefined): string {
  if (!email) return "";

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return escapeHtml(email);
  }

  return escapeHtml(email);
}

/**
 * Sanitizes phone number for safe display
 * Removes non-numeric characters except + and spaces
 */
export function sanitizePhone(phone: string | null | undefined): string {
  if (!phone) return "";

  // Keep only numbers, +, spaces, parentheses, and dashes
  const sanitized = phone.replace(/[^\d\s+()-]/g, "");
  return escapeHtml(sanitized);
}
