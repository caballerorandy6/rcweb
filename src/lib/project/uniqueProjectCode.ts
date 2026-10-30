import { prisma } from "@/lib/prisma";
import { generateProjectCode } from "@/lib/utils";

/**
 * Random 6-char code that is not taken yet. The webhook uses it as the
 * idempotency key of the deposit session, and the admin path as the key of
 * the project it creates by hand.
 */
export async function uniqueProjectCode(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateProjectCode();
    const taken = await prisma.project.findUnique({
      where: { projectCode: code },
      select: { id: true },
    });
    if (!taken) return code;
  }
  throw new Error("Could not generate a unique project code");
}
