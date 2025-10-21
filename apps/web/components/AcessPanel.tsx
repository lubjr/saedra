"use client";

import { Button } from "@repo/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { useRouter } from "next/navigation";
import * as React from "react";

import { login } from "../auth/login";

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
      router.push("/dashboard");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Login</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-zinc-900">
        <DialogHeader>
          <DialogTitle>Login to your account</DialogTitle>
          <DialogDescription>
            Enter your credentials to access the dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
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

        <DialogFooter className="sm:justify-start mt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleLogin}
            disabled={loading}
          >
            Enter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
