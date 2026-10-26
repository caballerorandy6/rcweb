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
  });
});
