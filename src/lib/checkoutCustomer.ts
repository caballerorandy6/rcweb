// Datos del cliente durante el checkout: viven en sessionStorage y nunca en la URL,
// para que nombre y email no terminen en Google Analytics, logs ni historial.
const CHECKOUT_CUSTOMER_KEY = "rcweb_checkout_customer";

export interface CheckoutCustomer {
  name: string;
  email: string;
}

export function saveCheckoutCustomer(customer: CheckoutCustomer) {
  sessionStorage.setItem(CHECKOUT_CUSTOMER_KEY, JSON.stringify(customer));
}

export function getCheckoutCustomer(): CheckoutCustomer | null {
  try {
    const stored = sessionStorage.getItem(CHECKOUT_CUSTOMER_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (typeof parsed?.name !== "string" || typeof parsed?.email !== "string") {
      return null;
    }
    return { name: parsed.name, email: parsed.email };
  } catch {
    return null;
  }
}
