import "@repo/ui/styles.css";

import { SidebarProvider } from "@repo/ui/sidebar";

import { HeaderPanel } from "../../../components/HeaderPanel";
import { AppSidebar } from "../../../components/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="bg-zinc-950">
      <AppSidebar />
      <main>
        <HeaderPanel />
        {children}
      </main>
    </SidebarProvider>
  );
}
