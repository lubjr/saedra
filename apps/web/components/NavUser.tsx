"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import {
  BadgeCheckIcon,
  BellIcon,
  ChevronsUpDownIcon,
  CreditCardIcon,
  LogOutIcon,
  SettingsIcon,
  SparklesIcon,
} from "@repo/ui/lucide";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@repo/ui/sidebar";
import { Skeleton } from "@repo/ui/skeleton";
import Link from "next/link";
import * as React from "react";

import { logout } from "../auth/auth";
import { AccountSettingsDialog } from "./AccountSettingsDialog";

export const NavUser = ({
  user,
  isLoading = false,
  refreshUser,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  isLoading?: boolean;
  refreshUser?: () => Promise<void>;
}) => {
  const { isMobile } = useSidebar();
  const [accountDialogOpen, setAccountDialogOpen] = React.useState(false);

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled className="gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="grid flex-1 gap-1 text-left text-sm leading-tight">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">BU</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-zinc-800 border-zinc-700 w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-zinc-700" />

            <DropdownMenuGroup>
              <DropdownMenuItem
                disabled
                className="hover:bg-zinc-700 focus:bg-zinc-700"
              >
                <SparklesIcon />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-zinc-700" />

            <Link href="/dashboard/settings">
              <DropdownMenuGroup>
                <DropdownMenuItem className="hover:bg-zinc-700 focus:bg-zinc-700">
                  <SettingsIcon />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </Link>

            <DropdownMenuGroup>
              <DropdownMenuItem
                className="hover:bg-zinc-700 focus:bg-zinc-700"
                onSelect={() => {
                  return setAccountDialogOpen(true);
                }}
              >
                <BadgeCheckIcon />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled
                className="hover:bg-zinc-700 focus:bg-zinc-700"
              >
                <CreditCardIcon />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled
                className="hover:bg-zinc-700 focus:bg-zinc-700"
              >
                <BellIcon />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-zinc-700" />

            <DropdownMenuItem
              className="hover:bg-zinc-700 focus:bg-zinc-700"
              onClick={async () => {
                await logout();
                window.location.reload();
              }}
            >
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <AccountSettingsDialog
          open={accountDialogOpen}
          onOpenChange={setAccountDialogOpen}
          currentUsername={user.name || ""}
          currentAvatarUrl={user.avatar || ""}
          onProfileUpdated={refreshUser || (async () => {})}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
