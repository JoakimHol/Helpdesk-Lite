
export interface Ticket {
  id?: string; // Supabase will generate this (usually UUID)
  user_id?: string; // ID of the user who created the ticket (references profiles.id)
  subject: string;
  description: string;
  attachmentURL?: string; // URL to the uploaded file (if using Supabase Storage)
  email: string; // Requester's email, taken from authenticated user or input by support/admin
  phoneNumber?: string;
  employeeId?: string;
  status: 'Open' | 'In Progress' | 'Closed' | string; // Status of the ticket
  created_at: string; // Timestamp string (ISO format from Supabase)
  updated_at?: string; // Timestamp string for updates
}

export interface TicketFormData {
  subject: string;
  description: string;
  attachment?: File | null;
  // email will be derived from the logged-in user or entered if admin/support creates it
  // For now, we'll assume submitters are logged in and their email is used.
  phoneNumber?: string;
  employeeId?: string;
}

export type TicketStatus = Ticket['status'];
