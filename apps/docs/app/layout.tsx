import "fumadocs-ui/style.css";

import { RootProvider } from "fumadocs-ui/provider";
import type { Metadata } from "next";
import * as React from "react";

export const metadata: Metadata = {
  title: "Saedra Docs",
  description: "Documentation for the Saedra CLI and platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
