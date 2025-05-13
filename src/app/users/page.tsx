
'use client';

import { useEffect, useState } from 'react';
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
import {
  FileText,
  LifeBuoy,
  LogOut,
  Settings,
  Ticket,
  Users as UsersIcon,
  LayoutDashboard,
  ShieldCheck,
  UserCog,
  UserCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import type { UserProfile } from '@/types/user';
import { supabase } from '@/lib/supabase/client'; // Direct Supabase client for fetching users
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Balancer from 'react-wrap-balancer';

export default function UsersPage() {
  const { user, profile, role, loading: authLoading, signOut: doSignOut, isAdmin } = useAuth();
  const router = useRouter();
  const [userList, setUserList] = useState<UserProfile[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
    if (!authLoading && user && !isAdmin) {
      // If user is not admin, redirect them away from this page
      toast({ title: "Access Denied", description: "You don't have permission to view this page.", variant: "destructive" });
      router.push('/');
    }
    if (isAdmin) {
      fetchUsers();
    }
  }, [user, authLoading, isAdmin, router]);

  const fetchUsers = async () => {
    setListLoading(true);
    setListError(null);
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;
      setUserList(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      const fetchErr = err as Error;
      setListError(fetchErr.message || "Failed to load users.");
    } finally {
      setListLoading(false);
    }
  };

  const handleLogout = async () => {
    await doSignOut();
    router.push('/login');
  };

  if (authLoading || (!user && !authLoading)) {
    return <div className="flex h-screen items-center justify-center"><p>Loading...</p></div>;
  }

  if (!isAdmin) {
     return <div className="flex h-screen items-center justify-center"><p>Access Denied. Redirecting...</p></div>;
  }

  const getRoleIcon = (userRole: UserProfile['role']) => {
    switch (userRole) {
      case 'admin': return <ShieldCheck className="h-5 w-5 text-red-500" />;
      case 'support': return <UserCog className="h-5 w-5 text-blue-500" />;
      case 'user': return <UserCircle className="h-5 w-5 text-green-500" />;
      default: return <UserCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getRoleBadgeVariant = (userRole: UserProfile['role']) => {
    switch (userRole) {
      case 'admin': return 'destructive';
      case 'support': return 'default';
      case 'user': return 'secondary';
      default: return 'outline';
    }
  };


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
                <SidebarMenuButton asChild isActive>
                  <Link href="/users">
                    <UsersIcon />
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
                src={profile?.full_name ? undefined : "https://picsum.photos/40/40"}
                alt={profile?.full_name || user?.email?.[0]?.toUpperCase() || 'U'}
                data-ai-hint="user avatar"
              />
              <AvatarFallback>
                {profile?.full_name ? profile.full_name.substring(0, 2).toUpperCase() : user?.email?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-medium">{profile?.full_name || 'Current User'}</span>
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
            <h2 className="text-xl font-semibold">User Management</h2>
          </div>
          {/* Future: Add button to invite/create new user */}
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Card>
            <CardHeader>
              <CardTitle>User Accounts</CardTitle>
              <CardDescription>
                <Balancer>View and manage user accounts and their roles within the system.</Balancer>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {listLoading && (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              )}
              {listError && <p className="text-destructive">Error: {listError}</p>}
              {!listLoading && !listError && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-center">Role Icon</TableHead>
                      {/* Future: Add actions column (e.g., edit role) */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userList.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>{u.full_name || 'N/A'}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(u.role)}>{u.role}</Badge>
                        </TableCell>
                        <TableCell className="text-center">{getRoleIcon(u.role)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {!listLoading && !listError && userList.length === 0 && (
                <p className="text-center text-muted-foreground">No users found.</p>
              )}
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

// Placeholder for toast until it's properly integrated or if not used on this page
const toast = ({ title, description, variant }: { title: string, description: string, variant?: string }) => {
  console.log(`Toast (${variant || 'default'}): ${title} - ${description}`);
};

