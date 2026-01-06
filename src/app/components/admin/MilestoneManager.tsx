"use client";

import { useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  PlayCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Milestone } from "@/types/milestone";
import { createMilestoneAction } from "@/actions/milestones/createMilestoneAction";
import { updateMilestoneAction } from "@/actions/milestones/updateMilestoneAction";
import { deleteMilestoneAction } from "@/actions/milestones/deleteMilestoneAction";

type MilestoneManagerProps = {
  paymentId: string;
  projectCode: string;
  initialMilestones: Milestone[];
  onClose: () => void;
};

export default function MilestoneManager({
  paymentId,
  projectCode,
  initialMilestones,
  onClose,
}: MilestoneManagerProps) {
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Calculate progress
  const completedCount = milestones.filter(
    (m) => m.status === "completed"
  ).length;
  const progressPercent =
    milestones.length > 0
      ? Math.round((completedCount / milestones.length) * 100)
      : 0;

 

  const handleAddMilestone = async () => {
    if (!newTitle.trim()) return;
    setIsLoading(true);

    const result = await createMilestoneAction(
      paymentId,
      newTitle,
      newDescription || null,
      milestones.length
    );
    if (result.success && result.data) {
      setMilestones([...milestones, result.data.milestone]);
      setNewTitle("");
      setNewDescription("");
      setIsAdding(false);
    }

    setIsLoading(false);
  };

  const handleUpdateStatus = async (
    id: string,
    newStatus: Milestone["status"]
  ) => {
    setIsLoading(true);

    const result = await updateMilestoneAction(id, {
      status: newStatus,
      completedAt: newStatus === "completed" ? new Date() : null,
    });

    if (result.success && result.data) {
      setMilestones(
        milestones.map((m) => (m.id === id ? result.data.milestone : m))
      );
    }

    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este milestone?")) return;
    setIsLoading(true);

    const result = await deleteMilestoneAction(id);

    if (result.success) {
      setMilestones(milestones.filter((m) => m.id !== id));
    }

    setIsLoading(false);
  };

  const handleUpdateTitle = async (id: string, title: string) => {
    if (!title.trim()) return;
    setIsLoading(true);

    const result = await updateMilestoneAction(id, { title });

    if (result.success && result.data) {
      setMilestones(
        milestones.map((m) => (m.id === id ? result.data.milestone : m))
      );
    }

    setEditingId(null);
    setIsLoading(false);
  };

  // ============================================
  // UI Helpers
  // ============================================

  const getStatusIcon = (status: Milestone["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case "in_progress":
        return <PlayCircleIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Milestone["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-500 border-green-500/30";
      case "in_progress":
        return "bg-blue-500/20 text-blue-500 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getNextStatus = (
    current: Milestone["status"]
  ): Milestone["status"] | null => {
    switch (current) {
      case "pending":
        return "in_progress";
      case "in_progress":
        return "completed";
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gold font-iceland">
              Project Milestones
            </h2>
            <p className="text-gray-400 text-sm font-inter mt-1">
              Project:{" "}
              <span className="text-gold font-mono">{projectCode}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400 font-inter">Progress</span>
            <span className="text-sm text-gold font-semibold font-inter">
              {completedCount}/{milestones.length} completed ({progressPercent}
              %)
            </span>
          </div>
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold to-yellow-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Milestones List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {milestones.length === 0 ? (
            <div className="text-center py-12">
              <ClockIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 font-inter">No milestones yet</p>
              <p className="text-gray-500 text-sm font-inter mt-1">
                Add milestones to track project progress
              </p>
            </div>
          ) : (
            milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className={`p-4 rounded-lg border ${getStatusColor(milestone.status)} transition-all`}
              >
                <div className="flex items-start gap-3">
                  {/* Order Number */}
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold text-white shrink-0">
                    {index + 1}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {editingId === milestone.id ? (
                      <input
                        type="text"
                        defaultValue={milestone.title}
                        onBlur={(e) =>
                          handleUpdateTitle(milestone.id, e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleUpdateTitle(
                              milestone.id,
                              e.currentTarget.value
                            );
                          }
                          if (e.key === "Escape") {
                            setEditingId(null);
                          }
                        }}
                        autoFocus
                        className="w-full bg-gray-700 text-white px-3 py-1 rounded border border-gold/50 focus:outline-none focus:border-gold font-inter"
                      />
                    ) : (
                      <h3 className="font-semibold text-white font-inter truncate">
                        {milestone.title}
                      </h3>
                    )}
                    {milestone.description && (
                      <p className="text-sm text-gray-400 mt-1 font-inter">
                        {milestone.description}
                      </p>
                    )}
                    {milestone.completedAt && (
                      <p className="text-xs text-green-400 mt-1 font-inter">
                        Completed:{" "}
                        {new Date(milestone.completedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Status Icon */}
                  <div className="shrink-0">
                    {getStatusIcon(milestone.status)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-700/50">
                  {getNextStatus(milestone.status) && (
                    <button
                      onClick={() =>
                        handleUpdateStatus(
                          milestone.id,
                          getNextStatus(milestone.status)!
                        )
                      }
                      disabled={isLoading}
                      className="px-3 py-1 bg-gold/20 text-gold text-sm rounded hover:bg-gold/30 transition-colors font-inter disabled:opacity-50"
                    >
                      → {getNextStatus(milestone.status)?.replace("_", " ")}
                    </button>
                  )}
                  <button
                    onClick={() => setEditingId(milestone.id)}
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                    title="Edit"
                  >
                    <PencilIcon className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(milestone.id)}
                    disabled={isLoading}
                    className="p-1 hover:bg-red-500/20 rounded transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    <TrashIcon className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Add New Milestone Form */}
          {isAdding && (
            <div className="p-4 rounded-lg border border-gold/30 bg-gold/5">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Milestone title..."
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-gold font-inter mb-2"
                autoFocus
              />
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Description (optional)..."
                rows={2}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-gold font-inter mb-3 resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddMilestone}
                  disabled={isLoading || !newTitle.trim()}
                  className="px-4 py-2 bg-gold text-gray-900 rounded font-semibold hover:bg-gold/90 transition-colors font-inter disabled:opacity-50"
                >
                  {isLoading ? "Adding..." : "Add Milestone"}
                </button>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setNewTitle("");
                    setNewDescription("");
                  }}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors font-inter"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 flex justify-between">
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-gray-900 rounded-lg font-semibold hover:bg-gold/90 transition-colors font-inter"
            >
              <PlusIcon className="w-5 h-5" />
              Add Milestone
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
