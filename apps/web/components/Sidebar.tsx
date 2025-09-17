import { HomeIcon, InboxIcon, LifeBuoyIcon, SendIcon } from "@repo/ui/lucide";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/sidebar";

import { NavSecondary } from "./NavSecondary";
import { NavUser } from "./NavUser";

const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: HomeIcon,
  },
  {
    title: "Projects",
    url: "#",
    icon: InboxIcon,
  },
];

const data = {
  user: {
    name: "beta user",
    email: "user@saedra.com",
    avatar: "/",
  },
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
};

export const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarContent className="bg-zinc-900">
        <SidebarGroup>
          <SidebarGroupLabel>Saedra</SidebarGroupLabel>
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
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="bg-zinc-900">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
};
