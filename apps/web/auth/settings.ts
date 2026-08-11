"use server";

import { updateTag } from "next/cache";

import { apiRequest } from "./api-client";
import { cacheTags } from "./cache-tags";

export interface ProjectSettings {
  ai_provider: string;
  model: string;
}

export interface ProjectSettingsResponse {
  ai_provider: string;
  model: string;
  is_configured: boolean;
}

const UNCONFIGURED: ProjectSettingsResponse = {
  ai_provider: "claude",
  model: "claude-sonnet-4-6",
  is_configured: false,
};

export const getProjectSettings = async (
  projectId: string,
): Promise<ProjectSettingsResponse> => {
  const result = await apiRequest<ProjectSettings & { id?: string }>(
    `/projects/${projectId}/settings`,
    {
      tags: [cacheTags.projectSettings(projectId)],
    },
  );

  if (!result.ok) {
    return UNCONFIGURED;
  }

  return { ...result.data, is_configured: !!result.data.id };
};

export const deleteProjectSettings = async (
  projectId: string,
): Promise<boolean> => {
  const result = await apiRequest(`/projects/${projectId}/settings`, {
    method: "DELETE",
  });

  if (result.ok) {
    updateTag(cacheTags.projectSettings(projectId));
  }

  return result.ok;
};

export const updateProjectSettings = async (
  projectId: string,
  data: ProjectSettings,
): Promise<boolean> => {
  const result = await apiRequest(`/projects/${projectId}/settings`, {
    method: "PUT",
    body: data,
  });

  if (result.ok) {
    updateTag(cacheTags.projectSettings(projectId));
  }

  return result.ok;
};
