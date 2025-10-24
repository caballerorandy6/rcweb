import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatInvoiceDate } from "@/lib/invoice/types";

export const metadata = {
  title: "Manage Invoices - Admin",
  description: "Manage all invoices",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

async function getInvoices() {
  const invoices = await prisma.invoice.findMany({
    include: {
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return invoices;
}

export default async function ManageInvoicesPage() {
  const invoices = await getInvoices();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-inter">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gold mb-2 font-iceland">
            Manage Invoices
          </h1>
          <p className="text-gray-400">
            View and manage all generated invoices
          </p>
        </div>

        {invoices.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400">No invoices found</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Invoice #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-mono text-sm text-gold">
                          {invoice.invoiceNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            invoice.type === "initial"
                              ? "bg-blue-900 text-blue-200"
                              : invoice.type === "final"
                                ? "bg-green-900 text-green-200"
                                : "bg-purple-900 text-purple-200"
                          }`}
                        >
                          {invoice.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium">
                          {invoice.customerName}
                        </div>
                        <div className="text-xs text-gray-400">
                          {invoice.customerEmail}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">{invoice.projectCode}</div>
                        <div className="text-xs text-gray-400">
                          {invoice.planName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-400">
                          ${(invoice.total / 100).toFixed(2)}
                        </div>
                        {invoice.taxAmount > 0 && (
                          <div className="text-xs text-gray-400">
                            Tax: ${(invoice.taxAmount / 100).toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {formatInvoiceDate(invoice.issueDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          {invoice.pdfUrl && (
                            <>
                              <a
                                href={invoice.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gold hover:text-gold/80 transition-colors"
                              >
                                View PDF
                              </a>
                              <span className="text-gray-600">|</span>
                              <a
                                href={`/api/invoice/${invoice.invoiceNumber}`}
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                              >
                                Download
                              </a>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-1">Total Invoices</div>
            <div className="text-2xl font-bold text-white">
              {invoices.length}
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-1">Initial Payments</div>
            <div className="text-2xl font-bold text-blue-400">
              {invoices.filter((i) => i.type === "initial").length}
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-1">Final Payments</div>
            <div className="text-2xl font-bold text-green-400">
              {invoices.filter((i) => i.type === "final").length}
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-1">Total Revenue</div>
            <div className="text-2xl font-bold text-gold">
              $
              {(
                invoices
                  .filter((i) => i.type === "summary")
                  .reduce((sum, inv) => sum + inv.total, 0) / 100
              ).toFixed(2)}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/admin-dashboard"
            className="text-gold hover:text-gold/80 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
