import * as React from "react";

import type { ViolationRule } from "../../../auth/documents";
import { formatRelativeDate } from "../decisions/helpers";

interface TileProps {
  label: string;
  value: React.ReactNode;
  sub: string;
  accent?: string;
}

const Tile = ({ label, value, sub, accent }: TileProps) => {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 flex flex-col gap-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </p>
      <p
        className={`text-3xl font-mono font-semibold ${accent ?? "text-zinc-100"}`}
      >
        {value}
      </p>
      <p className="text-[11px] font-mono text-zinc-500">{sub}</p>
    </div>
  );
};

interface Props {
  rules: ViolationRule[];
}

export const RulesKpiStrip = ({ rules }: Props) => {
  const highCount = rules.filter((r) => {
    return r.severity === "high";
  }).length;

  const linkedCount = rules.filter((r) => {
    return r.related_decision !== null;
  }).length;

  const newest = rules.reduce<ViolationRule | null>((acc, r) => {
    if (!acc) return r;
    return new Date(r.created_at) > new Date(acc.created_at) ? r : acc;
  }, null);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <Tile label="Total rules" value={rules.length} sub="enforced" />
      <Tile
        label="High severity"
        value={highCount}
        sub={highCount > 0 ? "blocking" : "all clear"}
        accent={highCount > 0 ? "text-red-400" : undefined}
      />
      <Tile
        label="Linked to decision"
        value={linkedCount}
        sub={`of ${rules.length} traced`}
        accent="text-teal-400"
      />
      <Tile
        label="Last added"
        value={newest ? formatRelativeDate(newest.created_at) : "—"}
        sub="most recent"
      />
    </div>
  );
};
