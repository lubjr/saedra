import * as React from "react";

import type { Decision } from "../../../auth/documents";
import { formatRelativeDate } from "./helpers";

interface TileProps {
  label: string;
  value: React.ReactNode;
  sub: string;
  accent?: boolean;
}

const Tile = ({ label, value, sub, accent }: TileProps) => {
  return (
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p
        className={`text-3xl font-mono font-semibold ${accent ? "text-brand" : "text-foreground"}`}
      >
        {value}
      </p>
      <p className="text-[11px] font-mono text-muted-foreground">{sub}</p>
    </div>
  );
};

interface Props {
  decisions: Decision[];
}

export const DecisionsKpiStrip = ({ decisions }: Props) => {
  const activeCount = decisions.filter((d) => {
    return d.status === "active";
  }).length;

  const highRiskCount = decisions.filter((d) => {
    return d.risk_level === "high";
  }).length;

  const newest = decisions.reduce<Decision | null>((acc, d) => {
    if (!acc) return d;
    return new Date(d.created_at) > new Date(acc.created_at) ? d : acc;
  }, null);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <Tile label="Total" value={decisions.length} sub="recorded" />
      <Tile label="Active" value={activeCount} sub="in effect" accent />
      <Tile
        label="High risk"
        value={highRiskCount}
        sub={highRiskCount > 0 ? "need review" : "all clear"}
      />
      <Tile
        label="Last recorded"
        value={newest ? formatRelativeDate(newest.created_at) : "—"}
        sub="most recent"
      />
    </div>
  );
};
