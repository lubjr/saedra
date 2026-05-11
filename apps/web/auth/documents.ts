"use server";

import { cookies } from "next/headers";

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

type DocumentType = "architecture" | "decision" | "change" | "rule";

interface RawDocument {
  id: string;
  name: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const fetchDocuments = async (
  projectId: string,
  type: DocumentType,
): Promise<RawDocument[]> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) return [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/documents?type=${type}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const parseContent = <T>(raw: string): T | null => {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const getArchitectureState = async (
  projectId: string,
): Promise<ArchitectureState | null> => {
  const docs = await fetchDocuments(projectId, "architecture");
  const doc = docs[0];
  if (!doc) return null;
  return parseContent<ArchitectureState>(doc.content);
};

export const getDecisions = async (projectId: string): Promise<Decision[]> => {
  const docs = await fetchDocuments(projectId, "decision");
  return docs
    .map((d) => {
      return parseContent<Decision>(d.content);
    })
    .filter((d): d is Decision => {
      return d !== null;
    });
};

export const getViolationRules = async (
  projectId: string,
): Promise<ViolationRule[]> => {
  const docs = await fetchDocuments(projectId, "rule");
  return docs
    .map((d) => {
      return parseContent<ViolationRule>(d.content);
    })
    .filter((r): r is ViolationRule => {
      return r !== null;
    });
};

export const getRecentChanges = async (
  projectId: string,
  limit = 10,
): Promise<ChangeEvent[]> => {
  const docs = await fetchDocuments(projectId, "change");
  return docs
    .slice(0, limit)
    .map((d) => {
      return parseContent<ChangeEvent>(d.content);
    })
    .filter((c): c is ChangeEvent => {
      return c !== null;
    });
};
