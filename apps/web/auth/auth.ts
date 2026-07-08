"use server";

import { cookies } from "next/headers";

export interface LoginResponse {
  session: string;
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
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const cookieStore = await cookies();

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Login failed");
  }

  cookieStore.set("access_token", data.session.userId.access_token);
  cookieStore.set("user_id", data.session.userId.user.id);

  return data;
};

export const logout = async () => {
  const cookieStore = await cookies();

  cookieStore.delete("access_token");
};

export const signup = async (
  email: string,
  password: string,
): Promise<SignUpResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/projects/signup`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Sign up failed");
  }

  return data;
};

export const requestPasswordReset = async (
  email: string,
): Promise<{ message: string }> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/projects/forgot-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to request password reset");
  }

  return data;
};

export const resetPassword = async (
  token: string,
  password: string,
): Promise<{ message: string }> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/projects/reset-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to reset password");
  }

  return data;
};
