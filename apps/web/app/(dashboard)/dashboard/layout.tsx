import { SidebarInset, SidebarProvider } from "@repo/ui/sidebar";

import { HeaderPanel } from "../../../components/HeaderPanel";
import { AppSidebar } from "../../../components/Sidebar";
import ClientWrapper from "./ClientWrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <ClientWrapper>
        <SidebarProvider className="bg-zinc-950">
          <AppSidebar />
          <SidebarInset className="h-dvh overflow-hidden flex flex-col">
            <HeaderPanel />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-hidden">
              <div className="bg-muted/50 flex-1 rounded-xl overflow-y-auto">
                <div className="w-full p-4">{children}</div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ClientWrapper>
    </main>
  );
}
