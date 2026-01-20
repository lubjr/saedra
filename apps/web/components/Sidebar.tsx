"use client";

import { CommandIcon, HomeIcon } from "@repo/ui/lucide";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/sidebar";
import Link from "next/link";

import { useProjects } from "../app/contexts/ProjectsContext";
import { useUser } from "../app/contexts/UserContext";
import { NavProjects } from "./NavProjects";
import { NavSecondary } from "./NavSecondary";
import { NavUser } from "./NavUser";

const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: HomeIcon,
  },
];

const data = {
  /* Create sample
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoyIcon,
    },
    {
      title: "Feedback",
      url: "#",
      icon: SendIcon,
    },
  */
  navSecondary: [],
};

export const AppSidebar = () => {
  const { user: userData, isLoading: isUserLoading, refreshUser } = useUser();
  const { projects, isLoading } = useProjects();

  const user = {
    name: userData?.username || " ",
    email: userData?.email || " ",
    avatar: userData?.avatar_url || " ",
  };

  const projectsData =
    Array.isArray(projects) && projects.length > 0
      ? projects.map((project) => {
          return {
            id: project.id,
            name: project.name,
            url: `/dashboard/project/${project.id}`,
            icon: "frame",
          };
        })
      : [];

  return (
    <Sidebar variant="floating">
      <SidebarHeader className="bg-zinc-900 rounded-lg">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <CommandIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Saedra</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-zinc-900 rounded-lg">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <NavProjects projects={projectsData} isLoading={isLoading} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="bg-zinc-900 rounded-lg">
        <NavUser
          user={user}
          isLoading={isUserLoading}
          refreshUser={refreshUser}
        />
      </SidebarFooter>
    </Sidebar>
  );
};
