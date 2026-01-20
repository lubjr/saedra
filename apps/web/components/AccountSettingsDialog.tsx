"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { Button } from "@repo/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/field";
import { Input } from "@repo/ui/input";
import * as React from "react";
import { toast } from "sonner";

import { updateUserProfile } from "../auth/user";

type AccountSettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUsername: string;
  currentAvatarUrl: string;
  onProfileUpdated: () => Promise<void>;
};

export const AccountSettingsDialog = ({
  open,
  onOpenChange,
  currentUsername,
  currentAvatarUrl,
  onProfileUpdated,
}: AccountSettingsDialogProps) => {
  const [username, setUsername] = React.useState(currentUsername);
  const [avatarUrl, setAvatarUrl] = React.useState(currentAvatarUrl);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setUsername(currentUsername);
      setAvatarUrl(currentAvatarUrl);
    }
  }, [open, currentUsername, currentAvatarUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }

    if (!avatarUrl.trim()) {
      toast.error("Avatar URL is required");
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile(username.trim(), avatarUrl.trim());
      toast.success("Profile updated successfully!");
      await onProfileUpdated();
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-zinc-800 border-zinc-700 text-white sm:max-w-md"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Update your username and avatar
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="username" className="text-zinc-300">
                Username
              </FieldLabel>
              <Input
                id="username"
                value={username}
                onChange={(e) => {
                  return setUsername(e.target.value);
                }}
                placeholder="Enter your username"
                disabled={loading}
                className="bg-zinc-700/50 border-zinc-600 focus:border-teal-500 focus:ring-teal-500/20 text-white placeholder:text-zinc-500"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="avatarUrl" className="text-zinc-300">
                Avatar URL
              </FieldLabel>
              <Input
                id="avatarUrl"
                value={avatarUrl}
                onChange={(e) => {
                  return setAvatarUrl(e.target.value);
                }}
                placeholder="https://example.com/avatar.jpg"
                disabled={loading}
                className="bg-zinc-700/50 border-zinc-600 focus:border-teal-500 focus:ring-teal-500/20 text-white placeholder:text-zinc-500"
              />
              <FieldDescription className="text-zinc-500">
                Enter a valid image URL for your avatar
              </FieldDescription>
            </Field>

            {avatarUrl && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-400">Preview:</span>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={avatarUrl} alt="Avatar preview" />
                  <AvatarFallback className="bg-zinc-600">
                    {username?.charAt(0)?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="default"
              onClick={() => {
                return onOpenChange(false);
              }}
              disabled={loading}
              className="border-zinc-600 bg-zinc-700 text-white hover:bg-zinc-600"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
