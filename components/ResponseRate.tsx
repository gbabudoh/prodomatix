
"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface ResponseRateProps {
  responded: number;
  totalNegative: number;
}

export default function ResponseRate({ responded, totalNegative }: ResponseRateProps) {
  const percentage = totalNegative === 0 ? 100 : Math.round((responded / totalNegative) * 100);
  
  const data = [
    { name: "Responded", value: responded, color: "#10b981" }, // Emerald
    { name: "Unanswered", value: totalNegative - responded, color: "#f43f5e" }, // Rose
  ];

  return (
    <div className="relative h-64 w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center Label */}
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{percentage}%</span>
        <span className="text-xs font-medium uppercase text-zinc-500">Response Rate</span>
      </div>
    </div>
  );
}
