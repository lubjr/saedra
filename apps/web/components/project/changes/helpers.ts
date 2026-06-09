import type { ChangeEvent } from "../../../auth/documents";

export type Risk = "low" | "medium" | "high";

export const inferRisk = (assessment: string): Risk => {
  const lower = (assessment ?? "").toLowerCase();
  if (lower.includes("high")) return "high";
  if (lower.includes("medium")) return "medium";
  return "low";
};

export const RISK_CLASSES: Record<Risk, string> = {
  low: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  high: "bg-red-500/10 text-red-400 border-red-500/20",
};

export const RISK_DOT: Record<Risk, string> = {
  low: "bg-teal-400",
  medium: "bg-yellow-400",
  high: "bg-red-400",
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
