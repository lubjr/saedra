import * as React from "react";

import type { ChangeEvent } from "../../../auth/documents";
import { formatRelativeDate } from "../decisions/helpers";
import { countFilesTouched, inferRisk } from "./helpers";

type Tone = "default" | "accent" | "danger";

const TONE_CLASS: Record<Tone, string> = {
  default: "text-zinc-100",
  accent: "text-teal-400",
  danger: "text-red-400",
};

interface TileProps {
  label: string;
  value: React.ReactNode;
  sub: string;
  tone?: Tone;
}

const Tile = ({ label, value, sub, tone = "default" }: TileProps) => {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 flex flex-col gap-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </p>
      <p className={`text-3xl font-mono font-semibold ${TONE_CLASS[tone]}`}>
        {value}
      </p>
      <p className="text-[11px] font-mono text-zinc-500">{sub}</p>
    </div>
  );
};

interface Props {
  changes: ChangeEvent[];
}

export const ChangesKpiStrip = ({ changes }: Props) => {
  const highRiskCount = changes.filter((c) => {
    return inferRisk(c.risk_assessment) === "high";
  }).length;

  const filesTouched = countFilesTouched(changes);

  const newest = changes.reduce<ChangeEvent | null>((acc, c) => {
    if (!acc) return c;
    return new Date(c.created_at) > new Date(acc.created_at) ? c : acc;
  }, null);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <Tile label="Total logged" value={changes.length} sub="change events" />
      <Tile
        label="High risk"
        value={highRiskCount}
        sub={highRiskCount > 0 ? "need review" : "all clear"}
        tone={highRiskCount > 0 ? "danger" : "default"}
      />
      <Tile
        label="Files touched"
        value={filesTouched}
        sub="across changes"
        tone="accent"
      />
      <Tile
        label="Last logged"
        value={newest ? formatRelativeDate(newest.created_at) : "-"}
        sub="most recent"
      />
    </div>
  );
};
