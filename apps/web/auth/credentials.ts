"use server";

import { apiRequest, getAuthToken, rethrowTransportError } from "./api-client";

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
  const token = await getAuthToken();

  if (!token) {
    return { error: "Unauthorized" };
  }

  const result = await apiRequest<unknown>(
    `/projects/${projectId}/connect-aws`,
    {
      method: "POST",
      token,
      body: {
        awsConfig: {
          accessKeyId: awsConfig.accessKey,
          secretAccessKey: awsConfig.secretKey,
          region: awsConfig.region,
        },
      },
      fallbackError: "Failed to connect AWS",
    },
  );

  if (!result.ok) {
    rethrowTransportError(result);
    return { error: result.error };
  }

  return { data: result.data };
};

export const getProjectCredentials = async ({
  projectId,
}: {
  projectId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): Promise<{ data: any } | { error: string }> => {
  const token = await getAuthToken();

  if (!token) {
    return { error: "Unauthorized" };
  }

  const result = await apiRequest<unknown>(
    `/projects/${projectId}/credentials`,
    {
      token,
      fallbackError: "Failed to fetch credentials",
    },
  );

  if (!result.ok) {
    rethrowTransportError(result);
    return { error: result.error };
  }

  return { data: result.data };
};
