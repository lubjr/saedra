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
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { login } from "../auth/auth";

export const LoginForm = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message.charAt(0).toUpperCase() + error.message.slice(1)
          : "Unknown error";
      toast.error(error instanceof Error ? message : "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <Card className="bg-zinc-800 border-2 border-zinc-700 rounded-2xl shadow-sm hover:shadow-md hover:shadow-teal-500/20 transition-all duration-300">
        <CardHeader className="text-center pb-0">
          <CardTitle className="text-2xl font-bold text-white">
            Login to your account
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Enter your email below to sign your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email" className="text-zinc-300">
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
                  className="bg-zinc-700/50 border-zinc-600 focus:border-teal-500 focus:ring-teal-500/20 text-white placeholder:text-zinc-500 transition-all duration-300"
                />
              </Field>
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password" className="text-zinc-300">
                    Password
                  </FieldLabel>
                  <a href="#" className="text-sm text-zinc-300 hover:underline">
                    Forgot your password?
                  </a>
                </div>
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
                  className="bg-zinc-700/50 border-zinc-600 focus:border-teal-500 focus:ring-teal-500/20 text-white placeholder:text-zinc-500 transition-all duration-300"
                />
              </Field>
              <Field className="mt-1">
                <Button type="submit" disabled={loading}>
                  Login
                </Button>
              </Field>
              <div className="text-center text-sm text-zinc-500 -mt-1">
                Don&apos;t have an account?{" "}
                <a
                  href="#"
                  className="text-zinc-500 hover:text-white underline transition-colors"
                >
                  Sign up
                </a>
              </div>
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-zinc-800 px-2 text-zinc-500">
                    Or continue with
                  </span>
                </div>
              </div>
              <Field>
                <Button variant="default" type="button" disabled>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Apple
                </Button>
                <Button variant="default" type="button" disabled>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        <Link
          href="/"
          className="text-zinc-400 hover:text-white underline transition-colors"
        >
          ← Back to Home
        </Link>
      </FieldDescription>
      <FieldDescription className="px-6 text-center text-zinc-500">
        By clicking continue, you agree to our{" "}
        <a
          href="#"
          className="text-zinc-400 hover:text-white underline transition-colors"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="#"
          className="text-zinc-400 hover:text-white underline transition-colors"
        >
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
};
