import { cookies } from "next/headers";

export interface Session {
  token: string;
  userId: string;
}

export const getAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
};

export const getSession = async (): Promise<Session | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const userId = cookieStore.get("user_id")?.value;

  if (!token || !userId) {
    return null;
  }

  return { token, userId };
};

export interface ApiFailure {
  ok: false;
  status: number;
  error: string;
  code?: string;
}

export type ApiResult<T> = { ok: true; data: T } | ApiFailure;

export const rethrowTransportError = (failure: ApiFailure): void => {
  if (failure.status === 0) {
    throw new Error(failure.error);
  }
};

export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  tags?: string[];
  auth?: boolean;
  token?: string;
  fallbackError?: string;
}

const parseBody = async (res: Response): Promise<unknown> => {
  try {
    const text = await res.text();

    if (!text) {
      return null;
    }

    return JSON.parse(text);
  } catch {
    return null;
  }
};

const describeFailure = (
  payload: unknown,
  fallback: string,
): { error: string; code?: string } => {
  if (typeof payload !== "object" || payload === null) {
    return { error: fallback };
  }

  const { error, code } = payload as { error?: unknown; code?: unknown };

  return {
    error: typeof error === "string" ? error : fallback,
    code: typeof code === "string" ? code : undefined,
  };
};

export const apiRequest = async <T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<ApiResult<T>> => {
  const {
    method = "GET",
    body,
    tags,
    auth = true,
    token,
    fallbackError = "Request failed",
  } = options;

  const authToken = auth ? (token ?? (await getAuthToken())) : null;

  if (auth && !authToken) {
    return { ok: false, status: 401, error: "Not authenticated" };
  }

  const headers: Record<string, string> = {};

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  let res: Response;

  try {
    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      method,
      headers,
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      ...(tags === undefined ? {} : { next: { tags, revalidate: false } }),
    });
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error instanceof Error ? error.message : fallbackError,
    };
  }

  const payload = await parseBody(res);

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      ...describeFailure(payload, fallbackError),
    };
  }

  return { ok: true, data: payload as T };
};
