import { describe, expect, it } from "vitest";
import { getLegalDocument, LEGAL_DOCUMENTS, type LegalDocumentId } from "./legal";
import { routing } from "@/i18n/routing";

const ids = Object.keys(LEGAL_DOCUMENTS) as LegalDocumentId[];

describe("legal documents", () => {
  for (const id of ids) {
    describe(id, () => {
      const docs = routing.locales.map((locale) => getLegalDocument(id, locale));
      const [english, ...others] = docs;

      it("parses in every language with a title, description and intro", () => {
        for (const doc of docs) {
          expect(doc.title).not.toBe("");
          expect(doc.description.length).toBeGreaterThan(50);
          expect(doc.intro.length).toBeGreaterThan(0);
          expect(doc.sections.length).toBeGreaterThan(5);
        }
      });

      it("keeps the same sections, anchors and slots in every translation", () => {
        const shape = (doc: (typeof docs)[number]) =>
          doc.sections.map((section) => ({
            id: section.id ?? null,
            parts: section.parts.map((part) => (part.kind === "slot" ? part.slot : "markdown")),
          }));
        for (const doc of others) {
          expect(shape(doc), doc.locale).toEqual(shape(english));
        }
      });

      it("links only to pages that exist in routing.pathnames", () => {
        for (const doc of docs) {
          const markdown = doc.sections
            .flatMap((section) => section.parts)
            .map((part) => (part.kind === "markdown" ? part.markdown : ""))
            .join("\n");
          for (const [, href] of markdown.matchAll(/\]\((\/[^)#]*)/g)) {
            expect(href in routing.pathnames, `${doc.locale}: ${href}`).toBe(true);
          }
        }
      });
    });
  }

  it("keeps the anchors the footer and the Google audit link to", () => {
    const privacy = getLegalDocument("privacy-policy", "en");
    const anchors = privacy.sections.map((section) => section.id).filter(Boolean);
    expect(anchors).toEqual(expect.arrayContaining(["cookies", "youtube"]));
  });

  it("places the analytics switch in the privacy policy only", () => {
    const hasSlot = (id: LegalDocumentId) =>
      getLegalDocument(id, "en").sections.some((section) =>
        section.parts.some((part) => part.kind === "slot" && part.slot === "analytics-opt-out")
      );
    expect(hasSlot("privacy-policy")).toBe(true);
    expect(hasSlot("terms-of-service")).toBe(false);
    expect(hasSlot("refund-policy")).toBe(false);
  });
});
