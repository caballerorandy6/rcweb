import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import LegalMarkdown from "./LegalMarkdown";

// next-intl's Link needs a request; a plain anchor that prints the href is enough here
vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...rest }: { href: unknown; children: React.ReactNode }) => (
    <a href={JSON.stringify(href)} {...rest}>
      {children}
    </a>
  ),
}));

const render = (markdown: string) => renderToStaticMarkup(<LegalMarkdown>{markdown}</LegalMarkdown>);

describe("LegalMarkdown", () => {
  it("turns a `[!tone]` blockquote into a coloured note box without the marker", () => {
    const html = render("> [!warning] Deliverables are **accepted** after 7 days.");
    expect(html).toContain('role="note"');
    expect(html).toContain("border-amber-500/30");
    expect(html).toContain("<p>Deliverables are <strong>accepted</strong> after 7 days.</p>");
    expect(html).not.toContain("[!warning]");
  });

  it("keeps inline markup right after the marker", () => {
    const html = render("> [!note] **Response Timeframe:** 45 days.");
    expect(html).toContain("<p><strong>Response Timeframe:</strong> 45 days.</p>");
    expect(html).toContain("border-gold/30");
  });

  it("renders plain blockquotes as notes too, defaulting to the gold tone", () => {
    expect(render("> Just a quote.")).toContain("border-gold/30");
  });

  it("turns site paths into locale-aware links, hash included", () => {
    const html = render("[portal](/manage-subscription) and [pricing](/#pricing)");
    expect(html).toContain('href="&quot;/manage-subscription&quot;"');
    expect(html).toContain('href="{&quot;pathname&quot;:&quot;/&quot;,&quot;hash&quot;:&quot;pricing&quot;}"');
  });

  it("opens external links in a new tab and sends tel: links through the tracked phone link", () => {
    const html = render("[Stripe](https://stripe.com/privacy) · [call](tel:+13463757534) · [mail](mailto:a@b.c)");
    expect(html).toMatch(/href="https:\/\/stripe\.com\/privacy"[^>]*target="_blank" rel="noopener noreferrer"/);
    expect(html).toContain('href="tel:+13463757534"');
    expect(html).toContain('<a href="mailto:a@b.c"');
    expect(html).not.toContain('href="mailto:a@b.c" target');
  });
});
