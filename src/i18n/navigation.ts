import type { ComponentProps } from "react";
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware replacements for next/link and next/navigation. Public code
 * imports these so every internal link, redirect and pathname carries the
 * visitor's language and the translated slug (`/es/sobre-mi`, not `/about`).
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

/** Any internal destination `Link` accepts: a known pathname, or one with params, query or hash */
export type Href = ComponentProps<typeof Link>["href"];
