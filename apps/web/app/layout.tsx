import "@repo/ui/styles.css";

import type { Metadata } from "next";

import { ThemeProviderWrapper } from "./providers/ThemeProviderWrapper";
import { ToasterWrapper } from "./providers/ToasterWrapper";

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
      <body className="bg-background text-foreground min-h-screen flex flex-col font-inter">
        <ThemeProviderWrapper>
          <ToasterWrapper />
          {children}
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
