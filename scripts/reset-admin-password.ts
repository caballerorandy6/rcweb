/**
 * Lista los admins y cambia la contraseña de uno. La contraseña se escribe
 * sin eco y nunca se imprime. Ejecutar en una terminal propia:
 *   npx tsx --env-file=<archivo con DATABASE_URL> scripts/reset-admin-password.ts
 */
import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { getDbSsl } from "../src/lib/dbSsl";

function readHidden(prompt: string): Promise<string> {
  stdout.write(prompt);
  return new Promise((resolve) => {
    let value = "";
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    const onData = (chunk: string) => {
      for (const char of chunk) {
        if (char === "\u0003") process.exit(130);
        if (char === "\r" || char === "\n") {
          stdin.setRawMode(false);
          stdin.pause();
          stdin.off("data", onData);
          stdout.write("\n");
          resolve(value);
          return;
        }
        value = char === "\u007f" ? value.slice(0, -1) : value + char;
      }
    };
    stdin.on("data", onData);
  });
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is empty");
  const host = new URL(process.env.DATABASE_URL).hostname;
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL, ssl: getDbSsl() }),
  });

  try {
    const admins = await prisma.admin.findMany({ select: { email: true, isActive: true } });
    console.log(`Database host: ${host}`);
    admins.forEach((admin) => console.log(`- ${admin.email}${admin.isActive ? "" : " (inactive)"}`));

    const prompt = createInterface({ input: stdin, output: stdout });
    const email = (await prompt.question("Admin email to change: ")).trim();
    prompt.close();
    if (!admins.some((admin) => admin.email === email)) throw new Error("That admin does not exist");

    const password = await readHidden("New password (min. 12 characters): ");
    if (password.length < 12) throw new Error("Password too short");
    if (password !== (await readHidden("Repeat it: "))) throw new Error("Passwords do not match");

    await prisma.admin.update({ where: { email }, data: { password: await bcrypt.hash(password, 10) } });
    console.log(`Password updated for ${email}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
