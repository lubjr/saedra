"use client";
import { ThemeProvider } from "./ThemeProvider";

export const ThemeProviderWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};
