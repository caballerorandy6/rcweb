import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { getDbSsl } from "../src/lib/dbSsl";

// Local development only: seeds a test admin, a test client and a sample
// project so the admin dashboard and the client portal can be exercised.
// Credentials live in .env.test (git-ignored).
config({ path: ".env.test" });
config();

const databaseUrl = process.env.DATABASE_URL ?? "";
if (!/localhost|127\.0\.0\.1/.test(databaseUrl)) {
  throw new Error("seed-dev only runs against a local database");
}

const required = [
  "TEST_ADMIN_EMAIL",
  "TEST_ADMIN_PASSWORD",
  "TEST_CLIENT_EMAIL",
  "TEST_CLIENT_PASSWORD",
] as const;
for (const name of required) {
  if (!process.env[name]) throw new Error(`${name} is required (see .env.test)`);
}

const adapter = new PrismaPg({ connectionString: databaseUrl, ssl: getDbSsl() });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.TEST_ADMIN_EMAIL!;
  const clientEmail = process.env.TEST_CLIENT_EMAIL!;

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { password: await bcrypt.hash(process.env.TEST_ADMIN_PASSWORD!, 10) },
    create: {
      email: adminEmail,
      password: await bcrypt.hash(process.env.TEST_ADMIN_PASSWORD!, 10),
      name: "Test Admin",
      isActive: true,
    },
  });
  console.log(`✅ Admin: ${admin.email}`);

  const client = await prisma.client.upsert({
    where: { email: clientEmail },
    update: { password: await bcrypt.hash(process.env.TEST_CLIENT_PASSWORD!, 10) },
    create: {
      email: clientEmail,
      password: await bcrypt.hash(process.env.TEST_CLIENT_PASSWORD!, 10),
      name: "Test Client",
      emailVerified: new Date(),
      isActive: true,
    },
  });
  console.log(`✅ Client: ${client.email}`);

  const existing = await prisma.payment.findFirst({
    where: { clientId: client.id },
  });
  const project =
    existing ??
    (await prisma.payment.create({
      data: {
        projectCode: "TEST-001",
        email: client.email,
        name: client.name,
        planName: "Starter",
        totalAmount: 100000,
        firstPayment: 50000,
        secondPayment: 50000,
        firstPaid: true,
        firstPaidAt: new Date(),
        projectStatus: "in_progress",
        projectStarted: new Date(),
        clientId: client.id,
        messages: {
          create: {
            message: "Welcome to your project! Feel free to ask anything here.",
            senderType: "admin",
            senderEmail: adminEmail,
            senderName: "Test Admin",
          },
        },
      },
    }));
  console.log(`✅ Project: ${project.projectCode}`);
}

main()
  .catch((e) => {
    console.error("❌ seed-dev failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
