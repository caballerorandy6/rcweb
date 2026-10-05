import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { getDbSsl } from "../src/lib/dbSsl";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
  ssl: getDbSsl(),
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed...");

  // Credentials come from the environment: this repository is public.
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD is required to seed the admin user");
  }

  const admins = [
    {
      email: process.env.ADMIN_EMAIL || "admin@rcweb.dev",
      password: adminPassword,
      name: "Admin",
    },
  ];

  for (const admin of admins) {
    const hashedPassword = await bcrypt.hash(admin.password, 10);

    const createdAdmin = await prisma.admin.upsert({
      where: { email: admin.email },
      update: {},
      create: {
        email: admin.email,
        password: hashedPassword,
        name: admin.name,
        isActive: true,
      },
    });

    console.log(`✅ Admin created: ${createdAdmin.email}`);
  }

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

//npm run seed
