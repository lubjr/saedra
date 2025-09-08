import "@repo/ui/styles.css";

import { NatsProvider } from "../app/providers/NatsProvider";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { ThemeProvider } from "./providers/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-zinc-900 text-zinc-100 min-h-screen flex flex-col font-inter">
        <NatsProvider>
          <Header />
          <main className="flex-grow p-8 flex flex-col items-center">
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </main>
          <Footer />
        </NatsProvider>
      </body>
    </html>
  );
}
