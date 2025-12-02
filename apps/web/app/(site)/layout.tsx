import "@repo/ui/styles.css";

import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-grow p-8 flex flex-col items-center">
        {children}
      </main>
      <Footer />
    </>
  );
}
