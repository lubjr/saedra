import * as React from "react";

import type {
  ChangeEvent,
  Decision,
  ViolationRule,
} from "../../../auth/documents";
import type { ProjectSummary } from "../../../auth/projects";
import { inferRisk } from "../changes/helpers";

type Tone = "default" | "brand" | "warning" | "error";

const TONE_CLASS: Record<Tone, string> = {
  default: "text-foreground",
  brand: "text-brand",
  warning: "text-status-warning",
  error: "text-status-error",
};

const healthTone = (score: number): Tone => {
  if (score >= 85) return "brand";
  if (score >= 70) return "warning";
  return "error";
};

interface TileProps {
  label: string;
  value: React.ReactNode;
  sub: string;
  tone?: Tone;
  subTone?: Tone;
}

const Tile = ({ label, value, sub, tone = "default", subTone }: TileProps) => {
  return (
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className={`text-3xl font-mono font-semibold ${TONE_CLASS[tone]}`}>
        {value}
      </p>
      <p
        className={`text-[11px] font-mono ${subTone ? TONE_CLASS[subTone] : "text-muted-foreground"}`}
      >
        {sub}
      </p>
    </div>
  );
};

interface Props {
  summary: ProjectSummary | null;
  decisions: Decision[];
  changes: ChangeEvent[];
  rules: ViolationRule[];
}

export const MemoryKpiStrip = ({
  summary,
  decisions,
  changes,
  rules,
}: Props) => {
  const health = summary?.health ?? null;
  const healthDelta = summary?.health_delta ?? 0;

  const activeDecisions = decisions.filter((d) => {
    return d.status === "active";
  }).length;

  const highRiskChanges = changes.filter((c) => {
    return inferRisk(c.risk_assessment) === "high";
  }).length;

  const highSeverityRules = rules.filter((r) => {
    return r.severity === "high";
  }).length;

  const highRiskDecisions = decisions.filter((d) => {
    return d.risk_level === "high";
  }).length;

  const needsAttention =
    highRiskDecisions + highRiskChanges + highSeverityRules;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      <Tile
        label="Health"
        value={health ?? "—"}
        tone={health !== null ? healthTone(health) : "default"}
        sub={
          health === null
            ? "no data yet"
            : `${healthDelta > 0 ? "+" : ""}${healthDelta} this week`
        }
      />
      <Tile
        label="Decisions"
        value={decisions.length}
        sub={`${activeDecisions} active`}
      />
      <Tile
        label="Changes"
        value={changes.length}
        sub={`${highRiskChanges} high risk`}
        subTone={highRiskChanges > 0 ? "warning" : undefined}
      />
      <Tile
        label="Rules"
        value={rules.length}
        sub={`${highSeverityRules} high severity`}
        subTone={highSeverityRules > 0 ? "warning" : undefined}
      />
      <Tile
        label="Needs attention"
        value={needsAttention}
        tone={needsAttention > 0 ? "error" : "brand"}
        sub="across memory"
      />
    </div>
  );
};
