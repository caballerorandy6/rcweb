/**
 * Where a lead came from (Contact.source) and the UTM source of a campaign
 * URL: labels and colours shared by the dashboard's Lead sources card and the
 * contacts list.
 */

const LEAD_SOURCE_LABELS: Record<string, string> = {
  contact_form: "Contact form",
  guide_download: "Guide download",
  exit_intent: "Exit intent popup",
  google_places: "Google Places import",
  sms_opt_in: "SMS opt-in",
  sms_opt_out: "SMS opt-out",
  blog_subscription: "Blog subscription",
  whatsapp: "WhatsApp",
  schedule_call: "Schedule call",
  manual: "Manual entry",
  unknown: "Unknown",
};

const LEAD_SOURCE_COLORS: Record<string, string> = {
  contact_form: "#3B82F6", // blue
  guide_download: "#10B981", // green
  exit_intent: "#F59E0B", // amber
  google_places: "#8B5CF6", // purple
  sms_opt_in: "#06B6D4", // cyan
  sms_opt_out: "#F87171", // red
  blog_subscription: "#A855F7", // violet
  whatsapp: "#22C55E", // WhatsApp green
  schedule_call: "#EC4899", // pink
  manual: "#6B7280", // gray
  unknown: "#9CA3AF", // light gray
};

const UTM_SOURCE_COLORS: Record<string, string> = {
  google: "#4285F4",
  facebook: "#1877F2",
  instagram: "#E4405F",
  linkedin: "#0A66C2",
  twitter: "#1DA1F2",
  x: "#9CA3AF",
  tiktok: "#9CA3AF",
  email: "#EA4335",
  newsletter: "#34A853",
  direct: "#6B7280",
  organic: "#22C55E",
  referral: "#8B5CF6",
  nextdoor: "#8ED500",
  yelp: "#FF1A1A",
};

const UNKNOWN_COLOR = "#9CA3AF";

/**
 * Canonical key for a stored source: old rows kept "SMS_OPT_IN" in uppercase
 * and some have no source at all.
 */
export function normalizeLeadSource(source: string | null | undefined): string {
  const key = source?.trim().toLowerCase();
  return key ? key : "unknown";
}

/** "contact_form" → "Contact form"; unknown keys fall back to the key with spaces */
export function leadSourceLabel(source: string | null | undefined): string {
  const key = normalizeLeadSource(source);
  return LEAD_SOURCE_LABELS[key] ?? key.replaceAll("_", " ");
}

export function leadSourceColor(source: string | null | undefined): string {
  return LEAD_SOURCE_COLORS[normalizeLeadSource(source)] ?? UNKNOWN_COLOR;
}

/** Colour for a utm_source value ("google", "Facebook"…); grey when not a known network */
export function utmSourceColor(utmSource: string | null | undefined): string {
  return UTM_SOURCE_COLORS[normalizeLeadSource(utmSource)] ?? UNKNOWN_COLOR;
}
