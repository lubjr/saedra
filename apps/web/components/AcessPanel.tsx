"use client";

import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui/sheet";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { login } from "../auth/auth";

export const ButtonPanel = () => {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(email, password);
      setOpen(false);
      toast.loading("Logging in...", { id: "login" });
      router.push("/dashboard");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message.charAt(0).toUpperCase() + error.message.slice(1)
          : "Unknown error";
      toast.error(error instanceof Error ? message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Login</Button>
      </SheetTrigger>

      <SheetContent side="right" className="sm:max-w-md bg-zinc-900">
        <SheetHeader>
          <SheetTitle>Login to your account</SheetTitle>
          <SheetDescription>
            Enter your credentials to access the dashboard.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 p-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                return setEmail(e.target.value);
              }}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                return setPassword(e.target.value);
              }}
            />
          </div>
        </div>

        <SheetFooter className="sm:justify-start">
          <Button
            type="button"
            variant="secondary"
            disabled={loading}
            onClick={() => {
              handleLogin();
            }}
          >
            Enter
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
