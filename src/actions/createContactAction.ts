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
  const parsed = FormSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation Failed",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const { name, email, phone, marketingConsent, message } = parsed.data;

    // 1. Buscar contacto por email
    let contact = email
      ? await prisma.contact.findFirst({
          where: { emails: { some: { email } } },
          include: { emails: true, phones: true },
        })
      : null;

    // 2. Si no existe por email, buscar por teléfono
    if (!contact && phone) {
      contact = await prisma.contact.findFirst({
        where: { phones: { some: { phone } } },
        include: { emails: true, phones: true },
      });
    }

    // 3. Si existe contacto, actualizar y agregar nuevos emails/phones
    if (contact) {
      await prisma.contact.update({
        where: { id: contact.id },
        data: {
          name,
          marketingConsent,
          emails: email
            ? {
                connectOrCreate: {
                  where: { email },
                  create: { email },
                },
              }
            : undefined,
          phones: phone
            ? {
                connectOrCreate: {
                  where: { phone },
                  create: { phone },
                },
              }
            : undefined,
        },
      });
    } else {
      // 4. Si no existe, crear nuevo contacto con email y teléfono
      await prisma.contact.create({
        data: {
          name,
          marketingConsent,
          emails: email ? { create: { email } } : undefined,
          phones: phone ? { create: { phone } } : undefined,
        },
      });
    }

    // 5. Enviar email de confirmación
    if (email) {
      await resend.emails.send({
        from: "RC Web <noreply@rcweb.dev>",
        to: email,
        subject: "New Contact Form Submission",
        html: `
          <h1>New Contact Form Submission</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong> ${message || "No message provided"}</p>
        `,
      });
    }

    return {
      success: true,
      message: "Contact processed successfully",
      errors: {},
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal Server Error", errors: {} };
  }
};
