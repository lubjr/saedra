import type { ChangeEvent } from "../../../auth/documents";

export type Risk = "low" | "medium" | "high";

export const inferRisk = (assessment: string): Risk => {
  const lower = (assessment ?? "").toLowerCase();
  if (lower.includes("high")) return "high";
  if (lower.includes("medium")) return "medium";
  return "low";
};

export const RISK_CLASSES: Record<Risk, string> = {
  low: "bg-brand-fill text-brand border-brand-stroke",
  medium:
    "bg-status-warning-fill text-status-warning border-status-warning-stroke",
  high: "bg-status-error-fill text-status-error border-status-error-stroke",
};

export const RISK_DOT: Record<Risk, string> = {
  low: "bg-brand",
  medium: "bg-status-warning",
  high: "bg-status-error",
};

export const countFilesTouched = (changes: ChangeEvent[]): number => {
  const set = new Set<string>();
  for (const c of changes) {
    for (const f of c.files_changed) {
      set.add(f);
    }
  }
  return set.size;
};
