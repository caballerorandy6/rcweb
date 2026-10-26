import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ImageResponseOptions } from "next/server";

/**
 * Brand fonts for `next/og`. Satori only reads ttf/otf/woff, so these are
 * static TTF instances of the woff2 files in `src/app/fonts` (Iceland 400,
 * Inter 400 and 600 from the variable latin subset), generated with fontTools.
 * Regenerate them if the web fonts change.
 */
export async function loadOgFonts(): Promise<NonNullable<ImageResponseOptions["fonts"]>> {
  const [iceland, interRegular, interSemiBold] = await Promise.all([
    readFile(join(process.cwd(), "src/lib/og/fonts/Iceland.ttf")),
    readFile(join(process.cwd(), "src/lib/og/fonts/Inter-Regular.ttf")),
    readFile(join(process.cwd(), "src/lib/og/fonts/Inter-SemiBold.ttf")),
  ]);

  return [
    { name: "Iceland", data: iceland, weight: 400, style: "normal" },
    { name: "Inter", data: interRegular, weight: 400, style: "normal" },
    { name: "Inter", data: interSemiBold, weight: 600, style: "normal" },
  ];
}
