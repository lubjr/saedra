"use server";

import { apiRequest, getAuthToken, rethrowTransportError } from "./api-client";

export const generateDiagram = async ({
  projectId,
  credentialId,
}: {
  projectId: string;
  credentialId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): Promise<{ data: any } | { error: string } | undefined> => {
  const token = await getAuthToken();

  if (!token) {
    return { error: "Unauthorized" };
  }

  const result = await apiRequest<unknown>(`/projects/${projectId}/diagram`, {
    method: "POST",
    token,
    body: { credentialId },
    fallbackError: "Failed to generate diagram",
  });

  if (!result.ok) {
    rethrowTransportError(result);
    return { error: result.error };
  }

  return { data: result.data };
};
