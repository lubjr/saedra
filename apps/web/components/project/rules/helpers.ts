import type { ViolationRule } from "../../../auth/documents";
import { TIER_CLASSES, TIER_DOT } from "../decisions/helpers";

type Severity = ViolationRule["severity"];

export const SEVERITY_CLASSES: Record<Severity, string> = TIER_CLASSES;
export const SEVERITY_DOT: Record<Severity, string> = TIER_DOT;

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
