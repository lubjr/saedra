export interface ArchitectureState {
  version: string;
  summary: string;
  core_principles: string[];
  critical_paths: string[];
  constraints: string[];
  active_decisions: string[];
}

export interface Decision {
  id: string;
  title: string;
  status: "active" | "deprecated" | "superseded";
  context: string;
  decision: string;
  impact: string[];
  affects: string[];
  constraints_introduced: string[];
  supersedes: string | null;
  risk_level: "low" | "medium" | "high";
  created_at: string;
}

export interface ChangeEvent {
  id: string;
  summary: string;
  related_decisions: string[];
  files_changed: string[];
  architectural_impact: string;
  risk_assessment: string;
  created_at: string;
}

export interface ViolationRule {
  id: string;
  description: string;
  severity: "low" | "medium" | "high";
  related_decision: string | null;
  created_at: string;
}

export type DocumentType = "doc" | "architecture" | "decision" | "change" | "rule";
