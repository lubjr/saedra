import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SESSION_COOKIES = ["access_token", "user_id"];

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return true;
    }

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const { exp } = JSON.parse(atob(base64)) as { exp?: unknown };

    return typeof exp !== "number" || exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

const hasValidSession = (req: NextRequest): boolean => {
  const token = req.cookies.get("access_token")?.value;
  const userId = req.cookies.get("user_id")?.value;

  return !!token && !!userId && !isTokenExpired(token);
};

const clearSession = (res: NextResponse): NextResponse => {
  for (const name of SESSION_COOKIES) {
    res.cookies.delete(name);
  }

  return res;
};

export const middleware = (req: NextRequest) => {
  const hasSessionCookie = SESSION_COOKIES.some((name) => {
    return req.cookies.has(name);
  });
  const isValid = hasValidSession(req);

  if (!isValid && req.nextUrl.pathname.startsWith("/dashboard")) {
    const res = NextResponse.redirect(new URL("/", req.url));
    return hasSessionCookie ? clearSession(res) : res;
  }

  if (isValid && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!isValid && hasSessionCookie) {
    return clearSession(NextResponse.next());
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/dashboard/:path*", "/"],
};
