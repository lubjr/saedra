"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

export const ToasterWrapper = () => {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      theme={resolvedTheme === "light" ? "light" : "dark"}
      position="top-right"
    />
  );
};
