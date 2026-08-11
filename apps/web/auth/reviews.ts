"use server";

import { apiRequest } from "./api-client";
import { cacheTags } from "./cache-tags";

export interface ReviewSummary {
  id: string;
  project_id: string;
  branch: string;
  base: string | null;
  total_files: number;
  violations: number;
  warnings: number;
  ok: number;
  created_at: string;
}

export interface FileResult {
  file: string;
  status: "violation" | "warning" | "ok";
  violations: Array<{ rule_id: string; detail: string }>;
  note: string;
}

export interface ReviewDetail extends ReviewSummary {
  files: FileResult[];
}

export const getProjectReviews = async (
  projectId: string,
): Promise<ReviewSummary[]> => {
  const result = await apiRequest<ReviewSummary[]>(
    `/projects/${projectId}/reviews`,
    {
      tags: [cacheTags.projectReviews(projectId)],
    },
  );

  if (!result.ok) {
    return [];
  }

  return Array.isArray(result.data) ? result.data : [];
};

export const getProjectReview = async (
  projectId: string,
  reviewId: string,
): Promise<ReviewDetail | null> => {
  const result = await apiRequest<ReviewDetail>(
    `/projects/${projectId}/reviews/${reviewId}`,
    {
      tags: [cacheTags.projectReview(projectId, reviewId)],
    },
  );

  return result.ok ? result.data : null;
};
