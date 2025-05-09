'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from '@/components/ui/card';
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
import {useToast} from '@/hooks/use-toast';
import {suggestResponse} from '@/ai/flows/suggest-response';
import {addTicket} from '@/services/ticketService';
import type { TicketFormData } from '@/types/ticket';
import Balancer from 'react-wrap-balancer';
import { useRouter } from 'next/navigation';


export default function SubmitTicketPage() {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('user@example.com'); // Default or fetch logged-in user
  const [phoneNumber, setPhoneNumber] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [suggestedResponse, setSuggestedResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const {toast} = useToast();
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    } else {
      setAttachment(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description || !email) {
      toast({
        title: 'Error',
        description: 'Please fill in subject, description, and email.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    const ticketData: TicketFormData = {
      subject,
      description,
      email,
      phoneNumber: phoneNumber || undefined,
      employeeId: employeeId || undefined,
      attachment: attachment || undefined,
    };

    try {
      await addTicket(ticketData);
      toast({
        title: 'Ticket Submitted',
        description: 'Your ticket has been successfully submitted.',
      });
      // Reset form
      setSubject('');
      setDescription('');
      // setEmail(''); // Keep email if it's from logged-in user
      setPhoneNumber('');
      setEmployeeId('');
      setAttachment(null);
      setSuggestedResponse('');
      const fileInput = document.getElementById('attachment') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      router.push('/tickets'); // Navigate to tickets page
    } catch (error) {
      console.error('Error submitting ticket:', error);
      toast({
        title: 'Submission Failed',
        description: 'Could not submit your ticket. Please try again.',
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
              <SidebarMenuButton asChild>
                <Link href="/users" legacyBehavior passHref>
                  <a>
                    <Users />
                    <span>Users</span>
                  </a>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive>
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
              <AvatarImage src="https://picsum.photos/40/40" alt="User Avatar" data-ai-hint="user avatar"/>
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-medium">Current User</span>
              <span className="text-xs text-muted-foreground">{email}</span>
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
                  Describe your issue below. Please be as detailed as possible. Provide contact information for follow-up.
                </Balancer>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Your Email <span className="text-destructive">*</span></Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
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
                    />
                    <Button type="button" variant="outline" size="icon" aria-label="Choose file" onClick={() => document.getElementById('attachment')?.click()}>
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
                    disabled={isSuggesting || !description}
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
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
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
