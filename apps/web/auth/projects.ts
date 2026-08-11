"use server";

import { updateTag } from "next/cache";

import {
  apiRequest,
  getAuthToken,
  getSession,
  rethrowTransportError,
} from "./api-client";
import { cacheTags } from "./cache-tags";

export interface ProjectSummary {
  id: string;
  name: string;
  created_at: string;
  has_memory: boolean;
  health: number | null;
  health_delta: number;
  decisions_count: number;
  reviews_count: number;
  last_activity_at: string | null;
  last_review_at: string | null;
  last_review_warnings: number;
  last_review_violations: number;
  last_review_branch: string | null;
  status: "active" | "setup" | "archived";
  health_history: number[];
}

export const getProjects = async (): Promise<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { projects: any } | undefined
> => {
  const session = await getSession();

  if (!session) {
    return undefined;
  }

  const result = await apiRequest<unknown>(`/projects/user/${session.userId}`, {
    token: session.token,
    tags: [cacheTags.projects()],
  });

  if (!result.ok) {
    rethrowTransportError(result);
    return undefined;
  }

  return { projects: result.data };
};

export const createProject = async ({
  name,
}: {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): Promise<{ data: any } | { error: string; code?: string }> => {
  const session = await getSession();

  if (!session) {
    return { error: "Not authenticated" };
  }

  const result = await apiRequest<unknown>("/projects/create", {
    method: "POST",
    token: session.token,
    body: { name, userId: session.userId },
    fallbackError: "Failed to create project",
  });

  if (!result.ok) {
    rethrowTransportError(result);
    return { error: result.error, code: result.code };
  }

  updateTag(cacheTags.projects());

  return { data: result.data };
};

export const deleteProject = async ({
  projectId,
}: {
  projectId: string;
}): Promise<{ sucess: boolean } | undefined> => {
  const token = await getAuthToken();

  if (!token) {
    return undefined;
  }

  const result = await apiRequest(`/projects/${projectId}`, {
    method: "DELETE",
    token,
  });

  if (!result.ok) {
    rethrowTransportError(result);
    return { sucess: false };
  }

  updateTag(cacheTags.projects());

  return { sucess: true };
};

export const getProjectSummaries = async (): Promise<ProjectSummary[]> => {
  const session = await getSession();

  if (!session) {
    return [];
  }

  const result = await apiRequest<ProjectSummary[]>(
    `/projects/summaries/user/${session.userId}`,
    {
      token: session.token,
      tags: [cacheTags.projects()],
    },
  );

  return result.ok ? result.data : [];
};

export const getProjectSummary = async (
  projectId: string,
): Promise<ProjectSummary | null> => {
  const summaries = await getProjectSummaries();
  return (
    summaries.find((s) => {
      return s.id === projectId;
    }) ?? null
  );
};
