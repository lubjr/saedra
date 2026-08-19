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
