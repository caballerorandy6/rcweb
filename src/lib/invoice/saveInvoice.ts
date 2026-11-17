import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { InvoiceType } from "@/generated/prisma/enums";
import { isUniqueConstraintError } from "@/lib/prismaErrors";
import { deleteInvoicePDF, uploadInvoicePDF } from "../blob";
import { generateInvoiceNumber } from "./generateInvoiceNumber";

/** The PDF travels back with the row: re-downloading it from Blob right after the upload can return a 404 */
export interface CreatedInvoice {
  invoiceId: string;
  invoiceNumber: string;
  pdfUrl: string;
  pdfBuffer: Buffer;
}

type ExistingInvoice = { id: string; invoiceNumber: string; pdfUrl: string | null };

/**
 * The project already has an invoice of that type: a retry of the same Stripe
 * event, or a second click, arrived while the first one was still working.
 * Whoever saved it also emails it, so the caller has nothing left to do.
 */
export class InvoiceAlreadyExistsError extends Error {
  constructor(readonly existing: ExistingInvoice) {
    super(`Invoice ${existing.invoiceNumber} already exists for this project`);
    this.name = "InvoiceAlreadyExistsError";
  }
}

type InvoiceRow = Omit<
  Prisma.InvoiceUncheckedCreateInput,
  "projectId" | "type" | "invoiceNumber" | "pdfUrl" | "pdfBlobKey"
>;

interface SaveInvoiceParams {
  projectId: string;
  type: InvoiceType;
  /** The PDF prints its number, so it is rendered once per number tried */
  render: (invoiceNumber: string) => Promise<Buffer>;
  row: (invoiceNumber: string) => InvoiceRow;
}

const MAX_ATTEMPTS = 5;

/**
 * Numbers an invoice, uploads its PDF and stores the row.
 *
 * Nothing reserves the number while the PDF is rendered and uploaded, so two
 * invoices created at the same time propose the same one. The unique
 * `invoiceNumber` lets one of them through; the other removes its PDF and
 * tries again with the next number. One invoice per project and type
 * (`@@unique([projectId, type])`) stops two deliveries of the same event from
 * both invoicing the customer.
 */
export async function saveInvoice({
  projectId,
  type,
  render,
  row,
}: SaveInvoiceParams): Promise<CreatedInvoice> {
  const findExisting = () =>
    prisma.invoice.findUnique({
      where: { projectId_type: { projectId, type } },
    });

  const existing = await findExisting();
  if (existing) throw new InvoiceAlreadyExistsError(existing);

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const invoiceNumber = await generateInvoiceNumber();
    const pdfBuffer = await render(invoiceNumber);
    const { url: pdfUrl, pathname: pdfBlobKey } = await uploadInvoicePDF(
      `${invoiceNumber}.pdf`,
      pdfBuffer
    );

    try {
      const invoice = await prisma.invoice.create({
        data: {
          ...row(invoiceNumber),
          projectId,
          type,
          invoiceNumber,
          pdfUrl,
          pdfBlobKey,
        },
      });

      return {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        pdfUrl,
        pdfBuffer,
      };
    } catch (error) {
      // No row points at this PDF: do not leave it in the store
      await deleteInvoicePDF(pdfUrl).catch((deleteError) => {
        console.error("Error removing the PDF of an unsaved invoice:", deleteError);
      });

      if (!isUniqueConstraintError(error)) throw error;

      // Which constraint failed? Either this same invoice was saved meanwhile…
      const saved = await findExisting();
      if (saved) throw new InvoiceAlreadyExistsError(saved);
      // …or another project took the number: go for the next one
    }
  }

  throw new Error(
    `Could not get a free invoice number after ${MAX_ATTEMPTS} attempts`
  );
}
