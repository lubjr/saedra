"use server";

import { cookies } from "next/headers";

export const generateDiagram = async ({
  projectId,
  credentialId,
}: {
  projectId: string;
  credentialId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): Promise<{ data: any } | { error: string } | undefined> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return { error: "Unauthorized" };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/diagram`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ credentialId }),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    return { error: data.error || "Failed to generate diagram" };
  }

  return { data };
};
