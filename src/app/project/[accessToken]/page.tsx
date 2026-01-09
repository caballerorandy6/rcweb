import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicMilestonesAction } from "@/actions/milestones/getPublicMilestonesAction";
import ClientMilestoneView from "@/app/components/client/ClientMilestoneView";
import {
  CodeBracketIcon,
  UserIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { getProjectStatusLabel } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Project Progress - RC Web Solutions",
  description: "Track your project progress and milestones",
  robots: {
    index: false,
    follow: false,
  },
};

type Params = Promise<{ accessToken: string }>;

export default async function ProjectPage(props: { params: Params }) {
  const params = await props.params;
  const { accessToken } = params;

  const result = await getPublicMilestonesAction(accessToken);

  if (!result.success || !result.data) {
    notFound();
  }

  const { project, milestones } = result.data;

  const status = getProjectStatusLabel(project.projectStatus);

  return (
    <main className="min-h-screen bg-gray-900 pt-28 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gold font-iceland mb-2">
            Project Progress
          </h1>
          <p className="text-gray-400 font-inter mx-auto">
            Track the progress of your project in real-time
          </p>
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
                <p className="text-xs text-gray-500 font-inter">Project Code</p>
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
                <p className="text-xs text-gray-500 font-inter">Client</p>
                <p className="text-white font-inter">{project.name}</p>
              </div>
            </div>

            {/* Plan */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <DocumentTextIcon className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-inter">Plan</p>
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

        {/* Milestones */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white font-iceland mb-6">
            Project Milestones
          </h2>
          <ClientMilestoneView milestones={milestones} />
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm font-inter mx-auto">
            Questions about your project?{" "}
            <a
              href="mailto:contact@rcwebsolutionsllc.com"
              className="text-gold hover:underline"
            >
              Contact us
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
