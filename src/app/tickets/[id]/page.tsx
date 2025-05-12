
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  FileText,
  LifeBuoy,
  LogOut,
  Settings,
  Ticket as TicketIcon,
  Users,
  LayoutDashboard,
  ChevronLeft,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Phone,
  Mail,
  User,
  CalendarDays,
  Clock,
} from 'lucide-react';
import { getTicketById, updateTicketStatus } from '@/lib/services/ticketService';
import type { Ticket, TicketStatus } from '@/types/ticket';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import Balancer from 'react-wrap-balancer';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchTicketDetails = useCallback(async () => {
    if (!ticketId) return;
    setLoading(true);
    setError(null);
    try {
      const fetchedTicket = await getTicketById(ticketId);
      if (fetchedTicket) {
        setTicket(fetchedTicket);
      } else {
        setError('Ticket not found.');
        toast({
          title: 'Error',
          description: 'The requested ticket could not be found.',
          variant: 'destructive',
        });
      }
    } catch (e) {
      console.error('Failed to fetch ticket details:', e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to load ticket details: ${errorMessage}`);
      toast({
        title: 'Error Loading Ticket',
        description: `Could not load ticket: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [ticketId, toast]);

  useEffect(() => {
    fetchTicketDetails();
  }, [fetchTicketDetails]);

  const handleUpdateStatus = async (newStatus: TicketStatus) => {
    if (!ticket || !ticket.id) return;

    setIsUpdating(true);
    try {
      await updateTicketStatus(ticket.id, newStatus);
      setTicket(prevTicket => prevTicket ? { ...prevTicket, status: newStatus, updated_at: new Date().toISOString() } : null);
      toast({
        title: 'Status Updated',
        description: `Ticket status changed to "${newStatus}".`,
      });
      if (newStatus === 'Closed') {
        // Optionally redirect or disable further actions
      }
    } catch (e) {
      console.error('Failed to update ticket status:', e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      toast({
        title: 'Update Failed',
        description: `Could not update ticket status: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadgeVariant = (status: TicketStatus) => {
    switch (status) {
      case 'Open': return 'default';
      case 'In Progress': return 'outline'; // Or another color, e.g. 'yellow' if defined
      case 'Closed': return 'secondary';
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
              <SidebarMenuButton asChild isActive>
                <Link href="/tickets">
                    <TicketIcon />
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
                {ticket?.email || 'user@example.com'}
              </span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="flex h-14 items-center justify-between border-b bg-background px-4 lg:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <Button variant="outline" size="sm" onClick={() => router.push('/tickets')} className="flex items-center gap-1">
              <ChevronLeft className="size-4" />
              Back to Tickets
            </Button>
            <h2 className="ml-2 text-xl font-semibold">Ticket Details</h2>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {loading && (
            <Card className="w-full max-w-3xl mx-auto shadow-md">
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-1" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-20 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-1/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-24" />
              </CardFooter>
            </Card>
          )}

          {error && !loading && (
            <Alert variant="destructive" className="max-w-3xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
               <Button variant="outline" size="sm" onClick={fetchTicketDetails} className="mt-4">
                Retry
              </Button>
            </Alert>
          )}

          {!loading && !error && ticket && (
            <Card className="w-full max-w-3xl mx-auto shadow-lg rounded-lg">
              <CardHeader className="bg-muted/30 p-6 rounded-t-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-1">
                      <Balancer>{ticket.subject}</Balancer>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Ticket ID: {ticket.id}
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusBadgeVariant(ticket.status)} className="text-sm px-3 py-1">
                    {ticket.status === 'Open' && <Info className="mr-1.5 h-4 w-4" />}
                    {ticket.status === 'In Progress' && <Clock className="mr-1.5 h-4 w-4" />}
                    {ticket.status === 'Closed' && <CheckCircle className="mr-1.5 h-4 w-4" />}
                    {ticket.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-primary">Description</h3>
                  <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Requester Email</h4>
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-primary" />
                      <p className="text-foreground">{ticket.email}</p>
                    </div>
                  </div>
                   <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Phone Number</h4>
                     <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-primary" />
                      <p className="text-foreground">{ticket.phoneNumber || 'Not provided'}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Employee ID</h4>
                     <div className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-primary" />
                      <p className="text-foreground">{ticket.employeeId || 'Not provided'}</p>
                    </div>
                  </div>
                   <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Created At</h4>
                    <div className="flex items-center">
                      <CalendarDays className="mr-2 h-4 w-4 text-primary" />
                      <p className="text-foreground">
                        {ticket.created_at ? format(new Date(ticket.created_at), 'PPpp') : 'N/A'}
                      </p>
                    </div>
                  </div>
                   {ticket.updated_at && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h4>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-primary" />
                        <p className="text-foreground">
                          {format(new Date(ticket.updated_at), 'PPpp')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Placeholder for attachments if implemented */}
                {/* {ticket.attachmentURL && (
                  <div>
                    <h3 className="text-md font-semibold mb-1">Attachment</h3>
                    <a href={ticket.attachmentURL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      View Attachment
                    </a>
                  </div>
                )} */}
              </CardContent>
              <CardFooter className="p-6 border-t bg-muted/30 rounded-b-lg">
                {ticket.status !== 'Closed' && (
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleUpdateStatus('Closed')} 
                      disabled={isUpdating}
                      variant="destructive"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      {isUpdating ? 'Closing...' : 'Close Ticket'}
                    </Button>
                    {/* Add other status update buttons if needed, e.g., "Set to In Progress" */}
                    {ticket.status === 'Open' && (
                       <Button 
                        onClick={() => handleUpdateStatus('In Progress')} 
                        disabled={isUpdating}
                        variant="secondary"
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {isUpdating ? 'Updating...' : 'Set to In Progress'}
                      </Button>
                    )}
                  </div>
                )}
                {ticket.status === 'Closed' && (
                  <p className="text-sm text-muted-foreground flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" /> This ticket is closed.
                  </p>
                )}
              </CardFooter>
            </Card>
          )}
           {!loading && !error && !ticket && (
             <Alert className="max-w-3xl mx-auto">
              <Info className="h-4 w-4" />
              <AlertTitle>Ticket Not Found</AlertTitle>
              <AlertDescription>The ticket you are looking for does not exist or could not be loaded.</AlertDescription>
            </Alert>
           )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
