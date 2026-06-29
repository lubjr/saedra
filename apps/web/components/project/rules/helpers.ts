import type { ViolationRule } from "../../../auth/documents";

type Severity = ViolationRule["severity"];

export const SEVERITY_CLASSES: Record<Severity, string> = {
  high: "bg-status-error-fill text-status-error border-status-error-stroke",
  medium:
    "bg-status-warning-fill text-status-warning border-status-warning-stroke",
  low: "bg-brand-fill text-brand border-brand-stroke",
};

export const SEVERITY_DOT: Record<Severity, string> = {
  high: "bg-status-error",
  medium: "bg-status-warning",
  low: "bg-brand",
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
