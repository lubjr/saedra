"use server";

import { updateTag } from "next/cache";

import { apiRequest, getSession, rethrowTransportError } from "./api-client";
import { cacheTags } from "./cache-tags";

export const getUser = async (): Promise<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { user: any } | undefined
> => {
  const session = await getSession();

  if (!session) {
    return undefined;
  }

  const result = await apiRequest<{ user: unknown }>(
    `/projects/profile/${session.userId}`,
    {
      token: session.token,
      tags: [cacheTags.user()],
    },
  );

  if (!result.ok) {
    rethrowTransportError(result);
    return undefined;
  }

  return result.data;
};

export const updateUserProfile = async (
  username: string,
  avatar_url: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ user: any } | { error: string }> => {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const result = await apiRequest<{ user: unknown }>(
    `/projects/profile/${session.userId}`,
    {
      method: "PUT",
      token: session.token,
      body: { username, avatar_url },
      fallbackError: "Failed to update profile",
    },
  );

  if (!result.ok) {
    throw new Error(result.error);
  }

  updateTag(cacheTags.user());

  return result.data;
};
