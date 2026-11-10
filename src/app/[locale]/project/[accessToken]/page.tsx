import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { COMPANY } from "@/lib/company";
import { getPublicMilestonesAction } from "@/actions/milestones/getPublicMilestonesAction";
import ClientMilestoneView from "@/components/project/ClientMilestoneView";
import {
  CodeBracketIcon,
  UserIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { formatCurrency, getProjectStatusLabel } from "@/lib/utils";
import type { ProjectStatus } from "@/generated/prisma/enums";
import Button from "@/components/ui/Button";

// Per-customer data behind a token: never prerendered or cached
export const dynamic = "force-dynamic";

type Props = PageProps<"/[locale]/project/[accessToken]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "Project" });
  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    robots: { index: false, follow: false },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { accessToken } = await params;

  const [result, t] = await Promise.all([
    getPublicMilestonesAction(accessToken),
    getTranslations("Project"),
  ]);

  if (!result.success || !result.data) {
    notFound();
  }

  const { project, milestones } = result.data;

  // Colour from the shared map; the label in the visitor's language
  const status = {
    color: getProjectStatusLabel(project.status).color,
    label: t.has(`status.${project.status as ProjectStatus}`)
      ? t(`status.${project.status as ProjectStatus}`)
      : project.status,
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-28 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl text-gold font-iceland mb-2">{t("title")}</h1>
          <p className="text-gray-400 font-inter mx-auto">{t("subtitle")}</p>
        </div>

        {/* Project Info Card */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <div className="flex flex-wrap gap-6">
            {/* Project Code */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                <CodeBracketIcon className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-inter">{t("code")}</p>
                <p className="font-mono text-gold font-semibold">
                  {project.projectCode}
                </p>
              </div>
            </div>

            {/* Client Name */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-inter">{t("client")}</p>
                <p className="text-white font-inter">{project.name}</p>
              </div>
            </div>

            {/* Plan */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <DocumentTextIcon className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-inter">{t("plan")}</p>
                <p className="text-white font-inter">{project.planName}</p>
              </div>
            </div>

            {/* Status */}
            <div className="ml-auto">
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium font-inter ${status.color}`}
              >
                {status.label}
              </span>
            </div>
          </div>
        </div>

        {/* Final payment call to action */}
        {project.status === "ready_for_payment" && (
          <div className="bg-gold/10 border border-gold/40 rounded-xl p-6 mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-white font-semibold font-inter">{t("ready.title")}</p>
              <p className="text-gray-400 text-sm font-inter">
                {t("ready.text", {
                  amount:
                    project.finalAmount !== null
                      ? t("ready.of", { amount: formatCurrency(project.finalAmount) })
                      : "",
                })}
              </p>
            </div>
            <Button href={{ pathname: "/pay/[token]", params: { token: accessToken } }}>
              {t("ready.pay")}
            </Button>
          </div>
        )}

        {/* Milestones */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl text-white font-iceland mb-6">{t("milestones")}</h2>
          <ClientMilestoneView milestones={milestones} />
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm font-inter mx-auto">
            {t("questions")}{" "}
            <a href={`mailto:${COMPANY.contactEmail}`} className="text-gold hover:underline">
              {t("contact")}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
