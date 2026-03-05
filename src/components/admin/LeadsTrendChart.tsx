"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import type { LeadsTrendResult } from "@/actions/stats/getLeadsTrendAction";

interface LeadsTrendChartProps {
  initialData: LeadsTrendResult;
  fetchData: (period: "7d" | "30d" | "90d") => Promise<LeadsTrendResult>;
}

const periodLabels = {
  "7d": "Last 7 Days",
  "30d": "Last 30 Days",
  "90d": "Last 90 Days",
};

export default function LeadsTrendChart({
  initialData,
  fetchData,
}: LeadsTrendChartProps) {
  const [data, setData] = useState<LeadsTrendResult>(initialData);
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">(initialData.period);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (period !== data.period) {
      setIsLoading(true);
      fetchData(period)
        .then(setData)
        .finally(() => setIsLoading(false));
    }
  }, [period, data.period, fetchData]);

  return (
    <div className="bg-gray-800/80 rounded-xl p-4 sm:p-6 border border-gray-700/50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gold flex-shrink-0" />
          <h2 className="text-xl sm:text-2xl font-bold text-white font-iceland">
            Lead Trends
          </h2>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2">
          {(["7d", "30d", "90d"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              disabled={isLoading}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all font-inter ${
                period === p
                  ? "bg-gold text-gray-900"
                  : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
              } disabled:opacity-50`}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gray-700/30 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-400 font-inter">Total Leads</p>
          <p className="text-xl sm:text-2xl font-bold text-white font-iceland">
            {data.totalLeads}
          </p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-400 font-inter">Conversions</p>
          <p className="text-xl sm:text-2xl font-bold text-green-400 font-iceland">
            {data.totalConversions}
          </p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-400 font-inter">Conv. Rate</p>
          <p className="text-xl sm:text-2xl font-bold text-gold font-iceland">
            {data.conversionRate}%
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className={`h-64 sm:h-80 ${isLoading ? "opacity-50" : ""}`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data.data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="label"
              stroke="#6B7280"
              fontSize={11}
              fontFamily="var(--font-inter)"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6B7280"
              fontSize={11}
              fontFamily="var(--font-inter)"
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                fontSize: "12px",
                fontFamily: "var(--font-inter)",
              }}
              labelStyle={{ color: "#9CA3AF", fontFamily: "var(--font-inter)" }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "10px", fontFamily: "var(--font-inter)" }}
            />
            <Area
              type="monotone"
              dataKey="leads"
              name="New Leads"
              stroke="#3B82F6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorLeads)"
            />
            <Area
              type="monotone"
              dataKey="conversions"
              name="Conversions"
              stroke="#22C55E"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorConversions)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
