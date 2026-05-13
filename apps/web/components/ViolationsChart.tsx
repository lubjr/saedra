"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DataPoint {
  date: string;
  violations: number;
  warnings: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs space-y-1">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((entry) => {
        return (
          <p key={entry.name} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        );
      })}
    </div>
  );
};

export const ViolationsChart = ({ data }: { data: DataPoint[] }) => {
  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No review data yet. Run{" "}
        <code className="text-teal-400 font-mono text-xs bg-teal-500/10 px-1.5 py-0.5 rounded">
          saedra review
        </code>{" "}
        to generate metrics.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barGap={2}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#3f3f46"
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tick={{ fill: "#71717a", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: "#71717a", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={24}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#27272a" }} />
        <Bar
          dataKey="violations"
          name="Violations"
          fill="#f87171"
          radius={[3, 3, 0, 0]}
        />
        <Bar
          dataKey="warnings"
          name="Warnings"
          fill="#fbbf24"
          radius={[3, 3, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
