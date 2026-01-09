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
        <h3 className="text-xl text-gold font-semibold font-inter mb-4">
          Project Deliverables
        </h3>
        <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50 text-center">
          <p className="text-gray-400 font-inter">
            No deliverables available yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-xl text-gold font-semibold font-inter mb-4">
        Project Deliverables
      </h3>
      <div className="space-y-3">
        {deliverables.map((deliverable) => (
          <div
            key={deliverable.id}
            className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gold/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="text-gold mt-0.5">
                  {getDeliverableIcon(deliverable.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-semibold font-inter">
                      {deliverable.name}
                    </h4>
                    <span className="px-2 py-0.5 bg-gold/20 text-gold text-xs font-inter rounded">
                      {getDeliverableTypeLabel(deliverable.type)}
                    </span>
                  </div>
                  {deliverable.description && (
                    <p className="text-gray-400 text-sm font-inter mb-2">
                      {deliverable.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500 font-inter">
                    <span>{formatFileSize(deliverable.fileSize)}</span>
                    <span>•</span>
                    <span>Uploaded {formatDate(deliverable.createdAt)}</span>
                  </div>
                </div>
              </div>
              <a
                href={deliverable.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-lg font-semibold font-inter hover:bg-yellow-200 transition-colors whitespace-nowrap"
              >
                <CloudArrowDownIcon className="w-4 h-4" />
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
