import { ContactChannel } from "@/generated/prisma/enums";

/** Labels for the "how should I reach you" choice, shared by form, admin and emails */
export const CONTACT_CHANNEL_LABELS: Record<ContactChannel, string> = {
  call: "Phone",
  whatsapp: "WhatsApp",
  email: "Email",
};

export const CONTACT_CHANNELS = Object.keys(
  CONTACT_CHANNEL_LABELS
) as ContactChannel[];
