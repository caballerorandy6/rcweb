import type { Messages } from "next-intl";

/**
 * Namespaces that client components read with `useTranslations`. Only these
 * are serialized into the page for the browser; everything else (long page
 * copy, legal texts) stays on the server. Add a namespace here when a
 * `'use client'` component starts using it.
 */
export const CLIENT_NAMESPACES = [
  "Common",
  "Nav",
  "Forms",
  "Stepper",
  "Marquee",
  "FloatingCta",
  "Chat",
] as const satisfies readonly (keyof Messages)[];

export type ClientNamespace = (typeof CLIENT_NAMESPACES)[number];

export function pickClientMessages(messages: Messages): Pick<Messages, ClientNamespace> {
  return Object.fromEntries(
    CLIENT_NAMESPACES.map((ns) => [ns, messages[ns]])
  ) as Pick<Messages, ClientNamespace>;
}
