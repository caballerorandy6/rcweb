// Carga reCAPTCHA v3 bajo demanda y garantiza que exista un token antes de enviar.
// El servidor rechaza envíos sin token, así que no se puede depender de que el
// script "probablemente" ya haya cargado.
declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

const SCRIPT_ID = "recaptcha-v3-script";
const LOAD_TIMEOUT_MS = 10000;

let loadPromise: Promise<void> | null = null;

export function loadRecaptcha(): Promise<void> {
  if (!RECAPTCHA_SITE_KEY) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      loadPromise = null;
      reject(new Error("reCAPTCHA took too long to load"));
    }, LOAD_TIMEOUT_MS);

    const onReady = () =>
      window.grecaptcha!.ready(() => {
        window.clearTimeout(timeout);
        resolve();
      });

    if (window.grecaptcha) {
      onReady();
      return;
    }

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
      script.async = true;
      document.head.appendChild(script);
    }

    script.addEventListener("load", onReady, { once: true });
    script.addEventListener(
      "error",
      () => {
        window.clearTimeout(timeout);
        loadPromise = null;
        reject(new Error("reCAPTCHA failed to load"));
      },
      { once: true }
    );
  });

  return loadPromise;
}

export async function getRecaptchaToken(action: string): Promise<string> {
  if (!RECAPTCHA_SITE_KEY) return "";
  await loadRecaptcha();
  return window.grecaptcha!.execute(RECAPTCHA_SITE_KEY, { action });
}
