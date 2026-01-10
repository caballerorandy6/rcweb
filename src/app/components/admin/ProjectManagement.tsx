"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { getAllProjectsAction } from "@/actions/projects/getAllProjectsAction";
import { getProjectStatsAction } from "@/actions/projects/getProjectStatsAction";
import { updateProjectStatusAction } from "@/actions/projects/updateProjectStatusAction";
import { getMilestonesAction } from "@/actions/milestones/getMilestonesAction";
import { getAdminDeliverablesAction } from "@/actions/deliverables/getAdminDeliverablesAction";
import MilestoneManager from "./MilestoneManager";
import AdminDeliverables from "./AdminDeliverables";
import { Milestone } from "@/types/milestone";
import type { AdminDeliverable } from "@/types/deliverable";
import { AdminProject, ProjectStatus } from "@/types/project";
import { ProjectStats } from "@/types/stats";
import { FlagIcon, FolderIcon } from "@heroicons/react/24/outline";

type ProjectManagementProps = {
  initialProjects: AdminProject[];
  initialStats: ProjectStats | null;
};

export default function ProjectManagement({
  initialProjects,
  initialStats,
}: ProjectManagementProps) {
  const [projects, setProjects] = useState<AdminProject[]>(initialProjects);
  const [stats, setStats] = useState<ProjectStats | null>(initialStats);
  const [isPending, startTransition] = useTransition();

  const [selectedProject, setSelectedProject] = useState<{
    id: string;
    projectCode: string;
    milestones: Milestone[];
  } | null>(null);

  const [selectedDeliverables, setSelectedDeliverables] = useState<{
    paymentId: string;
    projectCode: string;
    planName: string;
    clientName: string;
    deliverables: AdminDeliverable[];
  } | null>(null);

  const handleOpenMilestones = async (project: AdminProject) => {
    const result = await getMilestonesAction(project.id);

    if (result.success && result.data) {
      setSelectedProject({
        id: project.id,
        projectCode: project.projectCode,
        milestones: result.data.milestones,
      });
    } else if (!result.success) {
      toast.error(result.error || "Failed to load milestones");
    }
  };

  const handleOpenDeliverables = async (project: AdminProject) => {
    const result = await getAdminDeliverablesAction(project.id);

    if (result.success && result.data) {
      setSelectedDeliverables({
        paymentId: project.id,
        projectCode: project.projectCode,
        planName: project.planName,
        clientName: project.name,
        deliverables: result.data.deliverables,
      });
    } else if (!result.success) {
      toast.error(result.error || "Failed to load deliverables");
    }
  };

  const loadData = async () => {
    try {
      const [projectsResult, statsResult] = await Promise.all([
        getAllProjectsAction(),
        getProjectStatsAction(),
      ]);

      if (projectsResult.success && projectsResult.data) {
        setProjects(
          projectsResult.data.projects.map((project) => ({
            ...project,
            createdAt:
              typeof project.createdAt === "string"
                ? project.createdAt
                : project.createdAt.toISOString(),
          }))
        );
      } else if (!projectsResult.success) {
        toast.error(projectsResult.error || "Failed to load projects");
      }

      if (statsResult.success && statsResult.data) {
        setStats(statsResult.data.stats);
      }
    } catch (error) {
      toast.error("Failed to load data");
      console.error(error);
    }
  };

  const handleStatusUpdate = (projectCode: string, newStatus: string) => {
    startTransition(async () => {
      const result = await updateProjectStatusAction(
        projectCode,
        newStatus as ProjectStatus
      );

      if (result.success) {
        toast.success(
          `Project ${projectCode} updated to ${formatStatus(newStatus)}`
        );
        if (newStatus === "ready_for_payment") {
          toast.info("Email notification will be sent to client");
        }
        loadData();
      } else if (!result.success) {
        toast.error(result.error || "Failed to update project");
      }
    });
  };

  const formatStatus = (status: string): string => {
    return status.replace("_", " ");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/40";
      case "in_progress":
        return "bg-blue-500/10 text-blue-400 border-blue-500/40";
      case "ready_for_payment":
        return "bg-orange-500/10 text-orange-400 border-orange-500/40";
      case "completed":
        return "bg-green-500/10 text-green-400 border-green-500/40";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/40";
    }
  };

  const getNextStatus = (currentStatus: string, secondPaid: boolean) => {
    if (secondPaid) {
      return null;
    }
    switch (currentStatus) {
      case "pending":
        return "in_progress";
      case "in_progress":
        return "ready_for_payment";
      case "ready_for_payment":
        return "completed";
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gold font-iceland mb-2">
          Project Management
        </h1>
        <p className="text-base sm:text-lg text-gray-400 font-inter">
          Manage all your projects and track progress
        </p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 font-inter">
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gold/20 rounded-xl p-4 sm:p-6 shadow-lg shadow-black/20 hover:border-gold/40 transition-all duration-300">
            <h3 className="text-gray-400 text-xs sm:text-sm mb-2 font-medium">
              Total Projects
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-white font-iceland">
              {stats.total}
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-blue-500/20 rounded-xl p-4 sm:p-6 shadow-lg shadow-black/20 hover:border-blue-500/40 transition-all duration-300">
            <h3 className="text-gray-400 text-xs sm:text-sm mb-2 font-medium">
              In Progress
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-blue-400 font-iceland">
              {stats.inProgress}
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-orange-500/20 rounded-xl p-4 sm:p-6 shadow-lg shadow-black/20 hover:border-orange-500/40 transition-all duration-300">
            <h3 className="text-gray-400 text-xs sm:text-sm mb-2 font-medium">
              Awaiting Payment
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-orange-400 font-iceland">
              {stats.awaitingPayment}
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-green-500/20 rounded-xl p-4 sm:p-6 shadow-lg shadow-black/20 hover:border-green-500/40 transition-all duration-300">
            <h3 className="text-gray-400 text-xs sm:text-sm mb-2 font-medium">
              Completed
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-green-400 font-iceland">
              {stats.completed}
            </p>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden shadow-xl shadow-black/20 font-inter">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-700/80 to-gray-800/80 text-left border-b border-gray-700/50">
                <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gold uppercase tracking-wider">
                  Code
                </th>
                <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gold uppercase tracking-wider">
                  Client
                </th>
                <th className="hidden md:table-cell px-6 lg:px-8 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gold uppercase tracking-wider">
                  Plan
                </th>
                <th className="hidden lg:table-cell px-8 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gold uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gold uppercase tracking-wider">
                  Payments
                </th>
                <th className="hidden sm:table-cell px-6 lg:px-8 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gold uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gold uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-gray-700/20 transition-all duration-200"
                >
                  <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
                    <span className="font-mono text-sm sm:text-base font-semibold text-gold">
                      {project.projectCode}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
                    <div>
                      <div className="text-sm sm:text-base text-white font-semibold mb-1">
                        {project.name}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400 truncate max-w-[150px] sm:max-w-none">
                        {project.email}
                      </div>
                      <div className="md:hidden mt-2 space-y-1">
                        <div>
                          <span className="text-xs text-gray-500">
                            {project.planName}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-semibold text-gold">
                            ${(project.totalAmount / 100).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="sm:hidden mt-2">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.projectStatus)}`}
                        >
                          {formatStatus(project.projectStatus)}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-6 lg:px-8 py-4 sm:py-5 text-sm sm:text-base text-white font-medium">
                    {project.planName}
                  </td>
                  <td className="hidden lg:table-cell px-8 py-4 sm:py-5 text-sm sm:text-base text-white font-semibold">
                    ${(project.totalAmount / 100).toFixed(2)}
                  </td>
                  <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-medium border ${
                          project.firstPaid
                            ? "bg-green-500/10 text-green-400 border-green-500/30"
                            : "bg-red-500/10 text-red-400 border-red-500/30"
                        }`}
                      >
                        1st: {project.firstPaid ? "✓" : "✗"}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-medium border ${
                          project.secondPaid
                            ? "bg-green-500/10 text-green-400 border-green-500/30"
                            : "bg-red-500/10 text-red-400 border-red-500/30"
                        }`}
                      >
                        2nd: {project.secondPaid ? "✓" : "✗"}
                      </span>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-6 lg:px-8 py-4 sm:py-5">
                    <span
                      className={`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border ${getStatusColor(project.projectStatus)}`}
                    >
                      {formatStatus(project.projectStatus)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
                    <div className="flex items-center flex-wrap gap-2">
                      <div className="relative group">
                        <button
                          onClick={() => handleOpenMilestones(project)}
                          className="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-200"
                        >
                          <FlagIcon className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 border border-gray-700">
                          Manage Milestones
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                            <div className="border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                      <div className="relative group">
                        <button
                          onClick={() => handleOpenDeliverables(project)}
                          className="p-2 bg-gold/20 text-gold rounded-lg hover:bg-gold/30 border border-gold/30 hover:border-gold/50 transition-all duration-200"
                        >
                          <FolderIcon className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 border border-gray-700">
                          Manage Deliverables
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                            <div className="border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                      {getNextStatus(
                        project.projectStatus,
                        project.secondPaid
                      ) &&
                        project.firstPaid &&
                        !project.secondPaid && (
                          <div className="relative group">
                            <button
                              onClick={() =>
                                handleStatusUpdate(
                                  project.projectCode,
                                  getNextStatus(
                                    project.projectStatus,
                                    project.secondPaid
                                  )!
                                )
                              }
                              disabled={isPending}
                              className="relative inline-flex items-center justify-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-black bg-gradient-to-r from-gold via-yellow-200 to-gold hover:from-yellow-200 hover:via-gold hover:to-yellow-200 rounded-lg transition-all duration-300 shadow-lg hover:shadow-gold/25 font-inter group/btn overflow-hidden transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 whitespace-nowrap"
                            >
                              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                              <span className="relative flex items-center justify-center">
                                {isPending
                                  ? "..."
                                  : getNextStatus(
                                        project.projectStatus,
                                        project.secondPaid
                                      ) === "ready_for_payment"
                                    ? "📧 Mark Ready"
                                    : `→ ${getNextStatus(project.projectStatus, project.secondPaid)?.replace("_", " ")}`}
                              </span>
                            </button>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 border border-gray-700">
                              {getNextStatus(
                                project.projectStatus,
                                project.secondPaid
                              ) === "ready_for_payment"
                                ? "Mark project as ready for final payment"
                                : `Update status to ${getNextStatus(project.projectStatus, project.secondPaid)?.replace("_", " ")}`}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                                <div className="border-4 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedProject && (
        <MilestoneManager
          paymentId={selectedProject.id}
          projectCode={selectedProject.projectCode}
          initialMilestones={selectedProject.milestones}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {selectedDeliverables && (
        <AdminDeliverables
          paymentId={selectedDeliverables.paymentId}
          projectCode={selectedDeliverables.projectCode}
          planName={selectedDeliverables.planName}
          clientName={selectedDeliverables.clientName}
          initialDeliverables={selectedDeliverables.deliverables}
          onClose={() => setSelectedDeliverables(null)}
          onRefresh={loadData}
        />
      )}
    </div>
  );
}
