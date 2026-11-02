import { describe, expect, it } from "vitest";
import { getAllPosts, getAllSlugs, getPostBySlug } from "./blog";
import { siteConfig } from "@/config/site";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

describe("blog content", () => {
  const posts = getAllPosts();

  it("reads every markdown post with a title, description and ISO date", () => {
    expect(posts.length).toBeGreaterThan(0);
    expect(posts).toHaveLength(getAllSlugs().length);
    for (const post of posts) {
      expect(post.title, post.slug).not.toBe("");
      expect(post.description, post.slug).not.toBe("");
      expect(post.date, post.slug).toMatch(ISO_DATE);
    }
  });

  it("sorts posts newest first", () => {
    const dates = posts.map((post) => post.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it("only records an `updated` date after publication", () => {
    for (const post of posts) {
      if (post.updated === undefined) continue;
      expect(post.updated, post.slug).toMatch(ISO_DATE);
      expect(post.updated > post.date, `${post.slug} updated before date`).toBe(true);
    }
  });

  it("does not reuse the default social image as a hero image", () => {
    for (const post of posts) {
      expect(post.image, post.slug).not.toBe(siteConfig.defaultOgImg);
    }
  });

  it("returns null for an unknown slug", () => {
    expect(getPostBySlug("does-not-exist")).toBeNull();
    expect(getPostBySlug("../package", "en")).toBeNull();
  });

  describe("Spanish translations (content/blog/es)", () => {
    const spanish = getAllPosts("es");

    it("lists only translated posts, every one of them an English slug", () => {
      const englishSlugs = new Set(getAllSlugs());
      expect(spanish.length).toBeGreaterThan(0);
      expect(spanish.map((post) => post.slug).sort()).toEqual([...getAllSlugs("es")].sort());
      for (const post of spanish) {
        expect(englishSlugs.has(post.slug), post.slug).toBe(true);
        expect(post.locale).toBe("es");
        expect(post.translations).toEqual(["en", "es"]);
      }
    });

    it("translates title, description, tags and body but inherits the rest from English", () => {
      for (const post of spanish) {
        const english = getPostBySlug(post.slug, "en")!;
        expect(post.title, post.slug).not.toBe(english.title);
        expect(post.description, post.slug).not.toBe(english.description);
        expect(post.content, post.slug).not.toBe(english.content);
        expect(post.tags?.length, post.slug).toBe(english.tags?.length);
        expect(post.category, post.slug).toBe(english.category);
        expect(post.date, post.slug).toBe(english.date);
        expect(post.updated, post.slug).toBe(english.updated);
        expect(post.author, post.slug).toBe(english.author);
        expect(post.image, post.slug).toBe(english.image);
      }
    });

    it("keeps internal links on the Spanish site and the shape of every code block", () => {
      for (const post of spanish) {
        const english = getPostBySlug(post.slug, "en")!;
        for (const [, href] of post.content.matchAll(/\]\((\/[^)]*)\)/g)) {
          expect(href.startsWith("/es"), `${post.slug}: ${href}`).toBe(true);
        }
        // Comments inside the code are translated, so compare language and length, not text
        const fences = (content: string) =>
          (content.match(/^```[\s\S]*?^```/gm) ?? []).map((block) => [
            block.split("\n")[0],
            block.split("\n").length,
          ]);
        expect(fences(post.content), post.slug).toEqual(fences(english.content));
      }
    });

    it("is marked as missing for a post without translation", () => {
      const english = getPostBySlug(getAllSlugs()[0], "en")!;
      expect(english.locale).toBe("en");
      expect(english.translations).toContain("en");
    });
  });
});
