import type { ViolationRule } from "../../../auth/documents";

type Severity = ViolationRule["severity"];

export const SEVERITY_CLASSES: Record<Severity, string> = {
  high: "bg-red-500/10 text-red-400 border-red-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  low: "bg-teal-500/10 text-teal-400 border-teal-500/20",
};

export const SEVERITY_DOT: Record<Severity, string> = {
  high: "bg-red-400",
  medium: "bg-yellow-400",
  low: "bg-teal-400",
};

export const SEVERITY_LABEL: Record<Severity, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const SEVERITY_RANK: Record<Severity, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export const sortBySeverity = (rules: ViolationRule[]): ViolationRule[] => {
  return [...rules].sort((a, b) => {
    const bySeverity = SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity];
    if (bySeverity !== 0) return bySeverity;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
};
