"use client";

import { useState } from "react";
import {
  PlusIcon,
  TrashIcon,
  XMarkIcon,
  CloudArrowUpIcon,
  DocumentIcon,
  FolderIcon,
  KeyIcon,
  PhotoIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";
import type { AdminDeliverable, DeliverableType } from "@/types/deliverable";
import { uploadDeliverableAction } from "@/actions/deliverables/uploadDeliverableAction";
import { deleteDeliverableAction } from "@/actions/deliverables/deleteDeliverableAction";
import {
  getDeliverableTypeLabel,
  formatFileSize,
  formatDate,
} from "@/lib/utils";
import { toast } from "sonner";

type AdminDeliverablesProps = {
  paymentId: string;
  projectCode: string;
  planName: string;
  clientName: string;
  initialDeliverables: AdminDeliverable[];
  onClose: () => void;
  onRefresh?: () => void;
};

const DELIVERABLE_TYPES: DeliverableType[] = [
  "source_code",
  "documentation",
  "assets",
  "credentials",
  "other",
];

export default function AdminDeliverables({
  paymentId,
  projectCode,
  planName,
  clientName,
  initialDeliverables,
  onClose,
  onRefresh,
}: AdminDeliverablesProps) {
  const [deliverables, setDeliverables] =
    useState<AdminDeliverable[]>(initialDeliverables);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [fileName, setFileName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<DeliverableType>("source_code");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const clientEmail =
    initialDeliverables.length > 0 ? initialDeliverables[0].clientEmail : "";

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

  const handleUpload = async () => {
    if (!fileName.trim() || !selectedFile) {
      toast.error("Please provide a file and name");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("paymentId", paymentId);
      formData.append("name", fileName.trim());
      formData.append("description", description.trim() || "");
      formData.append("type", type);
      formData.append("file", selectedFile);

      const result = await uploadDeliverableAction(formData);

      if (result.success && result.data) {
        const newDeliverable: AdminDeliverable = {
          id: result.data.deliverableId,
          paymentId,
          projectCode,
          planName,
          clientName,
          clientEmail,
          name: fileName.trim(),
          description: description.trim() || null,
          type,
          fileUrl: result.data.fileUrl,
          blobKey: null,
          fileSize: selectedFile.size,
          mimeType: selectedFile.type || null,
          uploadedBy: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setDeliverables([newDeliverable, ...deliverables]);
        setFileName("");
        setDescription("");
        setType("source_code");
        setSelectedFile(null);
        setIsAdding(false);

        toast.success("Deliverable uploaded successfully");

        if (onRefresh) {
          onRefresh();
        }
      } else if (!result.success) {
        toast.error(result.error || "Failed to upload deliverable");
      }
    } catch (error) {
      console.error("Error uploading deliverable:", error);
      toast.error("An error occurred while uploading");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (deliverableId: string) => {
    if (!confirm("Are you sure you want to delete this deliverable?")) {
      return;
    }

    setIsDeleting(deliverableId);

    try {
      const result = await deleteDeliverableAction(deliverableId);

      if (result.success) {
        setDeliverables(deliverables.filter((d) => d.id !== deliverableId));
        toast.success("Deliverable deleted successfully");

        if (onRefresh) {
          onRefresh();
        }
      } else {
        toast.error(result.error || "Failed to delete deliverable");
      }
    } catch (error) {
      console.error("Error deleting deliverable:", error);
      toast.error("An error occurred while deleting");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!fileName.trim()) {
        setFileName(file.name);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gold font-iceland">
              Project Deliverables
            </h2>
            <p className="text-gray-400 text-sm font-inter mt-1">
              Project:{" "}
              <span className="text-gold font-mono">{projectCode}</span> •{" "}
              <span className="text-white">{planName}</span>
            </p>
            <p className="text-gray-500 text-xs font-inter mt-1">
              Client: {clientName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {deliverables.length === 0 ? (
            <div className="text-center py-12">
              <FolderIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 font-inter">No deliverables yet</p>
              <p className="text-gray-500 text-sm font-inter mt-1">
                Upload deliverables to share with the client
              </p>
            </div>
          ) : (
            deliverables.map((deliverable) => (
              <div
                key={deliverable.id}
                className="p-4 rounded-lg border border-gray-700/50 bg-gray-900/50 hover:border-gold/30 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="text-gold mt-0.5 flex-shrink-0">
                    {getDeliverableIcon(deliverable.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white font-inter truncate">
                          {deliverable.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 bg-gold/20 text-gold text-xs font-inter rounded">
                            {getDeliverableTypeLabel(deliverable.type)}
                          </span>
                          {deliverable.fileSize && (
                            <span className="text-xs text-gray-500 font-inter">
                              {formatFileSize(deliverable.fileSize)}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(deliverable.id)}
                        disabled={isDeleting === deliverable.id}
                        className="p-1.5 hover:bg-red-500/20 rounded transition-colors disabled:opacity-50 flex-shrink-0"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4 text-red-400" />
                      </button>
                    </div>

                    {deliverable.description && (
                      <p className="text-sm text-gray-400 mt-2 font-inter line-clamp-2">
                        {deliverable.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 font-inter">
                      <span>Uploaded: {formatDate(deliverable.createdAt)}</span>
                      {deliverable.uploadedBy && (
                        <span>by {deliverable.uploadedBy}</span>
                      )}
                    </div>

                    <a
                      href={deliverable.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-3 text-sm text-gold hover:text-yellow-200 transition-colors font-inter"
                    >
                      <CloudArrowUpIcon className="w-4 h-4 rotate-180" />
                      View/Download
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}

          {isAdding && (
            <div className="p-4 rounded-lg border border-gold/30 bg-gold/5">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-300 mb-2 font-inter">
                    File *
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gold file:text-gray-900 hover:file:bg-gold/90 file:cursor-pointer font-inter"
                  />
                  {selectedFile && (
                    <p className="text-xs text-gray-400 mt-1 font-inter">
                      Selected: {selectedFile.name} (
                      {formatFileSize(selectedFile.size)})
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2 font-inter">
                    Deliverable Name *
                  </label>
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="Enter deliverable name..."
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-gold font-inter"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2 font-inter">
                    Description (Optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description..."
                    rows={2}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-gold font-inter resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2 font-inter">
                    Type *
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as DeliverableType)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-gold font-inter"
                  >
                    {DELIVERABLE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {getDeliverableTypeLabel(t)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleUpload}
                    disabled={isUploading || !fileName.trim() || !selectedFile}
                    className="px-4 py-2 bg-gold text-gray-900 rounded font-semibold hover:bg-gold/90 transition-colors font-inter disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? "Uploading..." : "Upload Deliverable"}
                  </button>
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setFileName("");
                      setDescription("");
                      setType("source_code");
                      setSelectedFile(null);
                    }}
                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors font-inter"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-700 flex justify-between">
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-gray-900 rounded-lg font-semibold hover:bg-gold/90 transition-colors font-inter"
            >
              <PlusIcon className="w-5 h-5" />
              Upload Deliverable
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-inter ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
