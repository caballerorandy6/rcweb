import type { Messages } from "next-intl";

/**
 * Namespaces that client components read with `useTranslations` on every
 * page. Only these are serialized into the HTML for the browser; long page
 * copy and legal texts stay on the server. Add a namespace here when a
 * `'use client'` component used site-wide starts using it; a page-specific
 * client island gets its namespace through <PageMessages> instead.
 */
export const CLIENT_NAMESPACES = [
  "Common",
  "Nav",
  "Forms",
  "Stepper",
  "Marquee",
  "FloatingCta",
  "Chat",
  "NotFound",
  "ErrorPage",
] as const satisfies readonly (keyof Messages)[];

export type ClientNamespace = (typeof CLIENT_NAMESPACES)[number];

export function pickClientMessages<Extra extends keyof Messages>(
  messages: Messages,
  extra: readonly Extra[] = []
): Pick<Messages, ClientNamespace | Extra> {
  const names = [...CLIENT_NAMESPACES, ...extra] as (ClientNamespace | Extra)[];
  return Object.fromEntries(names.map((ns) => [ns, messages[ns]])) as Pick<
    Messages,
    ClientNamespace | Extra
  >;
}
