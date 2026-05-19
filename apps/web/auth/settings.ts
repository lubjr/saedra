"use server";

import { cookies } from "next/headers";

export interface ProjectSettings {
  ai_provider: string;
  model: string;
}

const getToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
};

export const getProjectSettings = async (
  projectId: string,
): Promise<ProjectSettings> => {
  const token = await getToken();
  if (!token) return { ai_provider: "claude", model: "claude-sonnet-4-6" };

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/settings`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    if (!res.ok) return { ai_provider: "claude", model: "claude-sonnet-4-6" };

    return await res.json();
  } catch {
    return { ai_provider: "claude", model: "claude-sonnet-4-6" };
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
