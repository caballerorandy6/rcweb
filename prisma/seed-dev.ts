import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { getDbSsl } from "../src/lib/dbSsl";

// Local development only: seeds a test admin and a sample project so the
// admin dashboard and the public /project/{accessToken} page can be exercised.
// Credentials live in .env.test (git-ignored).
config({ path: ".env.test" });
config();

const databaseUrl = process.env.DATABASE_URL ?? "";
if (!/localhost|127\.0\.0\.1/.test(databaseUrl)) {
  throw new Error("seed-dev only runs against a local database");
}

const required = ["TEST_ADMIN_EMAIL", "TEST_ADMIN_PASSWORD"] as const;
for (const name of required) {
  if (!process.env[name]) throw new Error(`${name} is required (see .env.test)`);
}

const adapter = new PrismaPg({ connectionString: databaseUrl, ssl: getDbSsl() });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.TEST_ADMIN_EMAIL!;

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

  // Sample project reachable at /project/{accessToken}; the customer is not a
  // user: there is no client login
  const project = await prisma.payment.upsert({
    where: { projectCode: "TEST-001" },
    update: {},
    create: {
      projectCode: "TEST-001",
      email: "customer@rcweb.test",
      name: "Test Customer",
      planName: "Starter",
      totalAmount: 100000,
      firstPayment: 50000,
      secondPayment: 50000,
      firstPaid: true,
      firstPaidAt: new Date(),
      projectStatus: "in_progress",
      projectStarted: new Date(),
    },
  });
  console.log(`✅ Project: ${project.projectCode} → /project/${project.accessToken}`);
}

main()
  .catch((e) => {
    console.error("❌ seed-dev failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
