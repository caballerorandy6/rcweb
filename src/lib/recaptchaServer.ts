const RECAPTCHA_MIN_SCORE = 0.5;

/**
 * Verifies a reCAPTCHA v3 token on the server. The token must be valid, come
 * from the expected action and score like a human. Shared by every public
 * form (contact, guide download).
 */
export async function verifyRecaptcha(
  token: string | undefined,
  expectedAction: string
): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.warn("⚠️ reCAPTCHA secret key not configured; skipping verification");
    return true;
  }

  // Sin token no hay forma de probar que es una persona: un bot podría omitirlo.
  if (!token) {
    return false;
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: secretKey, response: token }),
    });

    const data = await response.json();

    if (
      data.success &&
      data.action === expectedAction &&
      data.score >= RECAPTCHA_MIN_SCORE
    ) {
      return true;
    }

    console.warn(
      `🚫 reCAPTCHA failed. Score: ${data.score}, Action: ${data.action}, Success: ${data.success}, Hostname: ${data.hostname}, Errors: ${JSON.stringify(data["error-codes"] ?? [])}`
    );
    return false;
  } catch (error) {
    // Si Google no responde se deja pasar para no bloquear clientes reales;
    // un atacante no puede provocar esta falla desde el navegador.
    console.error("❌ reCAPTCHA verification error:", error);
    return true;
  }
}
