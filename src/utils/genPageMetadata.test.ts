import { describe, expect, it } from "vitest";
import { genPageMetadata } from "./genPageMetadata";
import { siteConfig } from "@/config/site";

describe("genPageMetadata", () => {
  it("builds website metadata with the default 1200×630 image on both cards", () => {
    const meta = genPageMetadata({
      title: "Services",
      description: "What we build",
      pathname: "/services",
    });

    expect(meta.alternates?.canonical).toBe(`${siteConfig.baseUrl}/services`);
    expect(meta.alternates?.languages).toEqual({
      en: `${siteConfig.baseUrl}/services`,
      es: `${siteConfig.baseUrl}/es/servicios`,
      "x-default": `${siteConfig.baseUrl}/services`,
    });
    expect(meta.openGraph).toMatchObject({ locale: "en_US" });
    expect(meta.openGraph).toMatchObject({
      type: "website",
      url: `${siteConfig.baseUrl}/services`,
      images: [{ url: siteConfig.defaultOgImg, width: 1200, height: 630 }],
    });
    expect(meta.twitter).toMatchObject({
      card: "summary_large_image",
      images: [siteConfig.defaultOgImg],
    });
    expect(meta.robots).toBeUndefined();
  });

  it("marks noIndex pages as noindex, nofollow", () => {
    const meta = genPageMetadata({
      title: "Thank you",
      description: "Done",
      pathname: "/thank-you",
      noIndex: true,
    });

    expect(meta.robots).toMatchObject({ index: false, follow: false });
  });

  it("localizes the canonical, the og:locale and the dynamic segments in Spanish", () => {
    const meta = genPageMetadata({
      title: "Diseño web",
      description: "Qué construyo",
      locale: "es",
      pathname: "/services/[slug]",
      params: { slug: "web-design-houston" },
    });

    expect(meta.alternates?.canonical).toBe(`${siteConfig.baseUrl}/es/servicios/web-design-houston`);
    expect(meta.alternates?.languages).toMatchObject({
      en: `${siteConfig.baseUrl}/services/web-design-houston`,
      "x-default": `${siteConfig.baseUrl}/services/web-design-houston`,
    });
    expect(meta.openGraph).toMatchObject({ locale: "es_US" });
  });

  it("emits no hreflang for single-language routes", () => {
    const meta = genPageMetadata({
      title: "Admin Login",
      description: "Private",
      pageRoute: "/admin/login",
      noIndex: true,
    });

    expect(meta.alternates?.canonical).toBe(`${siteConfig.baseUrl}/admin/login`);
    expect(meta.alternates?.languages).toBeUndefined();
  });

  it("emits og:type article with dates and no image so the generated card applies", () => {
    const meta = genPageMetadata({
      title: "A post",
      description: "Post description",
      pathname: "/blog/[slug]",
      params: { slug: "a-post" },
      article: {
        publishedTime: "2026-03-30",
        modifiedTime: "2026-10-18",
        authors: ["Randy Caballero"],
        tags: ["Houston", "Pricing"],
      },
    });

    expect(meta.openGraph).toMatchObject({
      type: "article",
      publishedTime: "2026-03-30",
      modifiedTime: "2026-10-18",
      authors: ["Randy Caballero"],
      tags: ["Houston", "Pricing"],
    });
    // File-based opengraph-image only wins when no image is configured here
    expect(meta.openGraph).not.toHaveProperty("images");
    expect(meta.twitter).not.toHaveProperty("images");
    expect(meta.twitter).toMatchObject({ card: "summary_large_image" });
  });
});
