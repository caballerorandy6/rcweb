// src/lib/email/colors.ts
// Centralized color palette for email templates
// These are used with inline styles since react-email doesn't support Tailwind

export const EMAIL_COLORS = {
  // Brand
  gold: "#CBB26A",
  goldDark: "#A89048",
  goldLight: "#D9C98A",

  // Neutrals
  dark: "#1a1a1a",
  gray: "#4b5563",
  grayLight: "#9ca3af",
  lightGray: "#f3f4f6",
  white: "#ffffff",

  // Status - Success
  green: "#059669",
  greenLight: "#d1fae5",
  greenDark: "#065f46",

  // Status - Warning / Amber
  orange: "#f59e0b",
  orangeLight: "#fef3c7",
  orangeDark: "#b45309",
  amber: "#f59e0b",
  amberLight: "#fef3c7",
  amberDark: "#d97706",

  // Status - Error
  red: "#dc2626",
  redLight: "#fef2f2",
  redDark: "#991b1b",

  // Status - Info
  blue: "#3b82f6",
  blueLight: "#dbeafe",
  blueDark: "#1e40af",

  // Accent
  purple: "#7c3aed",
  purpleLight: "#ede9fe",
  purpleDark: "#5b21b6",
} as const;

export type EmailColorKey = keyof typeof EMAIL_COLORS;
