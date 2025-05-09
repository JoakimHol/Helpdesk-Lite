import type { Timestamp } from 'firebase/firestore';

export interface Ticket {
  id?: string; // Firestore document ID
  subject: string;
  description: string;
  attachmentURL?: string; // URL to the uploaded file in Firebase Storage
  email: string; // User's email
  phoneNumber?: string;
  employeeId?: string;
  status: 'Open' | 'In Progress' | 'Closed' | string; // Status of the ticket
  createdAt: Timestamp; // Timestamp of when the ticket was created
}

export interface TicketFormData {
  subject: string;
  description: string;
  attachment?: File | null;
  email: string;
  phoneNumber?: string;
  employeeId?: string;
}
