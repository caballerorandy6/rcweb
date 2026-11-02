import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";
import { getAllPosts } from "@/lib/blog";
import { siteConfig } from "@/config/site";

describe("sitemap", () => {
  const entries = sitemap();
  const urls = entries.map((entry) => entry.url);

  it("lists every page in English and in Spanish with hreflang alternates", () => {
    expect(urls).toContain(`${siteConfig.baseUrl}/about`);
    expect(urls).toContain(`${siteConfig.baseUrl}/es/sobre-mi`);
    expect(urls).toContain(`${siteConfig.baseUrl}/es/politica-de-privacidad`);

    const about = entries.find((entry) => entry.url === `${siteConfig.baseUrl}/es/sobre-mi`);
    expect(about?.alternates?.languages).toEqual({
      en: `${siteConfig.baseUrl}/about`,
      es: `${siteConfig.baseUrl}/es/sobre-mi`,
      "x-default": `${siteConfig.baseUrl}/about`,
    });
  });

  it("gives each service page its own slug in each language", () => {
    const spanish = entries.find((entry) => entry.url === `${siteConfig.baseUrl}/es/servicios/diseno-web-houston`);
    expect(spanish?.alternates?.languages).toEqual({
      en: `${siteConfig.baseUrl}/services/web-design-houston`,
      es: `${siteConfig.baseUrl}/es/servicios/diseno-web-houston`,
      "x-default": `${siteConfig.baseUrl}/services/web-design-houston`,
    });
    expect(urls).not.toContain(`${siteConfig.baseUrl}/es/servicios/web-design-houston`);
  });

  it("adds a Spanish post only when its translation exists", () => {
    for (const post of getAllPosts()) {
      const english = `${siteConfig.baseUrl}/blog/${post.slug}`;
      const spanish = `${siteConfig.baseUrl}/es/blog/${post.slug}`;
      const translated = post.translations.includes("es");
      expect(urls, post.slug).toContain(english);
      expect(urls.includes(spanish), post.slug).toBe(translated);
      const entry = entries.find((item) => item.url === english);
      expect(Boolean(entry?.alternates), post.slug).toBe(translated);
    }
  });

  it("never emits a URL twice or a relative date", () => {
    expect(new Set(urls).size).toBe(urls.length);
    for (const entry of entries) {
      expect(entry.url.startsWith(siteConfig.baseUrl)).toBe(true);
      expect(String(entry.lastModified)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});
