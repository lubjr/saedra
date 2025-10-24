import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const middleware = (req: NextRequest) => {
  const token = req.cookies.get("access_token")?.value;

  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    const redirect = new URL("/", req.url);
    return NextResponse.redirect(redirect);
  }

  if (token && req.nextUrl.pathname === "/") {
    const redirect = new URL("/dashboard", req.url);
    return NextResponse.redirect(redirect);
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/dashboard/:path*", "/"],
};
