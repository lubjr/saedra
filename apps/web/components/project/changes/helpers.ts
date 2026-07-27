import type { ChangeEvent } from "../../../auth/documents";
import { type Tier, TIER_CLASSES, TIER_DOT } from "../decisions/helpers";

export type Risk = Tier;

export const inferRisk = (assessment: string): Risk => {
  const lower = (assessment ?? "").toLowerCase();
  if (lower.includes("high")) return "high";
  if (lower.includes("medium")) return "medium";
  return "low";
};

export const RISK_CLASSES = TIER_CLASSES;
export const RISK_DOT = TIER_DOT;

export const countFilesTouched = (changes: ChangeEvent[]): number => {
  const set = new Set<string>();
  for (const c of changes) {
    for (const f of c.files_changed) {
      set.add(f);
    }
  }
  return set.size;
};
