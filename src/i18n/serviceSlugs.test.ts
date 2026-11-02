import { describe, expect, it } from "vitest";
import { offers } from "@/lib/data";
import { SERVICE_SLUGS, translateServiceSlug } from "./serviceSlugs";

describe("service slugs", () => {
  it("match the catalogue", () => {
    expect(SERVICE_SLUGS.map(({ en, es }) => [en, es])).toEqual(offers.map((o) => [o.slug, o.slugEs]));
  });

  it("translate in both directions and leave unknown slugs alone", () => {
    expect(translateServiceSlug("web-design-houston", "es")).toBe("diseno-web-houston");
    expect(translateServiceSlug("diseno-web-houston", "en")).toBe("web-design-houston");
    expect(translateServiceSlug("diseno-web-houston", "es")).toBe("diseno-web-houston");
    expect(translateServiceSlug("unknown", "es")).toBe("unknown");
  });
});
