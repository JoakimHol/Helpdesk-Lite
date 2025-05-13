
'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
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
  Ticket as TicketIcon,
  Users,
  LayoutDashboard,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import { getTickets } from '@/lib/services/ticketService';
import type { Ticket } from '@/types/ticket';
import { format } from 'date-fns';
import Balancer from 'react-wrap-balancer';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, profile, role, loading: authLoading, signOut: doSignOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) { // Fetch tickets only if user is loaded
      fetchUserTickets();
    }
  }, [user, authLoading, router]);
  
  const fetchUserTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      // getTickets might need to be adjusted based on RLS or if it needs userId
      const fetchedTickets = await getTickets(); 
      setTickets(fetchedTickets);
    } catch (e) {
      console.error('Failed to fetch tickets:', e);
      setError('Failed to load tickets. Please try again later.');
    } finally {
      setLoading(false);
    }
  };


  const handleLogout = async () => {
    await doSignOut();
    router.push('/login');
  };

  if (authLoading || (!user && !authLoading)) {
    return <div className="flex h-screen items-center justify-center"><p>Loading...</p></div>;
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
              <SidebarMenuButton asChild>
                <Link href="/">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive>
                <Link href="/tickets">
                    <TicketIcon />
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
            <h2 className="text-xl font-semibold">All Tickets</h2>
          </div>
          <Button asChild size="sm">
            <Link href="/submit-ticket">Create New Ticket</Link>
          </Button>
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {loading && (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center justify-center rounded-md border border-destructive/50 bg-destructive/10 p-6 text-center text-destructive">
              <TicketIcon className="mb-2 size-10" />
              <h3 className="text-lg font-semibold">Error Loading Tickets</h3>
              <p className="text-sm">{error}</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={fetchUserTickets}>
                Retry
              </Button>
            </div>
          )}
          {!loading && !error && tickets.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-10 text-center">
              <TicketIcon className="mb-4 size-16 text-muted-foreground" />
              <h3 className="text-xl font-semibold">No Tickets Found</h3>
              <Balancer className="mt-1 text-sm text-muted-foreground">
                There are currently no support tickets. Start by creating one!
              </Balancer>
              <Button asChild className="mt-4">
                <Link href="/submit-ticket">Create First Ticket</Link>
              </Button>
            </div>
          )}
          {!loading && !error && tickets.length > 0 && (
            <Card className="shadow-md">
              <CardContent className="p-0">
                 <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Requester Email</TableHead>
                      <TableHead className="hidden md:table-cell">Phone</TableHead>
                      <TableHead className="hidden lg:table-cell">Employee ID</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium max-w-xs truncate" title={ticket.subject}>
                          {ticket.subject}
                        </TableCell>
                        <TableCell>
                          <Badge variant={ticket.status === 'Open' ? 'default' : ticket.status === 'Closed' ? 'secondary' : 'outline'}>
                            {ticket.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{ticket.email}</TableCell>
                        <TableCell className="hidden md:table-cell">{ticket.phoneNumber || '-'}</TableCell>
                        <TableCell className="hidden lg:table-cell">{ticket.employeeId || '-'}</TableCell>
                        <TableCell>
                          {ticket.created_at ? format(new Date(ticket.created_at), 'PP') : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/tickets/${ticket.id}`}>
                              <Eye className="mr-2 h-4 w-4" /> View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
