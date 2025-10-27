import "@repo/ui/styles.css";

import ClientWrapper from "./ClientWrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <ClientWrapper>{children}</ClientWrapper>
    </main>
  );
}
