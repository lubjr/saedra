import "@repo/ui/styles.css";

import type { Metadata } from "next";
import { Toaster } from "sonner";

import { ThemeProviderWrapper } from "./providers/ThemeProviderWrapper";

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: "Saedra",
  description: "An open-source, self-hosted alternative to SaaS products.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-zinc-900 text-zinc-100 min-h-screen flex flex-col font-inter [scrollbar-gutter:stable]">
        <ThemeProviderWrapper>
          <Toaster
            theme="dark"
            position="top-right"
            toastOptions={{
              style: {
                background: "#18181b",
              },
            }}
          />
          {children}
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
