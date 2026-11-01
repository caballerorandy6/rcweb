import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { z } from "zod";
import type { AppPathname, Locale } from "@/i18n/routing";

/**
 * Legal documents (Privacy, Terms, Refund) live as Markdown in
 * `content/legal/<locale>/<id>.md`, one file per language with the same
 * structure. The front matter carries the page chrome (title, subtitle, meta
 * description, intro card, footnote); the body is split into one `<section>`
 * per `##` heading. Two extras on top of plain Markdown:
 *
 * - `## Heading {#anchor}` gives the section an id (`/privacy-policy#cookies`).
 * - A line `<!-- slot:analytics-opt-out -->` is replaced by the matching
 *   React component (see components/legal/LegalDocument).
 * - `> [!note] …` / `[!warning]` / `[!danger]` / `[!success]` render as
 *   coloured callouts instead of quotes (see lib/markdown/remarkCallouts).
 *
 * The date shown as "Last updated" comes from LEGAL_LAST_UPDATED, not from
 * the files, so the three pages and the stored terms version stay in sync.
 */

export const LEGAL_DOCUMENTS = {
  "privacy-policy": "/privacy-policy",
  "terms-of-service": "/terms-of-service",
  "refund-policy": "/refund-policy",
} as const satisfies Record<string, AppPathname>;

export type LegalDocumentId = keyof typeof LEGAL_DOCUMENTS;

export const LEGAL_SLOTS = ["analytics-opt-out"] as const;
export type LegalSlot = (typeof LEGAL_SLOTS)[number];

export type LegalSectionPart =
  | { kind: "markdown"; markdown: string }
  | { kind: "slot"; slot: LegalSlot };

export type LegalSection = {
  /** Anchor from `{#id}` on the heading; stable across languages */
  id?: string;
  title: string;
  parts: LegalSectionPart[];
};

export type LegalDocument = {
  id: LegalDocumentId;
  locale: Locale;
  title: string;
  subtitle: string;
  description: string;
  /** Paragraphs of the intro card, inline Markdown allowed */
  intro: string[];
  footnote?: string;
  sections: LegalSection[];
};

const frontMatterSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  description: z.string().min(1),
  intro: z.array(z.string().min(1)).min(1),
  footnote: z.string().min(1).optional(),
});

const legalDirectory = path.join(process.cwd(), "content/legal");

const HEADING = /^(.+?)(?:\s*\{#([\w-]+)\})?\s*$/;
const SLOT_LINE = /^<!--\s*slot:([\w-]+)\s*-->\s*$/m;

function isSlot(name: string): name is LegalSlot {
  return (LEGAL_SLOTS as readonly string[]).includes(name);
}

function parseParts(markdown: string, where: string): LegalSectionPart[] {
  const parts: LegalSectionPart[] = [];
  // split with a capture group alternates markdown and slot names
  markdown.split(SLOT_LINE).forEach((chunk, index) => {
    if (index % 2 === 1) {
      if (!isSlot(chunk)) throw new Error(`Unknown legal slot "${chunk}" in ${where}`);
      parts.push({ kind: "slot", slot: chunk });
      return;
    }
    const text = chunk.trim();
    if (text) parts.push({ kind: "markdown", markdown: text });
  });
  return parts;
}

function parseSections(body: string, where: string): LegalSection[] {
  const [preamble, ...chunks] = body.split(/^## /m);
  if (preamble.trim()) {
    throw new Error(`${where}: content before the first "## " heading is not rendered`);
  }
  return chunks.map((chunk) => {
    const newline = chunk.indexOf("\n");
    const headingLine = newline === -1 ? chunk : chunk.slice(0, newline);
    const content = newline === -1 ? "" : chunk.slice(newline + 1);
    const match = HEADING.exec(headingLine.trim());
    if (!match) throw new Error(`${where}: unreadable heading "${headingLine}"`);
    const [, title, id] = match;
    return { ...(id && { id }), title, parts: parseParts(content, `${where} › ${title}`) };
  });
}

/** Reads and parses one legal document; throws on a malformed file (build-time error) */
export const getLegalDocument = cache((id: LegalDocumentId, locale: Locale): LegalDocument => {
  const file = path.join(legalDirectory, locale, `${id}.md`);
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const where = `content/legal/${locale}/${id}.md`;
  const front = frontMatterSchema.parse(data);
  return { id, locale, ...front, sections: parseSections(content, where) };
});
