"use server";

import { prisma } from "@/lib/prisma";
import type { BusinessContact } from "./searchBusinessContactsAction";

export interface ImportBusinessContactsResult {
  success: boolean;
  imported?: number;
  skipped?: number;
  errors?: string[];
  message?: string;
}

/**
 * Server Action to import business contacts into the database
 *
 * @param businesses - Array of business contacts to import
 * @param marketingConsent - Whether to mark contacts with marketing consent (default: false)
 */
export async function importBusinessContactsAction(
  businesses: BusinessContact[],
  marketingConsent: boolean = false
): Promise<ImportBusinessContactsResult> {
  try {
    if (!businesses || businesses.length === 0) {
      return {
        success: false,
        message: "No businesses provided to import",
      };
    }

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const business of businesses) {
      try {
        // Skip if no name
        if (!business.name) {
          skipped++;
          errors.push("Skipped business with no name");
          continue;
        }

        // Skip if no phone or email
        if (!business.phone && !business.email) {
          skipped++;
          errors.push(`Skipped "${business.name}" - no phone or email`);
          continue;
        }

        // Check if contact already exists by name
        const existingContact = await prisma.contact.findFirst({
          where: { name: business.name },
        });

        if (existingContact) {
          skipped++;
          errors.push(`Skipped "${business.name}" - already exists`);
          continue;
        }

        // Prepare email data
        const emailsData = business.email
          ? [{ email: business.email }]
          : [];

        // Prepare phone data
        const phonesData = business.phone
          ? [{ phone: business.phone, type: "work" }]
          : [];

        // Create contact with emails and phones
        await prisma.contact.create({
          data: {
            name: business.name,
            marketingConsent,
            source: "google_places",
            emails: {
              create: emailsData,
            },
            phones: {
              create: phonesData,
            },
          },
        });

        imported++;
      } catch (error) {
        // Handle unique constraint violations
        if (error instanceof Error && error.message.includes("Unique constraint")) {
          skipped++;
          errors.push(`Skipped "${business.name}" - duplicate email or phone`);
        } else {
          skipped++;
          errors.push(`Error importing "${business.name}": ${error instanceof Error ? error.message : "Unknown error"}`);
          console.error(`Error importing contact ${business.name}:`, error);
        }
      }
    }

    return {
      success: true,
      imported,
      skipped,
      errors: errors.length > 0 ? errors : undefined,
      message: `Imported ${imported} contacts, skipped ${skipped}`,
    };
  } catch (error) {
    console.error("Error in importBusinessContactsAction:", error);
    return {
      success: false,
      message: "Error importing contacts. Please try again.",
    };
  }
}
