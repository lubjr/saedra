"use client";

import { CommandIcon, HomeIcon, LifeBuoyIcon, SendIcon } from "@repo/ui/lucide";
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
  ],
  projects: [
    {
      name: "Starting Project",
      url: "#",
      icon: "frame",
    },
  ],
};

export const AppSidebar = () => {
  const userData = useUser();

  const user = {
    name: userData?.username || " ",
    email: userData?.email || " ",
    avatar: userData?.avatar_url || " ",
  };
  return (
    <Sidebar variant="floating">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <CommandIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Saedra</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
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
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="bg-zinc-900 rounded-lg">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
};
