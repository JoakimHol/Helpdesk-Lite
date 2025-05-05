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
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {
  FileText,
  LifeBuoy,
  LogOut,
  Settings,
  Ticket,
  Users,
  User,
} from 'lucide-react';
import Link from 'next/link';
import Balancer from 'react-wrap-balancer';
import Image from 'next/image';

export default function Home() {
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
              <SidebarMenuButton asChild isActive>
                <Link href="/">
                  <Ticket />
                  <span>Tickets</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/users">
                  <Users />
                  <span>Users</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/submit-ticket">
                  <FileText />
                  <span>Submit Ticket</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/settings">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                {/* Replace with actual logout logic */}
                <Link href="/login">
                  <LogOut />
                  <span>Logout</span>
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
            <h2 className="text-xl font-semibold">Dashboard</h2>
          </div>
          {/* Add User Menu or other header elements here if needed */}
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <Image
              src="https://picsum.photos/400/300"
              alt="Helpdesk illustration"
              data-ai-hint="helpdesk support illustration"
              width={400}
              height={300}
              className="rounded-lg shadow-md"
            />
            <h3 className="text-2xl font-semibold">
              Welcome to HelpDesk Lite!
            </h3>
            <Balancer className="max-w-md text-muted-foreground">
              Manage your support tickets efficiently. Use the sidebar to
              navigate through tickets, users, or submit a new ticket.
            </Balancer>
            <Button asChild>
              <Link href="/submit-ticket">Create New Ticket</Link>
            </Button>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
