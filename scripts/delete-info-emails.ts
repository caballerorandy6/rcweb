import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🗑️  Starting deletion of emails that start with 'info@'...");

  try {
    // Find all emails that start with 'info@'
    const emailsToDelete = await prisma.contactEmail.findMany({
      where: {
        email: {
          startsWith: "info@",
        },
      },
      select: {
        id: true,
        email: true,
        contactId: true,
      },
    });

    console.log(`📧 Found ${emailsToDelete.length} emails starting with 'info@'`);

    if (emailsToDelete.length === 0) {
      console.log("✨ No emails to delete!");
      return;
    }

    // Display emails to be deleted
    console.log("\nEmails to be deleted:");
    emailsToDelete.forEach((email) => {
      console.log(`  - ${email.email}`);
    });

    // Delete the emails
    const result = await prisma.contactEmail.deleteMany({
      where: {
        email: {
          startsWith: "info@",
        },
      },
    });

    console.log(`\n✅ Successfully deleted ${result.count} email(s)`);

    // Clean up contacts without any emails or phones
    const contactsWithoutEmailsOrPhones = await prisma.contact.findMany({
      where: {
        AND: [
          {
            emails: {
              none: {},
            },
          },
          {
            phones: {
              none: {},
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (contactsWithoutEmailsOrPhones.length > 0) {
      console.log(
        `\n🧹 Found ${contactsWithoutEmailsOrPhones.length} contacts without emails or phones`
      );
      console.log("Contacts to be deleted:");
      contactsWithoutEmailsOrPhones.forEach((contact) => {
        console.log(`  - ${contact.name}`);
      });

      const deletedContacts = await prisma.contact.deleteMany({
        where: {
          id: {
            in: contactsWithoutEmailsOrPhones.map((c) => c.id),
          },
        },
      });

      console.log(
        `✅ Successfully deleted ${deletedContacts.count} empty contact(s)`
      );
    }

    console.log("\n✨ Done!");
  } catch (error) {
    console.error("❌ Error during deletion:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("❌ Failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
