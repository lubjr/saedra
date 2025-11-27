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
import { useProjects } from "../app/contexts/ProjectsContext";

export const HeaderPanel = () => {
  const pathname = usePathname();
  const { projects } = useProjects();

  const lastSegment = pathname.split("/").pop() || "";
  const decodedSegment = decodeURIComponent(lastSegment);

  let title = decodedSegment.replace(/-/g, " ").replace(/\b\w/g, (char) => {
    return char.toUpperCase();
  });

  // Check if we're on a project detail page
  const isProjectPage = pathname.includes("/dashboard/project/");
  if (isProjectPage && projects) {
    const projectId = lastSegment;
    const project = Array.isArray(projects)
      ? projects.find((p) => p.id === projectId)
      : null;

    if (project) {
      title = project.name;
    }
  }

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
