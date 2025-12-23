"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import {
  FolderIcon,
  FrameIcon,
  MoreHorizontalIcon,
  PlusIcon,
  ShareIcon,
  TrashIcon,
} from "@repo/ui/lucide";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@repo/ui/sidebar";
import { Skeleton } from "@repo/ui/skeleton";
import Link from "next/link";

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
  }[];
  isLoading?: boolean;
}) => {
  const { isMobile } = useSidebar();
  const { delete: deleteProject } = useProjects();

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
                    <Skeleton className="h-4 w-4 rounded" />
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
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      {Icon ? <Icon /> : null}
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
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
                          await deleteProject({ projectId: item.id });
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
              <Link href="/dashboard/new-project">
                <SidebarMenuButton className="cursor-pointer">
                  <PlusIcon />
                  <span>New Project</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
};
