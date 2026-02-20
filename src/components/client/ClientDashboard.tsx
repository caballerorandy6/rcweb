"use client";

import { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  formatCurrency,
  formatDate,
  getProjectStatusLabel,
  getMilestoneStatusLabel,
} from "@/lib/utils";
import type { ClientProject } from "@/types/client";
import SignOutButton from "@/components/ui/SignOutButton";
import ClientDeliverables from "./ClientDeliverables";
import ClientMessages from "./ClientMessages";

interface ClientDashboardProps {
  clientName: string;
  projects: ClientProject[];
}

export default function ClientDashboard({
  clientName,
  projects,
}: ClientDashboardProps) {
  const [selectedProject, setSelectedProject] = useState<ClientProject | null>(
    projects.length > 0 ? projects[0] : null
  );

  const getPaymentProgress = (project: ClientProject) => {
    if (project.secondPaid) return 100;
    if (project.firstPaid) return 50;
    return 0;
  };

  // Calculate statistics
  const totalProjects = projects.length;
  const completedProjects = projects.filter(
    (p) => p.projectStatus === "completed"
  ).length;
  const inProgressProjects = projects.filter(
    (p) => p.projectStatus === "in_progress"
  ).length;

  return (
    <div className="min-h-screen bg-gray-900 pt-24 sm:pt-32 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Logout */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl text-gold font-bold font-iceland mb-4">
              Welcome back, {clientName}!
            </h1>
            <p className="text-gray-400 font-inter">
              Here are all your projects and their current status.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/client/invoices"
              className="px-4 py-2 text-sm text-gray-300 hover:text-gold transition-colors font-inter"
            >
              My Invoices
            </Link>
            <Link
              href="/"
              className="px-4 py-2 text-sm text-gray-300 hover:text-gold transition-colors font-inter"
            >
              Back to Site
            </Link>
            <SignOutButton />
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 p-8 lg:p-12 rounded-2xl shadow-2xl backdrop-blur-sm border border-gray-700/50 max-w-md w-full text-center">
              <p className="text-gray-400 font-inter mb-6 text-lg">
                You don't have any projects yet. Once you make a payment, your
                projects will appear here.
              </p>
              <Link
                href="/#pricing"
                className="relative inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-black bg-gradient-to-r from-gold via-yellow-200 to-gold hover:from-yellow-200 hover:via-gold hover:to-yellow-200 rounded-xl transition-all duration-300 shadow-lg hover:shadow-gold/25 font-inter group overflow-hidden transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                <span className="relative flex items-center justify-center">
                  View Pricing Plans
                </span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Statistics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 p-6 rounded-xl border border-gray-700/50">
                <p className="text-gray-400 text-sm font-inter mb-1">
                  Total Projects
                </p>
                <p className="text-3xl text-gold font-bold font-iceland">
                  {totalProjects}
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 p-6 rounded-xl border border-gray-700/50">
                <p className="text-gray-400 text-sm font-inter mb-1">
                  In Progress
                </p>
                <p className="text-3xl text-blue-400 font-bold font-iceland">
                  {inProgressProjects}
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 p-6 rounded-xl border border-gray-700/50">
                <p className="text-gray-400 text-sm font-inter mb-1">
                  Completed
                </p>
                <p className="text-3xl text-green-400 font-bold font-iceland">
                  {completedProjects}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Projects List */}
              <div className="lg:col-span-1">
                <h2 className="text-2xl text-gold font-bold font-iceland mb-6">
                  Your Projects
                </h2>
                <div className="space-y-3">
                  {projects.map((project) => {
                    const statusInfo = getProjectStatusLabel(
                      project.projectStatus
                    );
                    const progress = getPaymentProgress(project);

                    return (
                      <button
                        key={project.id}
                        onClick={() => setSelectedProject(project)}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                          selectedProject?.id === project.id
                            ? "border-gold bg-gold/10"
                            : "border-gray-700/60 bg-gray-800/80 hover:border-gold/50"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-white font-semibold font-inter">
                              {project.planName}
                            </h3>
                            <p className="text-gray-400 text-sm font-inter">
                              {project.projectCode}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-inter ${statusInfo.color}`}
                          >
                            {statusInfo.label}
                          </span>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                            <span className="font-inter">Payment Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-700/50 rounded-full h-2">
                            <div
                              className="bg-gold h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Project Details */}
              {selectedProject && (
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 p-6 lg:p-8 rounded-2xl shadow-2xl backdrop-blur-sm border border-gray-700/50">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-3xl text-gold font-bold font-iceland mb-2">
                          {selectedProject.planName}
                        </h2>
                        <p className="text-gray-400 font-inter">
                          Project Code: {selectedProject.projectCode}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded text-sm font-inter ${getProjectStatusLabel(selectedProject.projectStatus).color}`}
                      >
                        {
                          getProjectStatusLabel(selectedProject.projectStatus)
                            .label
                        }
                      </span>
                    </div>

                    {/* Payment Information */}
                    <div className="mb-6 p-4 sm:p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
                      <h3 className="text-lg sm:text-xl text-gold font-semibold font-inter mb-4">
                        Payment Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-gray-400 text-xs sm:text-sm font-inter">
                            Total Amount
                          </p>
                          <p className="text-white text-base sm:text-lg font-semibold font-inter">
                            {formatCurrency(selectedProject.totalAmount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs sm:text-sm font-inter">
                            First Payment
                          </p>
                          <p className="text-white text-base sm:text-lg font-semibold font-inter">
                            {formatCurrency(selectedProject.firstPayment)}
                          </p>
                          <p
                            className={`text-xs font-inter mt-1 ${
                              selectedProject.firstPaid
                                ? "text-green-400"
                                : "text-yellow-400"
                            }`}
                          >
                            {selectedProject.firstPaid
                              ? `Paid on ${formatDate(selectedProject.firstPaidAt)}`
                              : "Pending"}
                          </p>
                        </div>
                      </div>
                      <div className="mb-4">
                        <p className="text-gray-400 text-xs sm:text-sm font-inter mb-1">
                          Second Payment
                        </p>
                        <p className="text-white text-base sm:text-lg font-semibold font-inter">
                          {formatCurrency(selectedProject.secondPayment)}
                        </p>
                        <p
                          className={`text-xs font-inter mt-1 ${
                            selectedProject.secondPaid
                              ? "text-green-400"
                              : "text-yellow-400"
                          }`}
                        >
                          {selectedProject.secondPaid
                            ? `Paid on ${formatDate(selectedProject.secondPaidAt)}`
                            : "Pending"}
                        </p>
                        {!selectedProject.secondPaid &&
                          selectedProject.projectStatus ===
                            "ready_for_payment" && (
                            <div className="mt-4">
                              <Link
                                href={
                                  `/pay/${selectedProject.accessToken}` as Route
                                }
                                className="relative inline-flex items-center justify-center w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base font-semibold text-black bg-gradient-to-r from-gold via-yellow-200 to-gold hover:from-yellow-200 hover:via-gold hover:to-yellow-200 rounded-lg transition-all duration-300 shadow-lg hover:shadow-gold/25 font-inter group overflow-hidden transform hover:scale-[1.02] active:scale-[0.98]"
                              >
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                                <span className="relative flex items-center justify-center">
                                  Pay Final Payment
                                </span>
                              </Link>
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Milestones */}
                    {selectedProject.milestones.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg sm:text-xl text-gold font-semibold font-inter mb-4">
                          Project Milestones
                        </h3>
                        <div className="space-y-3">
                          {selectedProject.milestones.map((milestone) => {
                            const milestoneStatus = getMilestoneStatusLabel(
                              milestone.status
                            );
                            return (
                              <div
                                key={milestone.id}
                                className="p-3 sm:p-4 bg-gray-800/50 rounded-xl border border-gray-700/50"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                                  <h4 className="text-sm sm:text-base text-white font-semibold font-inter">
                                    {milestone.title}
                                  </h4>
                                  <span
                                    className={`px-2 py-1 rounded text-xs font-inter ${milestoneStatus.color} w-fit`}
                                  >
                                    {milestoneStatus.label}
                                  </span>
                                </div>
                                {milestone.description && (
                                  <p className="text-xs sm:text-sm text-gray-400 font-inter mb-2">
                                    {milestone.description}
                                  </p>
                                )}
                                {milestone.completedAt && (
                                  <p className="text-green-400 text-xs font-inter">
                                    Completed on{" "}
                                    {formatDate(milestone.completedAt)}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Deliverables */}
                    <ClientDeliverables
                      deliverables={selectedProject.deliverables}
                      projectCode={selectedProject.projectCode}
                    />

                    {/* Messages */}
                    <ClientMessages
                      projectCode={selectedProject.projectCode}
                      paymentId={selectedProject.id}
                    />

                    {/* Invoices */}
                    {selectedProject.invoices.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg sm:text-xl text-gold font-semibold font-inter mb-4">
                          Invoices
                        </h3>
                        <div className="space-y-3">
                          {selectedProject.invoices.map((invoice) => (
                            <div
                              key={invoice.id}
                              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-gray-800/50 rounded-xl border border-gray-700/50"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm sm:text-base text-white font-semibold font-inter truncate">
                                  {invoice.invoiceNumber}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-400 font-inter">
                                  {formatCurrency(invoice.total)} •{" "}
                                  {formatDate(invoice.issueDate)}
                                </p>
                              </div>
                              {invoice.pdfUrl && (
                                <a
                                  href={invoice.pdfUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="relative flex items-center justify-center px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold text-black bg-gradient-to-r from-gold via-yellow-200 to-gold hover:from-yellow-200 hover:via-gold hover:to-yellow-200 rounded-lg transition-all duration-300 shadow-lg hover:shadow-gold/25 font-inter group overflow-hidden transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap flex-shrink-0"
                                >
                                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                                  <span className="relative flex items-center justify-center">
                                    Download
                                  </span>
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* View Project Link */}
                    <div className="mt-6">
                      <Link
                        href={
                          `/project/${selectedProject.accessToken}` as Route
                        }
                        className="relative inline-flex items-center justify-center w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-black bg-gradient-to-r from-gold via-yellow-200 to-gold hover:from-yellow-200 hover:via-gold hover:to-yellow-200 rounded-xl transition-all duration-300 shadow-lg hover:shadow-gold/25 font-inter group overflow-hidden transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                        <span className="relative flex items-center justify-center">
                          View Full Project Details
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
