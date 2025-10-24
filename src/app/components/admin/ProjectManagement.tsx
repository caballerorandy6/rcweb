"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { getAllProjectsAction } from "@/actions/projects/getAllProjectsAction";
import { getProjectStatsAction } from "@/actions/projects/getProjectStatsAction";
import { updateProjectStatusAction } from "@/actions/projects/updateProjectStatusAction";

type Project = {
  id: string;
  projectCode: string;
  email: string;
  name: string;
  planName: string;
  totalAmount: number;
  firstPaid: boolean;
  secondPaid: boolean;
  projectStatus: string;
  createdAt: string;
};

type Stats = {
  total: number;
  pending: number;
  completed: number;
  awaitingPayment: number;
};

type ProjectManagementProps = {
  initialProjects: Project[];
  initialStats: Stats | null;
};

export default function ProjectManagement({
  initialProjects,
  initialStats,
}: ProjectManagementProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [stats, setStats] = useState<Stats | null>(initialStats);
  const [isPending, startTransition] = useTransition();

  const loadData = async () => {
    try {
      const [projectsResult, statsResult] = await Promise.all([
        getAllProjectsAction(),
        getProjectStatsAction(),
      ]);

      if (projectsResult.success) {
        setProjects(
          projectsResult.projects!.map((project) => ({
            ...project,
            createdAt:
              typeof project.createdAt === "string"
                ? project.createdAt
                : project.createdAt.toISOString(),
          }))
        );
      } else {
        toast.error("Failed to load projects");
      }

      if (statsResult.success) {
        setStats(statsResult.stats!);
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
        newStatus as
          | "pending"
          | "in_progress"
          | "ready_for_payment"
          | "completed"
      );

      if (result.success) {
        toast.success(`Project ${projectCode} updated to ${newStatus}`);
        if (newStatus === "ready_for_payment") {
          toast.info("Email notification will be sent to client");
        }
        loadData(); // Recargar datos
      } else {
        toast.error(result.error || "Failed to update project");
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-500";
      case "in_progress":
        return "bg-blue-500/20 text-blue-500";
      case "ready_for_payment":
        return "bg-orange-500/20 text-orange-500";
      case "completed":
        return "bg-green-500/20 text-green-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const getNextStatus = (currentStatus: string) => {
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gold font-iceland">
          Project Management
        </h1>
        <p className="text-gray-400 font-inter mt-2">
          Manage all your projects and track progress
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-inter">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm mb-1">Total Projects</h3>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm mb-1">In Progress</h3>
            <p className="text-2xl font-bold text-blue-500">{stats.pending}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm mb-1">Awaiting Payment</h3>
            <p className="text-2xl font-bold text-orange-500">
              {stats.awaitingPayment}
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm mb-1">Completed</h3>
            <p className="text-2xl font-bold text-green-500">
              {stats.completed}
            </p>
          </div>
        </div>
      )}

      {/* Projects Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden font-inter">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700 text-left">
                <th className="px-6 py-3 text-sm font-medium text-gray-300">
                  Code
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-300">
                  Client
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-300">
                  Plan
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-300">
                  Amount
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-300">
                  Payments
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-300">
                  Status
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-750">
                  <td className="px-6 py-4">
                    <span className="font-mono text-gold">
                      {project.projectCode}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-white">{project.name}</div>
                      <div className="text-sm text-gray-400">
                        {project.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white">{project.planName}</td>
                  <td className="px-6 py-4 text-white">
                    ${(project.totalAmount / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          project.firstPaid
                            ? "bg-green-500/20 text-green-500"
                            : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        1st: {project.firstPaid ? "✓" : "✗"}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          project.secondPaid
                            ? "bg-green-500/20 text-green-500"
                            : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        2nd: {project.secondPaid ? "✓" : "✗"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.projectStatus)}`}
                    >
                      {project.projectStatus.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {getNextStatus(project.projectStatus) &&
                      project.firstPaid && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(
                              project.projectCode,
                              getNextStatus(project.projectStatus)!
                            )
                          }
                          disabled={isPending}
                          className="px-4 py-2 bg-gold text-gray-900 rounded text-sm font-medium hover:bg-gold/90 transition-colors disabled:opacity-50"
                        >
                          {isPending
                            ? "..."
                            : getNextStatus(project.projectStatus) ===
                                "ready_for_payment"
                              ? "📧 Mark Ready"
                              : `→ ${getNextStatus(project.projectStatus)?.replace("_", " ")}`}
                        </button>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
