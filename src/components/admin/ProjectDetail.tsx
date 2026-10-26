import Link from "next/link";
import type { Route } from "next";
import { ArrowTopRightOnSquareIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { getPayUrl, getProjectUrl } from "@/lib/projectUrl";
import { PROJECT_STATUS_CLASSES, PROJECT_STATUS_LABELS } from "@/lib/project/status";
import CopyLinkButton from "@/components/admin/CopyLinkButton";
import MilestoneManager from "@/components/admin/MilestoneManager";
import ProjectStatusActions from "@/components/admin/ProjectStatusActions";
import type { AdminProjectDetail, AdminProjectPayment } from "@/types/project";

const PAYMENT_LABELS: Record<AdminProjectPayment["kind"], string> = {
  deposit: "Deposit (50%)",
  final: "Final payment (50%)",
};

const INVOICE_LABELS: Record<AdminProjectDetail["invoices"][number]["type"], string> = {
  initial: "Deposit invoice",
  final: "Final invoice",
  summary: "Project summary",
};

const card =
  "bg-linear-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-xl p-5 sm:p-6 shadow-xl shadow-black/20";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section aria-label={title} className={card}>
      <h2 className="text-xl text-gold font-iceland mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-sm">
      <dt className="text-gray-400">{label}</dt>
      <dd className="text-white text-right">{children}</dd>
    </div>
  );
}

/** Everything about one project: customer, charges, invoices, links and milestones */
export default function ProjectDetail({ project }: { project: AdminProjectDetail }) {
  const deposit = project.payments.find((p) => p.kind === "deposit");
  const final = project.payments.find((p) => p.kind === "final");
  const depositPaid = deposit?.status === "paid";
  const finalPaid = final?.status === "paid";
  const projectUrl = getProjectUrl(project.accessToken);
  const payUrl = getPayUrl(project.accessToken);

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 font-inter">
      <div>
        <Link href="/projects" className="text-sm text-gray-400 hover:text-gold">
          ← Projects
        </Link>
        <div className="mt-2 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-gold font-iceland">
              Project <span className="font-mono">{project.projectCode}</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-300 mt-1">{project.planName}</p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${PROJECT_STATUS_CLASSES[project.status]}`}
              >
                {PROJECT_STATUS_LABELS[project.status]}
              </span>
              <span className="text-xs text-gray-500">
                Created {formatDate(project.createdAt)} · Updated {formatDate(project.updatedAt)}
              </span>
            </div>
          </div>
          <ProjectStatusActions
            project={{
              id: project.id,
              projectCode: project.projectCode,
              status: project.status,
              depositPaid,
              finalPaid,
            }}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Customer">
          <dl className="space-y-2">
            <Row label="Name">{project.name}</Row>
            <Row label="Email">
              <a href={`mailto:${project.email}`} className="hover:text-gold">
                {project.email}
              </a>
            </Row>
            <Row label="Lead">
              {project.contact ? (
                <Link href="/contacts" className="hover:text-gold">
                  {project.contact.name} · {project.contact.leadStatus.toLowerCase().replace("_", " ")}
                </Link>
              ) : (
                <span className="text-gray-500">Not linked to a contact</span>
              )}
            </Row>
            <Row label="Sold through">
              {project.quote ? (
                <Link href={`/quotes/${project.quote.id}` as Route} className="font-mono hover:text-gold">
                  {project.quote.quoteNumber}
                </Link>
              ) : (
                <span className="text-gray-500">Catalogue checkout</span>
              )}
            </Row>
            <Row label="Terms accepted">
              {project.termsAcceptedAt ? (
                <>
                  {formatDateTime(project.termsAcceptedAt)}
                  {project.termsVersion ? (
                    <span className="text-gray-500"> · v{project.termsVersion}</span>
                  ) : null}
                </>
              ) : (
                <span className="text-gray-500">No record</span>
              )}
            </Row>
          </dl>
        </Card>

        <Card title="Payments">
          <dl className="space-y-3">
            <Row label="Project total">
              <span className="font-semibold">{formatCurrency(project.totalAmount)}</span>
            </Row>
            {project.payments.map((payment) => (
              <div key={payment.id} className="rounded-lg border border-gray-700/60 p-3 space-y-1">
                <div className="flex flex-wrap justify-between gap-2 text-sm">
                  <dt className="text-gray-200">{PAYMENT_LABELS[payment.kind]}</dt>
                  <dd className="flex items-center gap-2">
                    <span className="font-semibold text-white">{formatCurrency(payment.amount)}</span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                        payment.status === "paid"
                          ? "bg-green-500/10 text-green-400 border-green-500/40"
                          : "bg-gray-500/10 text-gray-300 border-gray-500/40"
                      }`}
                    >
                      {payment.status === "paid" ? "Paid" : "Pending"}
                    </span>
                  </dd>
                </div>
                <p className="text-xs text-gray-500">
                  {payment.paidAt ? `Paid ${formatDateTime(payment.paidAt)}` : "Not paid yet"}
                  {payment.stripeSessionId ? (
                    <>
                      {" · "}
                      <span className="font-mono break-all">{payment.stripeSessionId}</span>
                    </>
                  ) : null}
                </p>
              </div>
            ))}
          </dl>
        </Card>

        <Card title="Customer links">
          <p className="text-sm text-gray-400 mb-4">
            The token is the only credential: anyone with the link can see the progress page or pay the balance.
          </p>
          <ul className="space-y-3">
            <li className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm text-gray-200">Progress page</p>
                <p className="text-xs text-gray-500 font-mono break-all">{projectUrl}</p>
              </div>
              <div className="flex gap-2">
                <CopyLinkButton url={projectUrl} label="Copy" copiedMessage="Progress link copied" />
                <a
                  href={projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors bg-gray-700/40 text-gray-200 border-gray-600 hover:bg-gray-700/70"
                >
                  <ArrowTopRightOnSquareIcon className="w-4 h-4" aria-hidden="true" />
                  Open
                </a>
              </div>
            </li>
            {!finalPaid ? (
              <li className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm text-gray-200">Final payment</p>
                  <p className="text-xs text-gray-500 font-mono break-all">{payUrl}</p>
                </div>
                <CopyLinkButton url={payUrl} label="Copy" copiedMessage="Payment link copied" />
              </li>
            ) : null}
          </ul>
        </Card>

        <Card title="Invoices">
          {project.invoices.length === 0 ? (
            <p className="text-sm text-gray-500">No invoices yet. They are generated when a payment clears.</p>
          ) : (
            <ul className="space-y-3">
              {project.invoices.map((invoice) => (
                <li key={invoice.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <div>
                    <p className="text-gray-200">
                      <span className="font-mono text-gold">{invoice.invoiceNumber}</span> · {INVOICE_LABELS[invoice.type]}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(invoice.issueDate)} · {formatCurrency(invoice.total)} · {invoice.status}
                    </p>
                  </div>
                  {invoice.pdfUrl ? (
                    <a
                      href={invoice.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors bg-gray-700/40 text-gray-200 border-gray-600 hover:bg-gray-700/70"
                    >
                      <DocumentArrowDownIcon className="w-4 h-4" aria-hidden="true" />
                      PDF
                    </a>
                  ) : (
                    <span className="text-xs text-gray-500">No PDF</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <MilestoneManager projectId={project.id} milestones={project.milestones} />
    </div>
  );
}
