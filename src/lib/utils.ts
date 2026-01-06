// Función para validar formato de número USA
export const validateUSPhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length === 10 || (cleaned.length === 11 && cleaned[0] === "1");
};

export function generateProjectCode(): string {
  // Genera un código de 6 caracteres fácil de recordar
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Sin I,O,0,1 para evitar confusión
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Formatea un monto en centavos a formato de moneda USD
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount / 100);
}

/**
 * Formatea una fecha a formato legible (ej: "Jan 15, 2025")
 * Maneja Date, string ISO, o null
 */
export function formatDate(
  date: Date | string | null,
  options?: {
    year?: "numeric" | "2-digit";
    month?: "numeric" | "2-digit" | "long" | "short" | "narrow";
    day?: "numeric" | "2-digit";
  }
): string {
  if (!date) return "N/A";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-US", {
    year: options?.year || "numeric",
    month: options?.month || "short",
    day: options?.day || "numeric",
  }).format(dateObj);
}

/**
 * Obtiene el label y color CSS para el status de un proyecto
 */
export function getProjectStatusLabel(status: string): {
  label: string;
  color: string;
} {
  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: "Pending", color: "bg-yellow-500/20 text-yellow-400" },
    in_progress: {
      label: "In Progress",
      color: "bg-blue-500/20 text-blue-400",
    },
    ready_for_payment: {
      label: "Ready for Payment",
      color: "bg-purple-500/20 text-purple-400",
    },
    completed: { label: "Completed", color: "bg-green-500/20 text-green-400" },
  };

  return (
    statusMap[status] || {
      label: status,
      color: "bg-gray-500/20 text-gray-400",
    }
  );
}

/**
 * Obtiene el label y color CSS para el status de un milestone
 */
export function getMilestoneStatusLabel(status: string): {
  label: string;
  color: string;
} {
  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: "Pending", color: "bg-gray-500/20 text-gray-400" },
    in_progress: {
      label: "In Progress",
      color: "bg-blue-500/20 text-blue-400",
    },
    completed: { label: "Completed", color: "bg-green-500/20 text-green-400" },
  };

  return (
    statusMap[status] || {
      label: status,
      color: "bg-gray-500/20 text-gray-400",
    }
  );
}
