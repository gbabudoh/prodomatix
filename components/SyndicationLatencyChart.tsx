
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  date: string;
  latencyMs: number;
}

export default function SyndicationLatencyChart({ data }: { data: DataPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-zinc-400">
        No latency data
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: "#71717a" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: "#71717a" }}
            tickLine={false}
            axisLine={false}
            label={{ value: 'ms', angle: -90, position: 'insideLeft', fill: '#a1a1aa', fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
            cursor={{ stroke: "#6366f1", strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="latencyMs"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
