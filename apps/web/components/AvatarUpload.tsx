"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { CameraIcon, LoadingIcon } from "@repo/ui/lucide";
import * as React from "react";
import { toast } from "sonner";

const SIZE = 128;
const MAX_BYTES = 5 * 1024 * 1024;

const resizeAvatar = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("File must be an image"));
      return;
    }
    if (file.size > MAX_BYTES) {
      reject(new Error("Image must be smaller than 5 MB"));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      return reject(new Error("Failed to read file"));
    };
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => {
        return reject(new Error("Failed to load image"));
      };
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }
        const min = Math.min(img.width, img.height);
        const sx = (img.width - min) / 2;
        const sy = (img.height - min) / 2;
        ctx.drawImage(img, sx, sy, min, min, 0, 0, SIZE, SIZE);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

type AvatarUploadProps = {
  value: string;
  onChange: (val: string) => void;
  username: string;
  disabled?: boolean;
};

export const AvatarUpload = ({
  value,
  onChange,
  username,
  disabled = false,
}: AvatarUploadProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [resizing, setResizing] = React.useState(false);

  const initial = (username || "?").charAt(0).toUpperCase();
  const busy = resizing || disabled;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResizing(true);
    try {
      const base64 = await resizeAvatar(file);
      onChange(base64);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to process image",
      );
    } finally {
      setResizing(false);
      e.target.value = "";
    }
  };

  return (
    <div
      className="relative w-16 h-16 group"
      style={{ cursor: busy ? "default" : "pointer" }}
      onClick={() => {
        return !busy && inputRef.current?.click();
      }}
    >
      <Avatar className="h-16 w-16">
        <AvatarImage src={value} alt={username} />
        <AvatarFallback className="bg-zinc-800 text-zinc-300 text-xl font-semibold">
          {initial}
        </AvatarFallback>
      </Avatar>
      <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {resizing ? (
          <LoadingIcon className="size-5 text-white animate-spin" />
        ) : (
          <CameraIcon className="size-5 text-white" />
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={busy}
        onChange={handleFileChange}
      />
    </div>
  );
};
