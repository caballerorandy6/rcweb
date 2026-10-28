"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SearchDailyPoint } from "@/actions/stats/getSearchPerformanceAction";

export default function SearchPerformanceChart({ data }: { data: SearchDailyPoint[] }) {
  return (
    <div className="h-56 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSearchClicks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorSearchImpressions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="label"
            stroke="#6B7280"
            fontSize={11}
            fontFamily="var(--next-font-inter)"
            tickLine={false}
            axisLine={false}
            minTickGap={24}
          />
          <YAxis
            yAxisId="clicks"
            stroke="#6B7280"
            fontSize={11}
            fontFamily="var(--next-font-inter)"
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <YAxis
            yAxisId="impressions"
            orientation="right"
            stroke="#6B7280"
            fontSize={11}
            fontFamily="var(--next-font-inter)"
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              fontSize: "12px",
              fontFamily: "var(--next-font-inter)",
            }}
            labelStyle={{ color: "#9CA3AF", fontFamily: "var(--next-font-inter)" }}
          />
          <Legend
            wrapperStyle={{
              fontSize: "12px",
              paddingTop: "10px",
              fontFamily: "var(--next-font-inter)",
            }}
          />
          <Area
            yAxisId="impressions"
            type="monotone"
            dataKey="impressions"
            name="Impressions"
            stroke="#3B82F6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorSearchImpressions)"
          />
          <Area
            yAxisId="clicks"
            type="monotone"
            dataKey="clicks"
            name="Clicks"
            stroke="#D4AF37"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorSearchClicks)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
