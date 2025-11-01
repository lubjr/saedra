import "@repo/ui/styles.css";

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
          <SidebarInset>
            <HeaderPanel />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
                <div className="h-full w-full p-4">
                  <div className="flex w-full justify-center p-4">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ClientWrapper>
    </main>
  );
}
