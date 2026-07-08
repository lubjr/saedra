"use client";

import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/field";
import { Input } from "@repo/ui/input";
import { cn } from "@repo/ui/lib/utils";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

import { requestPasswordReset } from "../auth/auth";

export const ForgotPasswordForm = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please fill in your email");
      return;
    }

    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message.charAt(0).toUpperCase() + error.message.slice(1)
          : "Unknown error";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <Card className="bg-muted border-2 border-border-emphasis rounded-2xl shadow-sm hover:shadow-md hover:shadow-brand/20 transition-all duration-300">
        <CardHeader className="text-center pb-0">
          <CardTitle className="text-2xl font-bold text-white">
            Forgot your password?
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your email and we&apos;ll send you a link to reset it
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <p className="text-sm text-foreground/80 text-center">
              If this email exists, a password reset link was sent. Check your
              inbox (and spam folder).
            </p>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email" className="text-foreground/80">
                    Email
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      return setEmail(e.target.value);
                    }}
                    required
                    disabled={loading}
                    className="bg-muted/50 border-border-emphasis focus:border-brand-stroke focus:ring-brand/20 text-foreground placeholder:text-muted-foreground/50 transition-all duration-300"
                  />
                </Field>
                <Field className="mt-1">
                  <Button type="submit" disabled={loading}>
                    Send reset link
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        <Link
          href="/login"
          className="text-muted-foreground hover:text-foreground underline transition-colors"
        >
          ← Back to login
        </Link>
      </FieldDescription>
    </div>
  );
};
