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
  const router = useRouter();
  const pathname = usePathname();

  const projectSubItems = [
    { title: "Overview", icon: FolderIcon, slug: "", disabled: false },
    { title: "Reviews", icon: SearchIcon, slug: "/reviews", disabled: false },
    { title: "Metrics", icon: TargetIcon, slug: "/metrics", disabled: false },
    {
      title: "Settings",
      icon: SettingsIcon,
      slug: "/settings",
      disabled: false,
    },
    { title: "Memory", icon: SparklesIcon, slug: "/memory", disabled: false },
    {
      title: "Decisions",
      icon: CheckCircle2Icon,
      slug: "/decisions",
      disabled: false,
    },
    { title: "Rules", icon: ShieldIcon, slug: "/rules", disabled: true },
    { title: "Changes", icon: ClockIcon, slug: "/changes", disabled: true },
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
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={item.url}>
                      {Icon ? <Icon /> : null}
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                  {isActive && (
                    <SidebarMenuSub>
                      {projectSubItems.map((sub) => {
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
