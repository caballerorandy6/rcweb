"use client";

import { useState, useTransition } from "react";
import {
  getSmsDeliveryStatsAction,
  type SmsDeliveryStats,
} from "@/actions/campaigns/getSmsDeliveryStatsAction";
import { deleteFailedPhonesAction } from "@/actions/contacts/deleteFailedPhonesAction";
import { toast } from "sonner";

export default function SmsDeliveryStats() {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [stats, setStats] = useState<SmsDeliveryStats | null>(null);
  const [hoursAgo, setHoursAgo] = useState(24);
  const [selectedPhones, setSelectedPhones] = useState<Set<string>>(new Set());
  const [selectedErrorCode, setSelectedErrorCode] = useState<string>("all");

  const fetchStats = async () => {
    setIsLoading(true);
    startTransition(async () => {
      try {
        const result = await getSmsDeliveryStatsAction(hoursAgo);

        if (result.success && result.data) {
          setStats(result.data);
          toast.success("Delivery stats loaded");
        } else if (!result.success) {
          toast.error(result.error || "Failed to load stats");
        }
      } catch (error) {
        toast.error("Error loading delivery stats");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    });
  };

  const handleToggleSelect = (phone: string) => {
    const newSelected = new Set(selectedPhones);
    if (newSelected.has(phone)) {
      newSelected.delete(phone);
    } else {
      newSelected.add(phone);
    }
    setSelectedPhones(newSelected);
  };

  const handleSelectAll = () => {
    if (!stats) return;

    const filteredMessages =
      selectedErrorCode === "all"
        ? stats.failedMessages
        : stats.failedMessages.filter(
            (m) => m.errorCode?.toString() === selectedErrorCode
          );

    if (selectedPhones.size === filteredMessages.length) {
      setSelectedPhones(new Set());
    } else {
      setSelectedPhones(new Set(filteredMessages.map((m) => m.to)));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedPhones.size === 0) {
      toast.error("No phone numbers selected");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedPhones.size} phone number(s) from your database? This action cannot be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    startTransition(async () => {
      try {
        const result = await deleteFailedPhonesAction(
          Array.from(selectedPhones)
        );

        if (result.success && result.data) {
          toast.success(`Deleted ${result.data.deletedCount} phone number(s)`);
          setSelectedPhones(new Set());
          // Refresh stats
          await fetchStats();
        } else if (!result.success) {
          toast.error(result.error || "Failed to delete phones");
        }
      } catch (error) {
        toast.error("Error deleting phone numbers");
        console.error(error);
      } finally {
        setIsDeleting(false);
      }
    });
  };

  return (
    <div className="space-y-6 font-inter">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gold font-iceland">
          SMS Delivery Report
        </h2>
        <p className="text-gray-400 mt-2">
          Check delivery status and manage failed phone numbers
        </p>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-300 mb-2">
              Time Range
            </label>
            <select
              value={hoursAgo}
              onChange={(e) => setHoursAgo(parseInt(e.target.value))}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-gold focus:outline-none"
            >
              <option value={1}>Last 1 hour</option>
              <option value={6}>Last 6 hours</option>
              <option value={24}>Last 24 hours</option>
              <option value={72}>Last 3 days</option>
              <option value={168}>Last 7 days</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchStats}
              disabled={isPending || isLoading}
              className="px-6 py-3 bg-gold text-gray-900 rounded-lg font-semibold hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Loading..." : "Get Report"}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-gold">
              <div className="text-gray-400 text-sm mb-1">Total</div>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
            </div>

            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
              <div className="text-green-400 text-sm mb-1">✅ Delivered</div>
              <div className="text-2xl font-bold text-green-400">
                {stats.delivered}
              </div>
              <div className="text-xs text-green-400/70 mt-1">
                {stats.deliveryRate.toFixed(1)}%
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <div className="text-blue-400 text-sm mb-1">📤 Sent</div>
              <div className="text-2xl font-bold text-blue-400">
                {stats.sent}
              </div>
            </div>

            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <div className="text-red-400 text-sm mb-1">❌ Failed</div>
              <div className="text-2xl font-bold text-red-400">
                {stats.failed}
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="text-yellow-400 text-sm mb-1">⚠️ Undelivered</div>
              <div className="text-2xl font-bold text-yellow-400">
                {stats.undelivered}
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-xs mb-1">⏳ Queued</div>
              <div className="text-xl font-bold text-gray-300">
                {stats.queued}
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-xs mb-1">✓ Accepted</div>
              <div className="text-xl font-bold text-gray-300">
                {stats.accepted}
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-xs mb-1">📡 Sending</div>
              <div className="text-xl font-bold text-gray-300">
                {stats.sending}
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-xs mb-1">📥 Receiving</div>
              <div className="text-xl font-bold text-gray-300">
                {stats.receiving}
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-xs mb-1">✉️ Received</div>
              <div className="text-xl font-bold text-gray-300">
                {stats.received}
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-xs mb-1">🚫 Canceled</div>
              <div className="text-xl font-bold text-gray-300">
                {stats.canceled}
              </div>
            </div>
          </div>

          {/* Error Codes Summary */}
          {Object.keys(stats.errorCodes).length > 0 && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                📊 Error Codes Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.entries(stats.errorCodes)
                  .sort((a, b) => b[1] - a[1])
                  .map(([code, count]) => (
                    <div
                      key={code}
                      className="bg-gray-700/50 rounded-lg p-3 text-center"
                    >
                      <div className="text-red-400 font-mono text-sm">
                        Code {code}
                      </div>
                      <div className="text-white font-bold text-xl mt-1">
                        {count}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Failed Messages Table */}
          {stats.failedMessages.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-6 space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Failed & Undelivered Messages
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {selectedPhones.size} of{" "}
                    {selectedErrorCode === "all"
                      ? stats.failedMessages.length
                      : stats.failedMessages.filter(
                          (m) => m.errorCode?.toString() === selectedErrorCode
                        ).length}{" "}
                    selected
                  </p>
                </div>

                {/* Error Code Filter */}
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-400">
                    Filter by Error:
                  </label>
                  <select
                    value={selectedErrorCode}
                    onChange={(e) => {
                      setSelectedErrorCode(e.target.value);
                      setSelectedPhones(new Set());
                    }}
                    className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-gold focus:outline-none text-sm"
                  >
                    <option value="all">All Errors</option>
                    {Object.keys(stats.errorCodes)
                      .sort((a, b) => parseInt(a) - parseInt(b))
                      .map((code) => (
                        <option key={code} value={code}>
                          Error {code} ({stats.errorCodes[parseInt(code)]})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-3">
                  <button
                    onClick={handleSelectAll}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    {selectedPhones.size === stats.failedMessages.length
                      ? "Deselect All"
                      : "Select All"}
                  </button>

                  <button
                    onClick={handleDeleteSelected}
                    disabled={selectedPhones.size === 0 || isDeleting}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting
                      ? "Deleting..."
                      : `Delete ${selectedPhones.size} Selected`}
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-700 text-left">
                      <th className="px-4 py-3 text-sm font-medium text-gray-300">
                        <input
                          type="checkbox"
                          checked={
                            selectedPhones.size ===
                              stats.failedMessages.length &&
                            stats.failedMessages.length > 0
                          }
                          onChange={handleSelectAll}
                          className="cursor-pointer"
                        />
                      </th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-300">
                        Phone Number
                      </th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-300">
                        Status
                      </th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-300">
                        Error Code
                      </th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-300">
                        Error Message
                      </th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-300">
                        Date Sent
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {(selectedErrorCode === "all"
                      ? stats.failedMessages
                      : stats.failedMessages.filter(
                          (m) => m.errorCode?.toString() === selectedErrorCode
                        )
                    ).map((msg) => (
                      <tr
                        key={msg.sid}
                        className={`hover:bg-gray-750 ${
                          selectedPhones.has(msg.to) ? "bg-gray-750" : ""
                        }`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedPhones.has(msg.to)}
                            onChange={() => handleToggleSelect(msg.to)}
                            className="cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-3 text-white font-mono text-sm">
                          {msg.to}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              msg.status === "failed"
                                ? "bg-red-900/50 text-red-400"
                                : "bg-yellow-900/50 text-yellow-400"
                            }`}
                          >
                            {msg.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-300 text-sm">
                          {msg.errorCode || "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-sm max-w-xs truncate">
                          {msg.errorMessage || "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-sm">
                          {new Date(msg.dateSent).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Warning */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="flex gap-2">
                  <span className="text-red-500 text-lg">⚠️</span>
                  <div className="text-sm text-red-200">
                    <p className="font-semibold mb-1">Warning:</p>
                    <p>
                      Deleting phone numbers will permanently remove them from
                      your database. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {stats.failedMessages.length === 0 && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 text-center">
              <div className="text-green-400 text-4xl mb-2">✅</div>
              <div className="text-green-400 font-semibold">
                All messages delivered successfully!
              </div>
              <div className="text-green-400/70 text-sm mt-1">
                No failed or undelivered messages in this time range.
              </div>
            </div>
          )}
        </>
      )}

      {!stats && !isLoading && (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <div className="text-gray-400 text-lg mb-2">📊</div>
          <div className="text-gray-400">
            Click "Get Report" to view SMS delivery statistics
          </div>
        </div>
      )}
    </div>
  );
}
