"use server";

import { cookies } from "next/headers";

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

const getToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
};

export const getProjectReviews = async (
  projectId: string,
): Promise<ReviewSummary[]> => {
  const token = await getToken();
  if (!token) return [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/reviews`,
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

export const getProjectReview = async (
  projectId: string,
  reviewId: string,
): Promise<ReviewDetail | null> => {
  const token = await getToken();
  if (!token) return null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/reviews/${reviewId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    if (!res.ok) return null;

    return await res.json();
  } catch {
    return null;
  }
};
