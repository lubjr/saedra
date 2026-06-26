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
    <div className="bg-muted border border-border-emphasis rounded-lg px-3 py-2 text-xs space-y-1">
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
        <code className="text-brand font-mono text-xs bg-brand-fill px-1.5 py-0.5 rounded">
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
          stroke="var(--border-emphasis)"
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={24}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "var(--muted)" }}
        />
        <Bar
          dataKey="violations"
          name="Violations"
          fill="var(--status-error)"
          radius={[3, 3, 0, 0]}
        />
        <Bar
          dataKey="warnings"
          name="Warnings"
          fill="var(--status-warning)"
          radius={[3, 3, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
