
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
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
  Users,
  Sparkles,
  Upload,
  LayoutDashboard,
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { suggestResponse } from '@/ai/flows/suggest-response';
import { addTicket } from '@/lib/services/ticketService';
import type { TicketFormData } from '@/types/ticket';
import Balancer from 'react-wrap-balancer';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function SubmitTicketPage() {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  // Email is now derived from auth context
  const [phoneNumber, setPhoneNumber] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [suggestedResponse, setSuggestedResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user, profile, role, loading: authLoading, signOut: doSignOut } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleLogout = async () => {
    await doSignOut();
    router.push('/login');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    } else {
      setAttachment(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.email || !user.id) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to submit a ticket.',
        variant: 'destructive',
      });
      return;
    }

    if (!subject || !description) {
      toast({
        title: 'Error',
        description: 'Please fill in subject and description.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    const ticketData: TicketFormData = {
      subject,
      description,
      phoneNumber: phoneNumber || undefined,
      employeeId: employeeId || undefined,
      attachment: attachment || undefined,
    };

    try {
      // Pass userId and userEmail to addTicket
      await addTicket(ticketData, user.id, user.email);
      toast({
        title: 'Ticket Submitted',
        description: 'Your ticket has been successfully submitted.',
      });
      setSubject('');
      setDescription('');
      setPhoneNumber('');
      setEmployeeId('');
      setAttachment(null);
      setSuggestedResponse('');
      const fileInput = document.getElementById('attachment') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      router.push('/tickets');
    } catch (error) {
      console.error('Error submitting ticket:', error);
      let errorMessage = 'Could not submit your ticket. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: 'Submission Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuggestResponse = async () => {
    if (!description) {
      toast({
        title: 'Error',
        description: 'Please provide a description to get suggestions.',
        variant: 'destructive',
      });
      return;
    }
    setIsSuggesting(true);
    setSuggestedResponse('');
    try {
      const result = await suggestResponse({
        ticketContent: description,
      });
      setSuggestedResponse(result.suggestedResponse);
      if (result.suggestedResponse) {
         toast({
          title: 'Suggestion Ready',
          description: 'AI has generated a suggested response.',
        });
      } else {
        toast({
          title: 'No Suggestion',
          description: 'AI could not generate a suggestion for this content.',
          variant: 'default'
        });
      }
    } catch (error) {
      console.error('Error fetching suggestion:', error);
      toast({
        title: 'Suggestion Failed',
        description: 'Could not generate AI suggestion. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  if (authLoading || !user) {
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
              <SidebarMenuButton asChild isActive>
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
              <span className="text-xs text-muted-foreground">{user?.email}</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="flex h-14 items-center justify-between border-b bg-background px-4 lg:px-6">
           <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <h2 className="text-xl font-semibold">Submit New Ticket</h2>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Card className="w-full max-w-2xl mx-auto shadow-md">
            <CardHeader>
              <CardTitle>Create a New Support Ticket</CardTitle>
              <CardDescription>
                <Balancer>
                  Describe your issue below. Please be as detailed as possible.
                </Balancer>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Your Email (Logged In)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled // Email is from logged-in user
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="e.g., +1234567890"
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID (Optional)</Label>
                  <Input
                    id="employeeId"
                    type="text"
                    placeholder="e.g., EMP12345"
                    value={employeeId}
                    onChange={e => setEmployeeId(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject <span className="text-destructive">*</span></Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="e.g., Cannot login to account"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="description"
                    placeholder="Provide details about the problem you're facing..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                    rows={5}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attachment">Attachment (Optional)</Label>
                   <div className="flex items-center gap-2">
                    <Input
                      id="attachment"
                      type="file"
                      onChange={handleFileChange}
                      className="flex-1"
                      aria-label="Upload attachment"
                      disabled={isSubmitting}
                    />
                    <Button type="button" variant="outline" size="icon" aria-label="Choose file" onClick={() => document.getElementById('attachment')?.click()} disabled={isSubmitting}>
                      <Upload className="h-4 w-4" />
                    </Button>
                   </div>
                  {attachment && (
                    <p className="text-sm text-muted-foreground">
                      Selected file: {attachment.name}
                    </p>
                  )}
                </div>
                 <div className="space-y-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleSuggestResponse}
                    disabled={isSuggesting || !description || isSubmitting}
                    className="w-full md:w-auto"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isSuggesting ? 'Generating Suggestion...' : 'Suggest Response (AI)'}
                  </Button>
                  {suggestedResponse && (
                    <Card className="mt-2 bg-secondary">
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm">AI Suggestion</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0 text-sm text-secondary-foreground">
                        {suggestedResponse}
                      </CardContent>
                    </Card>
                  )}
                </div>
                 <CardFooter className="p-0 pt-4">
                  <Button type="submit" className="w-full" disabled={isSubmitting || isSuggesting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
