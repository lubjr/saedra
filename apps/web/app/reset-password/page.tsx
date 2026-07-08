"use client";

import Link from "next/link";
import * as React from "react";

import { ResetPasswordForm } from "../../components/ResetPasswordForm";

export default function ResetPasswordPage() {
  const [token, setToken] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    const params = new URLSearchParams(hash);

    const errorDescription = params.get("error_description");
    if (errorDescription) {
      setError(decodeURIComponent(errorDescription.replace(/\+/g, " ")));
      return;
    }

    const accessToken = params.get("access_token");
    const type = params.get("type");

    if (!accessToken || type !== "recovery") {
      setError("This password reset link is invalid or has expired.");
      return;
    }

    setToken(accessToken);
  }, []);

  return (
    <div className="relative bg-card flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-fill/50 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-fill rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 flex w-full max-w-sm flex-col gap-6">
        {error ? (
          <div className="flex flex-col gap-4 text-center">
            <p className="text-sm text-foreground/80">{error}</p>
            <Link
              href="/forgot-password"
              className="text-sm text-muted-foreground hover:text-foreground underline transition-colors"
            >
              Request a new link
            </Link>
          </div>
        ) : token ? (
          <ResetPasswordForm token={token} />
        ) : null}
      </div>
    </div>
  );
}
