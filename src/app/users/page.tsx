'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Button } from '@/components/ui/button'; // Button not used directly on this page for Link wrapping
import {
  FileText,
  LifeBuoy,
  LogOut,
  Settings,
  Ticket,
  Users as UsersIcon,
  LayoutDashboard,
} from 'lucide-react';
import Link from 'next/link';
import Balancer from 'react-wrap-balancer';
import Image from 'next/image';

export default function UsersPage() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="items-center justify-between gap-0">
          <div className="flex items-center gap-2">
            <LifeBuoy className="size-6 text-primary" />
            <h1 className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
              HelpDesk Lite
            </h1>
          </div>
          <SidebarTrigger className="hidden group-data-[collapsible=icon]:block group-data-[variant=floating]:hidden" />
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/" legacyBehavior passHref>
                  <a>
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </a>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/tickets" legacyBehavior passHref>
                  <a>
                    <Ticket />
                    <span>Tickets</span>
                  </a>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive>
                <Link href="/users" legacyBehavior passHref>
                  <a>
                    <UsersIcon />
                    <span>Users</span>
                  </a>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/submit-ticket" legacyBehavior passHref>
                  <a>
                    <FileText />
                    <span>Submit Ticket</span>
                  </a>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/settings" legacyBehavior passHref>
                  <a>
                    <Settings />
                    <span>Settings</span>
                  </a>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/login" legacyBehavior passHref>
                  <a>
                    <LogOut />
                    <span>Logout</span>
                  </a>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="mt-4 flex items-center gap-3 rounded-lg bg-secondary p-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2">
            <Avatar className="size-8">
              <AvatarImage
                src="https://picsum.photos/40/40"
                alt="User Avatar"
                data-ai-hint="user avatar"
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-medium">Current User</span>
              <span className="text-xs text-muted-foreground">
                user@example.com
              </span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="flex h-14 items-center justify-between border-b bg-background px-4 lg:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <h2 className="text-xl font-semibold">User Management</h2>
          </div>
          {/* Add User action buttons here if needed, e.g., "Add User" */}
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <UsersIcon className="size-24 text-muted-foreground" />
            <h3 className="text-2xl font-semibold">
              User Management
            </h3>
            <Balancer className="max-w-md text-muted-foreground">
              This section is for managing users. Functionality to list, add, edit, and remove users will be implemented here.
            </Balancer>
            <Image
              src="https://picsum.photos/300/200"
              alt="Users illustration"
              data-ai-hint="team collaboration illustration"
              width={300}
              height={200}
              className="rounded-lg shadow-md"
            />
            {/* Placeholder for user list or management tools */}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
