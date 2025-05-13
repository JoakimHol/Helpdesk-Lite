
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
import { Button } from '@/components/ui/button';
import {
  FileText,
  LifeBuoy,
  LogOut,
  Settings,
  Ticket,
  Users,
  LayoutDashboard,
} from 'lucide-react';
import Link from 'next/link';
import Balancer from 'react-wrap-balancer';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, profile, role, loading, signOut: doSignOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await doSignOut();
    router.push('/login');
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

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
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/tickets">
                  <Ticket />
                  <span>Tickets</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {role === 'admin' && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/users">
                    <Users />
                    <span>Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
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
              <SidebarMenuButton onClick={handleLogout}>
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="mt-4 flex items-center gap-3 rounded-lg bg-secondary p-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2">
            <Avatar className="size-8">
              <AvatarImage
                src={profile?.full_name ? undefined : "https://picsum.photos/40/40"} // Placeholder if no specific avatar URL
                alt={profile?.full_name || user?.email?.[0]?.toUpperCase() || 'U'}
                data-ai-hint="user avatar"
              />
              <AvatarFallback>
                {profile?.full_name
                  ? profile.full_name.substring(0, 2).toUpperCase()
                  : user?.email?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-medium">
                {profile?.full_name || 'Current User'}
              </span>
              <span className="text-xs text-muted-foreground">
                {user?.email}
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
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <Image
              src="https://picsum.photos/400/300"
              alt="Helpdesk illustration"
              data-ai-hint="helpdesk team illustration"
              width={400}
              height={300}
              className="rounded-lg shadow-md"
            />
            <h3 className="text-2xl font-semibold">
              Welcome to HelpDesk Lite, {profile?.full_name || user?.email}!
            </h3>
            <Balancer className="max-w-lg text-muted-foreground">
              This is your central hub for managing support. You can view all
              support tickets, manage users (if you're an admin), or submit a new ticket using the
              sidebar navigation.
            </Balancer>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/tickets">View All Tickets</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/submit-ticket">Create New Ticket</Link>
              </Button>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
