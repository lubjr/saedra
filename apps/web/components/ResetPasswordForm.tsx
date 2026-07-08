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
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { resetPassword } from "../auth/auth";

export const ResetPasswordForm = ({
  token,
  className,
  ...props
}: { token: string } & React.ComponentProps<"div">) => {
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      toast.success("Password updated successfully!");
      router.push("/login");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message.charAt(0).toUpperCase() + error.message.slice(1)
          : "Unknown error";
      toast.error(message);
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <Card className="bg-muted border-2 border-border-emphasis rounded-2xl shadow-sm hover:shadow-md hover:shadow-brand/20 transition-all duration-300">
        <CardHeader className="text-center pb-0">
          <CardTitle className="text-2xl font-bold text-white">
            Set a new password
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="password" className="text-foreground/80">
                  New password
                </FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    return setPassword(e.target.value);
                  }}
                  required
                  disabled={loading}
                  className="bg-muted/50 border-border-emphasis focus:border-brand-stroke focus:ring-brand/20 text-foreground placeholder:text-muted-foreground/50 transition-all duration-300"
                />
                <FieldDescription className="text-muted-foreground">
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel
                  htmlFor="confirmPassword"
                  className="text-foreground/80"
                >
                  Confirm new password
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    return setConfirmPassword(e.target.value);
                  }}
                  required
                  disabled={loading}
                  className="bg-muted/50 border-border-emphasis focus:border-brand-stroke focus:ring-brand/20 text-foreground placeholder:text-muted-foreground/50 transition-all duration-300"
                />
              </Field>
              <Field className="mt-1">
                <Button type="submit" disabled={loading}>
                  Update password
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
