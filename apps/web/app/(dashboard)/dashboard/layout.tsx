import "@repo/ui/styles.css";

import { SidebarProvider, SidebarTrigger } from "@repo/ui/sidebar";

import { AppSidebar } from "../../../components/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
