"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui/breadcrumb";
import { Separator } from "@repo/ui/separator";
import { SidebarTrigger } from "@repo/ui/sidebar";
import { usePathname } from "next/navigation";
export const HeaderPanel = () => {
  const pathname = usePathname();

  const lastSegment = pathname.split("/").pop() || "";

  let title = lastSegment.replace(/-/g, " ").replace(/\b\w/g, (char) => {
    return char.toUpperCase();
  });

  if (title === "Dashboard") {
    title = "Home";
  }
  return (
    <header className="flex h-16 shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};
