"use client";

import { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ClientInvoiceWithProject } from "@/types/client";

interface ClientInvoicesProps {
  invoices: ClientInvoiceWithProject[];
  projects: { projectCode: string; planName: string }[];
}

export default function ClientInvoices({
  invoices,
  projects,
}: ClientInvoicesProps) {
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredInvoices = invoices.filter((invoice) => {
    const projectMatch =
      selectedProject === "all" || invoice.projectCode === selectedProject;
    const typeMatch = selectedType === "all" || invoice.type === selectedType;
    const statusMatch =
      selectedStatus === "all" || invoice.status === selectedStatus;

    return projectMatch && typeMatch && statusMatch;
  });

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      initial: "Initial Payment",
      final: "Final Payment",
      summary: "Summary",
    };
    return labels[type] || type;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      paid: "text-green-400 bg-green-400/10",
      pending: "text-yellow-400 bg-yellow-400/10",
      cancelled: "text-red-400 bg-red-400/10",
    };
    return colors[status] || "text-gray-400 bg-gray-400/10";
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-24 sm:pt-32 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/client/dashboard"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-gold transition-colors font-inter mb-4"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl text-gold font-bold font-iceland mb-4">
            My Invoices
          </h1>
          <p className="text-gray-400 font-inter">
            View and download all your invoices
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 p-6 rounded-2xl shadow-2xl backdrop-blur-sm border border-gray-700/50 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Project Filter */}
            <div>
              <label className="block text-sm font-inter text-gray-400 mb-2">
                Filter by Project
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white font-inter focus:outline-none focus:border-gold transition-colors"
              >
                <option value="all">All Projects</option>
                {projects.map((project) => (
                  <option key={project.projectCode} value={project.projectCode}>
                    {project.projectCode} - {project.planName}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-inter text-gray-400 mb-2">
                Filter by Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white font-inter focus:outline-none focus:border-gold transition-colors"
              >
                <option value="all">All Types</option>
                <option value="initial">Initial Payment</option>
                <option value="final">Final Payment</option>
                <option value="summary">Summary</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-inter text-gray-400 mb-2">
                Filter by Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white font-inter focus:outline-none focus:border-gold transition-colors"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Invoices List */}
        {filteredInvoices.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 p-12 rounded-2xl shadow-2xl backdrop-blur-sm border border-gray-700/50 text-center">
            <p className="text-gray-400 font-inter text-lg">
              {invoices.length === 0
                ? "You don't have any invoices yet."
                : "No invoices match your filters."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 p-6 rounded-xl border border-gray-700/50 hover:border-gold/50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl text-white font-semibold font-inter">
                        {invoice.invoiceNumber}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded text-xs font-inter ${getStatusColor(
                          invoice.status
                        )}`}
                      >
                        {invoice.status.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 rounded text-xs font-inter bg-gold/20 text-gold">
                        {getTypeLabel(invoice.type)}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm font-inter">
                      <p className="text-gray-400">
                        <span className="text-gray-500">Project:</span>{" "}
                        <span className="text-white">
                          {invoice.projectCode} - {invoice.planName}
                        </span>
                      </p>
                      <p className="text-gray-400">
                        <span className="text-gray-500">Issue Date:</span>{" "}
                        <span className="text-white">
                          {formatDate(invoice.issueDate)}
                        </span>
                      </p>
                      <p className="text-2xl text-gold font-bold font-iceland mt-2">
                        {formatCurrency(invoice.total)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {invoice.pdfUrl ? (
                      <a
                        href={invoice.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-gold text-black rounded-lg font-semibold font-inter hover:bg-yellow-200 transition-colors whitespace-nowrap"
                      >
                        Download PDF
                      </a>
                    ) : (
                      <span className="px-6 py-3 bg-gray-700 text-gray-400 rounded-lg font-semibold font-inter cursor-not-allowed whitespace-nowrap">
                        PDF Unavailable
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {filteredInvoices.length > 0 && (
          <div className="mt-6 bg-gradient-to-br from-gray-900/95 to-gray-800/95 p-6 rounded-xl border border-gray-700/50">
            <p className="text-gray-400 font-inter">
              Showing {filteredInvoices.length} of {invoices.length} invoice
              {invoices.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
