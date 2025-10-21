export interface LoginResponse {
  session: string;
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

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data;
};
