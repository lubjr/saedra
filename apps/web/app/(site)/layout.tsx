import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark bg-card text-foreground min-h-dvh flex flex-col">
      <Header />
      <main className="grow">{children}</main>
      <Footer />
    </div>
  );
}
