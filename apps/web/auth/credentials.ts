import { cookies } from "next/headers";

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
      body: JSON.stringify({
        awsConfig: {
          accessKeyId: awsConfig.accessKey,
          secretAccessKey: awsConfig.secretKey,
          region: awsConfig.region,
        },
      }),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    return { error: data.error || "Failed to connect AWS" };
  }

  return { data };
};
