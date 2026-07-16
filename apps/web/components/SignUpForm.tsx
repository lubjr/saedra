"use client";

import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Checkbox } from "@repo/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/field";
import { Input } from "@repo/ui/input";
import { cn } from "@repo/ui/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { signup } from "../auth/auth";

export const SignUpForm = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [agreedToTerms, setAgreedToTerms] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const isFormValid =
    email !== "" &&
    password.length >= 8 &&
    confirmPassword !== "" &&
    password === confirmPassword;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
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

    if (!agreedToTerms) {
      toast.error("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    setLoading(true);
    try {
      await signup(email, password);
      toast.success("Account created successfully!");
      router.push("/login");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message.charAt(0).toUpperCase() + error.message.slice(1)
          : "Unknown error";
      toast.error(error instanceof Error ? message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <Card className="bg-muted border-2 border-border-emphasis rounded-2xl shadow-sm hover:shadow-md hover:shadow-brand/20 transition-all duration-300">
        <CardHeader className="text-center pb-0">
          <CardTitle className="text-2xl font-bold text-white">
            Create an account
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} noValidate>
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
                <FieldDescription className="text-muted-foreground">
                  We&apos;ll use this to contact you. We will not share your
                  email with anyone else.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="password" className="text-foreground/80">
                  Password
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
                  Confirm Password
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
                <FieldDescription className="text-muted-foreground">
                  Please confirm your password.
                </FieldDescription>
              </Field>
              {isFormValid && (
                <Field orientation="horizontal">
                  <Checkbox
                    id="agreedToTerms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => {
                      return setAgreedToTerms(checked === true);
                    }}
                    disabled={loading}
                    className="border-border-emphasis"
                  />
                  <FieldLabel
                    htmlFor="agreedToTerms"
                    className="text-muted-foreground font-normal"
                  >
                    <span>
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        target="_blank"
                        className="text-foreground underline transition-colors hover:text-brand"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        target="_blank"
                        className="text-foreground underline transition-colors hover:text-brand"
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  </FieldLabel>
                </Field>
              )}
              <Field className="mt-1">
                <Button
                  type="submit"
                  disabled={loading || !isFormValid || !agreedToTerms}
                >
                  Create Account
                </Button>
              </Field>
              <div className="text-center text-sm text-muted-foreground -mt-1">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-muted-foreground hover:text-foreground underline transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
