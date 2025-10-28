"use server";

import { cookies } from "next/headers";

export const getUser = async (): Promise<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { user: any } | undefined
> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const userId = cookieStore.get("user_id")?.value;

  if (!token || !userId) {
    return undefined;
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/projects/profile/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await res.json();

  if (!res.ok) {
    return undefined;
  }

  return data;
};
