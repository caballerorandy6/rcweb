"use client";

import { useState } from "react";
import {
  CloudArrowDownIcon,
  DocumentIcon,
  FolderIcon,
  KeyIcon,
  PhotoIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";
import {
  formatDate,
  getDeliverableTypeLabel,
  formatFileSize,
} from "@/lib/utils";
import type { ClientDeliverable } from "@/types/deliverable";

interface ClientDeliverablesProps {
  deliverables: ClientDeliverable[];
  projectCode: string;
}

const getDeliverableIcon = (type: string) => {
  switch (type) {
    case "source_code":
      return <CodeBracketIcon className="w-5 h-5" />;
    case "documentation":
      return <DocumentIcon className="w-5 h-5" />;
    case "assets":
      return <PhotoIcon className="w-5 h-5" />;
    case "credentials":
      return <KeyIcon className="w-5 h-5" />;
    default:
      return <FolderIcon className="w-5 h-5" />;
  }
};

export default function ClientDeliverables({
  deliverables,
  projectCode,
}: ClientDeliverablesProps) {
  if (deliverables.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="text-lg sm:text-xl text-gold font-semibold font-inter mb-4">
          Project Deliverables
        </h3>
        <div className="p-4 sm:p-6 bg-gray-800/50 rounded-xl border border-gray-700/50 text-center">
          <p className="text-sm sm:text-base text-gray-400 font-inter">
            No deliverables available yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg sm:text-xl text-gold font-semibold font-inter mb-4">
        Project Deliverables
      </h3>
      <div className="space-y-3">
        {deliverables.map((deliverable) => (
          <div
            key={deliverable.id}
            className="p-3 sm:p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gold/50 transition-colors"
          >
            {/* Mobile Layout: Stacked */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
              {/* Content Section */}
              <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                {/* Icon */}
                <div className="text-gold mt-0.5 flex-shrink-0">
                  {getDeliverableIcon(deliverable.type)}
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  {/* Title and Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 mb-1">
                    <h4 className="text-sm sm:text-base text-white font-semibold font-inter truncate">
                      {deliverable.name}
                    </h4>
                    <span className="px-2 py-0.5 bg-gold/20 text-gold text-xs font-inter rounded flex-shrink-0 w-fit">
                      {getDeliverableTypeLabel(deliverable.type)}
                    </span>
                  </div>

                  {/* Description */}
                  {deliverable.description && (
                    <p className="text-xs sm:text-sm text-gray-400 font-inter mb-2 line-clamp-2">
                      {deliverable.description}
                    </p>
                  )}

                  {/* Metadata */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 md:gap-4 text-xs text-gray-500 font-inter">
                    <span className="whitespace-nowrap">
                      {formatFileSize(deliverable.fileSize)}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="truncate">
                      Uploaded {formatDate(deliverable.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <a
                href={deliverable.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="relative flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold text-black bg-gradient-to-r from-gold via-yellow-200 to-gold hover:from-yellow-200 hover:via-gold hover:to-yellow-200 rounded-lg transition-all duration-300 shadow-lg hover:shadow-gold/25 font-inter group overflow-hidden transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap w-full sm:w-auto flex-shrink-0"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                <span className="relative flex items-center justify-center gap-2">
                  <CloudArrowDownIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Download</span>
                </span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
