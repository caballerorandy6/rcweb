import Link from "next/link";
import type { Route } from "next";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PROJECT_STATUS_CLASSES, PROJECT_STATUS_LABELS } from "@/lib/project/status";
import ProjectStatusActions from "@/components/admin/ProjectStatusActions";
import type { AdminProject } from "@/types/project";
import type { ProjectStats } from "@/types/stats";

type ProjectManagementProps = {
  projects: AdminProject[];
  stats: ProjectStats | null;
};

const ACCENTS = {
  gold: "border-gold/20 hover:border-gold/40 text-white",
  blue: "border-blue-500/20 hover:border-blue-500/40 text-blue-400",
  orange: "border-orange-500/20 hover:border-orange-500/40 text-orange-400",
  green: "border-green-500/20 hover:border-green-500/40 text-green-400",
} as const;

function StatCard({ label, value, accent }: { label: string; value: number; accent: keyof typeof ACCENTS }) {
  return (
    <div
      className={`bg-linear-to-br from-gray-800/80 to-gray-900/80 border rounded-xl p-4 sm:p-6 shadow-lg shadow-black/20 transition-colors duration-300 ${ACCENTS[accent]}`}
    >
      <h3 className="text-gray-400 text-xs sm:text-sm mb-2 font-medium">{label}</h3>
      <p className="text-2xl sm:text-3xl font-iceland">{value}</p>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gold uppercase tracking-wider ${className}`}
    >
      {children}
    </th>
  );
}

function ChargeBadge({ label, paid }: { label: string; paid: boolean }) {
  return (
    <span
      className={`px-2 py-1 rounded-lg text-xs font-medium border whitespace-nowrap ${
        paid
          ? "bg-green-500/10 text-green-400 border-green-500/30"
          : "bg-gray-500/10 text-gray-300 border-gray-500/30"
      }`}
    >
      {label}: {paid ? "paid" : "pending"}
    </span>
  );
}

/**
 * All projects, newest first. A Server Component: the only interactive part
 * is the status button, which refreshes the route after a change.
 */
export default function ProjectManagement({ projects, stats }: ProjectManagementProps) {
  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 font-inter">
      <div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl text-gold font-iceland mb-2">Projects</h1>
        <p className="text-base sm:text-lg text-gray-400">
          Every project paid through Stripe. Open one to see payments, invoices, links and milestones.
        </p>
      </div>

      {stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard label="Total projects" value={stats.total} accent="gold" />
          <StatCard label="In progress" value={stats.inProgress} accent="blue" />
          <StatCard label="Awaiting payment" value={stats.awaitingPayment} accent="orange" />
          <StatCard label="Completed" value={stats.completed} accent="green" />
        </div>
      ) : null}

      <div className="bg-linear-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-xl overflow-hidden shadow-xl shadow-black/20">
        {projects.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            <p className="mb-2">No projects yet.</p>
            <p className="text-sm text-gray-500">
              A project appears here when a customer pays a deposit, from the catalogue or from a{" "}
              <Link href="/quotes" className="text-gold hover:underline">
                quote
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-linear-to-r from-gray-700/80 to-gray-800/80 text-left border-b border-gray-700/50">
                  <Th>Code</Th>
                  <Th>Client</Th>
                  <Th className="hidden md:table-cell">Plan</Th>
                  <Th className="hidden lg:table-cell">Total</Th>
                  <Th>Payments</Th>
                  <Th className="hidden sm:table-cell">Status</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
                {projects.map((project) => {
                  const href = `/projects/${project.id}` as Route;
                  return (
                    <tr key={project.id} className="hover:bg-gray-700/20 transition-colors">
                      <td className="px-4 sm:px-6 py-4 align-top">
                        <Link href={href} className="font-mono text-sm font-semibold text-gold hover:underline whitespace-nowrap">
                          {project.projectCode}
                        </Link>
                        <div className="text-xs text-gray-500 mt-1 whitespace-nowrap">
                          {formatDate(project.createdAt)}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 align-top">
                        <div className="text-sm text-white font-semibold">{project.name}</div>
                        <div className="text-xs text-gray-400 truncate max-w-[160px] sm:max-w-none">{project.email}</div>
                        <div className="md:hidden text-xs text-gray-500 mt-1">{project.planName}</div>
                        <div className="lg:hidden text-xs font-semibold text-gold mt-1">
                          {formatCurrency(project.totalAmount)}
                        </div>
                        <div className="sm:hidden mt-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${PROJECT_STATUS_CLASSES[project.status]}`}
                          >
                            {PROJECT_STATUS_LABELS[project.status]}
                          </span>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 align-top text-sm text-white">{project.planName}</td>
                      <td className="hidden lg:table-cell px-6 py-4 align-top text-sm text-white font-semibold">
                        {formatCurrency(project.totalAmount)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 align-top">
                        <div className="flex flex-wrap gap-2">
                          <ChargeBadge label="Deposit" paid={project.depositPaid} />
                          <ChargeBadge label="Final" paid={project.finalPaid} />
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 align-top">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${PROJECT_STATUS_CLASSES[project.status]}`}
                        >
                          {PROJECT_STATUS_LABELS[project.status]}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 align-top">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={href}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors bg-gray-700/40 text-gray-200 border-gray-600 hover:bg-gray-700/70"
                          >
                            View
                          </Link>
                          <ProjectStatusActions
                            compact
                            project={{
                              id: project.id,
                              projectCode: project.projectCode,
                              status: project.status,
                              depositPaid: project.depositPaid,
                              finalPaid: project.finalPaid,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
