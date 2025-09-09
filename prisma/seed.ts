import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

async function main() {
  console.log("🌱 Starting seed...");

  // Crear administradores
  const admins = [
    {
      email: "admin@rcweb.dev",
      password: "Libre2025!",
      name: "Admin",
    },
    {
      email: "caballerorandy7@gmail.com",
      password: "Libre2025!",
      name: "Randy Caballero",
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
