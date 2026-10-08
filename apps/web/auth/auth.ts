"use server";

import { cookies } from "next/headers";

import { apiRequest } from "./api-client";

export interface LoginResponse {
  session: {
    userId: {
      access_token: string;
      expires_in?: number;
      user: { id: string };
    };
  };
}

const DEFAULT_SESSION_MAX_AGE = 60 * 60;

const sessionCookieOptions = (maxAge: number) => {
  return {
    httpOnly: true,
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
};

export interface SignUpResponse {
  user: {
    id: string;
    email: string;
  };
}

export const login = async (email: string, password: string): Promise<void> => {
  const result = await apiRequest<LoginResponse>("/projects/login", {
    method: "POST",
    auth: false,
    body: { email, password },
    fallbackError: "Login failed",
  });

  if (!result.ok) {
    throw new Error(result.error);
  }

  const session = result.data.session.userId;
  const options = sessionCookieOptions(
    session.expires_in ?? DEFAULT_SESSION_MAX_AGE,
  );
  const cookieStore = await cookies();

  cookieStore.set("access_token", session.access_token, options);
  cookieStore.set("user_id", session.user.id, options);
};

export const logout = async () => {
  const cookieStore = await cookies();

  cookieStore.delete("access_token");
  cookieStore.delete("user_id");
};

export const signup = async (
  email: string,
  password: string,
): Promise<SignUpResponse> => {
  const result = await apiRequest<SignUpResponse>("/projects/signup", {
    method: "POST",
    auth: false,
    body: { email, password },
    fallbackError: "Sign up failed",
  });

  if (!result.ok) {
    throw new Error(result.error);
  }

  return result.data;
};

export const requestPasswordReset = async (
  email: string,
): Promise<{ message: string }> => {
  const result = await apiRequest<{ message: string }>(
    "/projects/forgot-password",
    {
      method: "POST",
      auth: false,
      body: { email },
      fallbackError: "Failed to request password reset",
    },
  );

  if (!result.ok) {
    throw new Error(result.error);
  }

  return result.data;
};

export const resetPassword = async (
  token: string,
  password: string,
): Promise<{ message: string }> => {
  const result = await apiRequest<{ message: string }>(
    "/projects/reset-password",
    {
      method: "POST",
      auth: false,
      body: { token, password },
      fallbackError: "Failed to reset password",
    },
  );

  if (!result.ok) {
    throw new Error(result.error);
  }

  return result.data;
};
