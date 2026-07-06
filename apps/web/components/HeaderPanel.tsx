"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui/breadcrumb";
import { Separator } from "@repo/ui/separator";
import { SidebarTrigger } from "@repo/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useBreadcrumbLabel } from "../app/contexts/BreadcrumbContext";
import { useProjects } from "../app/contexts/ProjectsContext";

const humanize = (segment: string): string => {
  return decodeURIComponent(segment)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c: string) => {
      return c.toUpperCase();
    });
};

export const HeaderPanel = () => {
  const pathname = usePathname();
  const { projects } = useProjects();
  const { label: detailLabel } = useBreadcrumbLabel();

  const segments = pathname.split("/").filter(Boolean);
  const projectIdx = segments.indexOf("project");
  const isProjectPage = projectIdx !== -1;
  const isNewProject = pathname === "/dashboard/new-project";

  let projectName: string | null = null;
  let subPage: string | null = null;
  let subPageSegment: string | null = null;
  let detailSegment: string | null = null;

  if (isProjectPage && projects) {
    const projectId = segments[projectIdx + 1] ?? "";
    const projectList = Array.isArray(projects) ? projects : [];
    const project = projectList.find((p) => {
      return p.id === projectId;
    });
    if (project) {
      projectName = project.name;
    }
    subPageSegment = segments[projectIdx + 2] ?? null;
    subPage = subPageSegment ? humanize(subPageSegment) : "Overview";
    detailSegment = segments[projectIdx + 3] ?? null;
  }

  const lastSegment = segments[segments.length - 1] ?? "";
  let simpleTitle = decodeURIComponent(lastSegment)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => {
      return c.toUpperCase();
    });
  if (simpleTitle === "Dashboard") simpleTitle = "Home";

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
            {isNewProject ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/dashboard">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Create project</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : isProjectPage && projectName ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href={`/dashboard/project/${segments[projectIdx + 1]}`}
                    >
                      {projectName}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {detailSegment ? (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link
                          href={`/dashboard/project/${segments[projectIdx + 1]}/${subPageSegment}`}
                        >
                          {subPage}
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        {detailLabel ?? humanize(detailSegment)}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                ) : (
                  <BreadcrumbItem>
                    <BreadcrumbPage>{subPage}</BreadcrumbPage>
                  </BreadcrumbItem>
                )}
              </>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage>{simpleTitle}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};
