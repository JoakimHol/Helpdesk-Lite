
export interface Ticket {
  id?: string; // Supabase will generate this (usually UUID)
  subject: string;
  description: string;
  attachmentURL?: string; // URL to the uploaded file (if using Supabase Storage)
  email: string; // User's email
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
  email: string;
  phoneNumber?: string;
  employeeId?: string;
}

export type TicketStatus = Ticket['status'];
