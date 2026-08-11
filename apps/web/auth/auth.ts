"use server";

import { cookies } from "next/headers";

import { apiRequest } from "./api-client";

export interface LoginResponse {
  session: {
    userId: {
      access_token: string;
      user: { id: string };
    };
  };
}

export interface SignUpResponse {
  user: {
    id: string;
    email: string;
  };
}

export const login = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const result = await apiRequest<LoginResponse>("/projects/login", {
    method: "POST",
    auth: false,
    body: { email, password },
    fallbackError: "Login failed",
  });

  if (!result.ok) {
    throw new Error(result.error);
  }

  const cookieStore = await cookies();

  cookieStore.set("access_token", result.data.session.userId.access_token);
  cookieStore.set("user_id", result.data.session.userId.user.id);

  return result.data;
};

export const logout = async () => {
  const cookieStore = await cookies();

  cookieStore.delete("access_token");
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
