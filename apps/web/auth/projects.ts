"use server";

import { cookies } from "next/headers";

export const getProjects = async (): Promise<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { projects: any } | undefined
> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const userId = cookieStore.get("user_id")?.value;

  if (!token || !userId) {
    return undefined;
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/projects/user/${userId}`,
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

  return { projects: data };
};

export const createProject = async ({
  name,
}: {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): Promise<{ data: any } | undefined> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const userId = cookieStore.get("user_id")?.value;

  if (!token || !userId) {
    return undefined;
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/projects/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, userId }),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    return undefined;
  }

  return { data };
};

export const deleteProject = async ({
  projectId,
}: {
  projectId: string;
}): Promise<{ sucess: boolean } | undefined> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return undefined;
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    return {
      sucess: false,
    };
  }

  return {
    sucess: true,
  };
};

export const connectAWS = async ({
  projectId,
  awsConfig,
}: {
  projectId: string;
  awsConfig: {
    accessKey: string;
    secretKey: string;
    region: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): Promise<{ data: any } | { error: string }> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return { error: "Unauthorized" };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/connect-aws`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ awsConfig }),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    return { error: data.error || "Failed to connect AWS" };
  }

  return { data };
};
