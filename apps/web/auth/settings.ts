"use server";

import { cookies } from "next/headers";

export interface ProjectSettings {
  ai_provider: string;
  model: string;
}

export interface ProjectSettingsResponse {
  ai_provider: string;
  model: string;
  is_configured: boolean;
}

const getToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
};

export const getProjectSettings = async (
  projectId: string,
): Promise<ProjectSettingsResponse> => {
  const token = await getToken();
  if (!token)
    return {
      ai_provider: "claude",
      model: "claude-sonnet-4-6",
      is_configured: false,
    };

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/settings`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    if (!res.ok)
      return {
        ai_provider: "claude",
        model: "claude-sonnet-4-6",
        is_configured: false,
      };

    const data = await res.json();
    return { ...data, is_configured: !!data.id };
  } catch {
    return {
      ai_provider: "claude",
      model: "claude-sonnet-4-6",
      is_configured: false,
    };
  }
};

export const deleteProjectSettings = async (
  projectId: string,
): Promise<boolean> => {
  const token = await getToken();
  if (!token) return false;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/settings`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return res.ok;
  } catch {
    return false;
  }
};

export const updateProjectSettings = async (
  projectId: string,
  data: ProjectSettings,
): Promise<boolean> => {
  const token = await getToken();
  if (!token) return false;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/settings`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      },
    );

    return res.ok;
  } catch {
    return false;
  }
};
