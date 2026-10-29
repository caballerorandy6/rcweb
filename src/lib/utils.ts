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

// Intl formatters are expensive to build, so each distinct configuration is
// created once and reused (the site is en-US only).
const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const usdWholeFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const numberFormatter = new Intl.NumberFormat("en-US");
const dateFormatters = new Map<string, Intl.DateTimeFormat>();

/** Cents → "$1,000.00". `whole` drops the cents: "$1,000". */
export function formatCurrency(cents: number, whole = false): string {
  return (whole ? usdWholeFormatter : usdFormatter).format(cents / 100);
}

/** Dollars (not cents) → "$12.34"; for amounts computed in dollars */
export function formatDollars(dollars: number): string {
  return usdFormatter.format(dollars);
}

/** Integer counts with thousands separators: 1234 → "1,234" */
export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

type DateFormatOptions = {
  year?: "numeric" | "2-digit";
  month?: "numeric" | "2-digit" | "long" | "short" | "narrow";
  day?: "numeric" | "2-digit";
  /** Pass "UTC" for date-only values (YYYY-MM-DD) so the day never shifts */
  timeZone?: string;
};

function toDate(date: Date | string | null): Date | null {
  if (!date) return null;
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return isNaN(dateObj.getTime()) ? null : dateObj;
}

function getDateFormatter(options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = JSON.stringify(options);
  let formatter = dateFormatters.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-US", options);
    dateFormatters.set(key, formatter);
  }
  return formatter;
}

/**
 * Readable date ("Jan 15, 2025"). Accepts Date, ISO string or null.
 */
export function formatDate(
  date: Date | string | null,
  options?: DateFormatOptions
): string {
  const dateObj = toDate(date);
  if (!dateObj) return "N/A";

  return getDateFormatter({
    year: options?.year || "numeric",
    month: options?.month || "short",
    day: options?.day || "numeric",
    timeZone: options?.timeZone,
  }).format(dateObj);
}

/** Date with time ("Jan 15, 2025, 3:42 PM") for logs and sent timestamps */
export function formatDateTime(date: Date | string | null): string {
  const dateObj = toDate(date);
  if (!dateObj) return "N/A";

  return getDateFormatter({
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
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

/**
 * Obtiene el label legible para el tipo de deliverable
 */
export function getDeliverableTypeLabel(type: string): string {
  const typeMap: Record<string, string> = {
    source_code: "Source Code",
    documentation: "Documentation",
    assets: "Assets",
    credentials: "Credentials",
    other: "Other",
  };

  return typeMap[type] || "Other";
}

/**
 * Formatea el tamaño de un archivo en bytes a formato legible (B, KB, MB)
 */
export function formatFileSize(bytes: number | null): string {
  if (!bytes) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Whole days from `now` to `date`: negative when the date has passed */
export function daysUntil(date: Date, now: Date = new Date()): number {
  return Math.round((date.getTime() - now.getTime()) / DAY_MS);
}

/** "today", "yesterday", "3 days ago" for things that already happened */
export function formatDaysAgo(date: Date, now: Date = new Date()): string {
  const days = -daysUntil(date, now);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

/** "expires today", "expires in 3 days", "expired 2 days ago" for deadlines */
export function formatDeadline(date: Date, now: Date = new Date()): string {
  const days = daysUntil(date, now);
  if (days === 0) return "due today";
  if (days === 1) return "due tomorrow";
  if (days > 1) return `due in ${days} days`;
  if (days === -1) return "1 day overdue";
  return `${-days} days overdue`;
}
