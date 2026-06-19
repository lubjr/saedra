"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import {
  CheckCircle2Icon,
  ClockIcon,
  FolderIcon,
  FrameIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  ShareIcon,
  ShieldIcon,
  SparklesIcon,
  TargetIcon,
  TrashIcon,
} from "@repo/ui/lucide";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@repo/ui/sidebar";
import { Skeleton } from "@repo/ui/skeleton";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

import { useProjects } from "../app/contexts/ProjectsContext";

export const NavProjects = ({
  projects,
  isLoading = false,
}: {
  projects: {
    id: string;
    name: string;
    url: string;
    icon: string;
    has_memory?: boolean;
  }[];
  isLoading?: boolean;
}) => {
  const { isMobile } = useSidebar();
  const { delete: deleteProject } = useProjects();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsedIds, setCollapsedIds] = React.useState<Set<string>>(
    new Set(),
  );

  const handleProjectClick = (
    e: React.MouseEvent,
    projectId: string,
    isActive: boolean,
  ) => {
    if (isActive) {
      e.preventDefault();
      setCollapsedIds((prev) => {
        const next = new Set(prev);
        if (next.has(projectId)) next.delete(projectId);
        else next.add(projectId);
        return next;
      });
    } else {
      setCollapsedIds((prev) => {
        if (!prev.has(projectId)) return prev;
        const next = new Set(prev);
        next.delete(projectId);
        return next;
      });
    }
  };

  const projectSubItems = [
    {
      title: "Overview",
      icon: FolderIcon,
      slug: "",
      disabled: false,
      memoryOnly: false,
    },
    {
      title: "Reviews",
      icon: SearchIcon,
      slug: "/reviews",
      disabled: false,
      memoryOnly: false,
    },
    {
      title: "Metrics",
      icon: TargetIcon,
      slug: "/metrics",
      disabled: false,
      memoryOnly: false,
    },
    {
      title: "Memory",
      icon: SparklesIcon,
      slug: "/memory",
      disabled: false,
      memoryOnly: true,
    },
    {
      title: "Decisions",
      icon: CheckCircle2Icon,
      slug: "/decisions",
      disabled: false,
      memoryOnly: true,
    },
    {
      title: "Rules",
      icon: ShieldIcon,
      slug: "/rules",
      disabled: false,
      memoryOnly: true,
    },
    {
      title: "Changes",
      icon: ClockIcon,
      slug: "/changes",
      disabled: false,
      memoryOnly: true,
    },
    {
      title: "Settings",
      icon: SettingsIcon,
      slug: "/settings",
      disabled: false,
      memoryOnly: false,
    },
  ];

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {isLoading ? (
          <>
            {Array.from({ length: 3 }).map((_, i) => {
              return (
                <SidebarMenuItem key={`skeleton-${i}`}>
                  <SidebarMenuButton disabled className="gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 flex-1" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </>
        ) : (
          <>
            {projects.map((item) => {
              let Icon = null;

              if (item.icon === "frame") {
                Icon = FrameIcon;
              }
              const isActive = pathname.startsWith(
                `/dashboard/project/${item.id}`,
              );

              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={false}>
                    <Link
                      href={item.url}
                      onClick={(e) => {
                        return handleProjectClick(e, item.id, isActive);
                      }}
                    >
                      {Icon ? <Icon /> : null}
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                  {isActive && !collapsedIds.has(item.id) && (
                    <SidebarMenuSub>
                      {projectSubItems
                        .filter((sub) => {
                          return !sub.memoryOnly || item.has_memory;
                        })
                        .map((sub) => {
                          const subUrl = `/dashboard/project/${item.id}${sub.slug}`;
                          const isSubActive = pathname === subUrl;
                          const isDisabled = sub.disabled;
                          return (
                            <SidebarMenuSubItem key={sub.title}>
                              <SidebarMenuSubButton
                                asChild={!isDisabled}
                                isActive={isSubActive}
                                className={
                                  isDisabled
                                    ? "opacity-40 cursor-not-allowed pointer-events-none"
                                    : ""
                                }
                              >
                                {isDisabled ? (
                                  <span className="flex items-center gap-2">
                                    <sub.icon className="h-3.5 w-3.5" />
                                    <span>{sub.title}</span>
                                  </span>
                                ) : (
                                  <Link href={subUrl}>
                                    <sub.icon className="h-3.5 w-3.5" />
                                    <span>{sub.title}</span>
                                  </Link>
                                )}
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                    </SidebarMenuSub>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontalIcon />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="bg-zinc-800 border-zinc-700 w-48"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                    >
                      <DropdownMenuItem
                        disabled
                        className="hover:bg-zinc-700 focus:bg-zinc-700"
                      >
                        <FolderIcon className="text-muted-foreground" />
                        <span>View Project</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled
                        className="hover:bg-zinc-700 focus:bg-zinc-700"
                      >
                        <ShareIcon className="text-muted-foreground" />
                        <span>Share Project</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-zinc-700" />
                      <DropdownMenuItem
                        className="hover:bg-zinc-700 focus:bg-zinc-700"
                        onClick={async () => {
                          const isCurrentProject =
                            pathname === `/dashboard/project/${item.id}`;
                          await deleteProject({ projectId: item.id });

                          if (isCurrentProject) {
                            router.push("/dashboard");
                          }
                        }}
                      >
                        <TrashIcon className="text-muted-foreground" />
                        <span>Delete Project</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              );
            })}
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="cursor-pointer"
                isActive={pathname === "/dashboard/new-project"}
              >
                <Link href="/dashboard/new-project">
                  <PlusIcon />
                  <span>New Project</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
};
