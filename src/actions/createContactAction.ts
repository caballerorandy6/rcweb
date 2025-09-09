"use server";

import { prisma } from "@/lib/prisma";
import { FormSchema, type FormData } from "@/lib/zod";
import { Resend } from "resend";

export interface CreateContactAction {
  success: boolean;
  message: string;
  errors: Record<string, string[]>;
}

const resend = new Resend(process.env.RESEND_API_KEY!);

export const createContactAction = async (
  data: FormData
): Promise<CreateContactAction> => {
  // 1. Validar formulario
  const parsed = FormSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation Failed",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    //Buscar contacto existente por un email o por un telefono
    const existingContact = await prisma.contact.findFirst({
      where: {
        OR: [
          { emails: { some: { email: parsed.data.email } } },
          { phones: { some: { phone: parsed.data.phone } } },
        ],
      },
    });

    if (existingContact) {
      await prisma.contact.update({
        where: { id: existingContact.id },
        data: {
          name: parsed.data.name,
          marketingConsent: parsed.data.marketingConsent,
          // Conecta o crea el email (añade si es nuevo)
          emails: {
            connectOrCreate: {
              where: { email: parsed.data.email },
              create: { email: parsed.data.email },
            },
          },
          phones: parsed.data.phone
            ? {
                connectOrCreate: {
                  where: { phone: parsed.data.phone },
                  create: { phone: parsed.data.phone },
                },
              }
            : undefined,
        },
      });
    } else {
      await prisma.contact.create({
        data: {
          name: parsed.data.name,
          marketingConsent: parsed.data.marketingConsent,
          emails: {
            connectOrCreate: {
              where: { email: parsed.data.email },
              create: { email: parsed.data.email },
            },
          },
          phones: parsed.data.phone
            ? {
                connectOrCreate: {
                  where: { phone: parsed.data.phone },
                  create: { phone: parsed.data.phone },
                },
              }
            : undefined,
        },
      });
    }

    // 3. Enviar email de confirmación
    await resend.emails.send({
      from: `RC Web <noreply@rcweb.dev>`,
      to: parsed.data.email,
      subject: "New Contact Form Submission",
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${parsed.data.name}</p>
        <p><strong>Email:</strong> ${parsed.data.email}</p>
        <p><strong>Phone:</strong> ${parsed.data.phone}</p>
        <p><strong>Message:</strong> ${parsed.data.message || "No message provided"}</p>
      `,
    });

    return {
      success: true,
      message: "Contact created successfully",
      errors: {},
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Internal Server Error",
      errors: {},
    };
  }
};
