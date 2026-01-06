
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface SentimentHeatmapProps {
  data: Array<{
    name: string;
    value: number;
    sentiment: "positive" | "negative" | "neutral";
  }>;
}

export default function SentimentHeatmap({ data }: SentimentHeatmapProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-zinc-400">
        No tag data available
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            width={100}
            tick={{ fontSize: 12, fill: "#71717a" }}
          />
          <Tooltip 
            cursor={{ fill: "transparent" }}
            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.sentiment === "positive"
                    ? "#10b981" // Emerald-500
                    : entry.sentiment === "negative"
                    ? "#f43f5e" // Rose-500
                    : "#a1a1aa" // Zinc-400
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
