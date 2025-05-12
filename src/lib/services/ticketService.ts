'use server';
import type { Ticket, TicketFormData, TicketStatus } from '@/types/ticket';
import { supabase } from '@/lib/supabase/client';
// import { StorageClient } from '@supabase/storage-js'; // Import if using Supabase storage for attachments

// Example: If you plan to use Supabase Storage for attachments
// const storageUrl = process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1';
// const serviceKey = process.env.SUPABASE_SERVICE_KEY; // Needs to be set if using service key for storage
// const storage = new StorageClient(storageUrl, {
//   apikey: serviceKey!, // or anon key if public bucket
//   Authorization: `Bearer ${serviceKey!}`,
// });


export async function addTicket(ticketData: TicketFormData): Promise<string> {
  try {
    // Placeholder for attachment upload to Supabase Storage if needed
    // let attachmentURL: string | undefined = undefined;
    // if (ticketData.attachment) {
    //   const file = ticketData.attachment;
    //   const filePath = `attachments/${Date.now()}_${file.name}`;
    //   const { data: uploadData, error: uploadError } = await supabase.storage
    //     .from('ticket-attachments') // Replace with your bucket name
    //     .upload(filePath, file);

    //   if (uploadError) {
    //     console.error('Error uploading attachment:', uploadError);
    //     throw new Error(`Failed to upload attachment: ${uploadError.message}`);
    //   }
    //   const { data: publicUrlData } = supabase.storage
    //     .from('ticket-attachments') // Replace with your bucket name
    //     .getPublicUrl(filePath);
    //   attachmentURL = publicUrlData?.publicUrl;
    // }

    const newTicket = {
      subject: ticketData.subject,
      description: ticketData.description,
      email: ticketData.email,
      phone_number: ticketData.phoneNumber || null, // Ensure snake_case for Supabase columns
      employee_id: ticketData.employeeId || null, // Ensure snake_case
      // attachment_url: attachmentURL || null, // Ensure snake_case
      status: 'Open', // Default status
      // created_at is usually handled by Supabase (default now())
      // updated_at will be set on update
    };

    const { data, error } = await supabase
      .from('tickets') // Ensure 'tickets' table exists in Supabase
      .insert([newTicket])
      .select('id')
      .single(); // Assuming you want the ID of the inserted row

    if (error) {
      console.error('Error adding document to Supabase: ', error);
      throw new Error(`Failed to add ticket to Supabase: ${error.message}`);
    }

    if (!data || !data.id) {
      throw new Error('Failed to add ticket: No ID returned from Supabase.');
    }
    
    console.log('Document written to Supabase with ID: ', data.id);
    return data.id;

  } catch (e) {
    console.error('Error in addTicket function: ', e);
    if (e instanceof Error) {
      throw new Error(`Failed to add ticket: ${e.message}`);
    }
    throw new Error('Failed to add ticket due to an unknown error.');
  }
}

export async function getTickets(): Promise<Ticket[]> {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false }); // Ensure 'created_at' column exists

    if (error) {
      console.error('Error fetching tickets from Supabase: ', error);
      throw new Error(`Failed to fetch tickets from Supabase: ${error.message}`);
    }

    // Map Supabase data to Ticket type, handling potential snake_case to camelCase differences
    const ticketList: Ticket[] = data
      ? data.map(item => ({
          id: item.id,
          subject: item.subject,
          description: item.description,
          email: item.email,
          phoneNumber: item.phone_number,
          employeeId: item.employee_id,
          status: item.status,
          created_at: item.created_at,
          updated_at: item.updated_at,
          // attachmentURL: item.attachment_url,
        }))
      : [];
      
    return ticketList;

  } catch (e) {
    console.error('Error in getTickets function: ', e);
    if (e instanceof Error) {
      throw new Error(`Failed to fetch tickets: ${e.message}`);
    }
    throw new Error('Failed to fetch tickets due to an unknown error.');
  }
}

export async function getTicketById(id: string): Promise<Ticket | null> {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // PostgREST error code for "Query returned no rows"
        return null;
      }
      console.error(`Error fetching ticket ${id} from Supabase: `, error);
      throw new Error(`Failed to fetch ticket from Supabase: ${error.message}`);
    }

    if (!data) return null;

    return {
      id: data.id,
      subject: data.subject,
      description: data.description,
      email: data.email,
      phoneNumber: data.phone_number,
      employeeId: data.employee_id,
      status: data.status,
      created_at: data.created_at,
      updated_at: data.updated_at,
      // attachmentURL: data.attachment_url,
    };
  } catch (e) {
    console.error(`Error in getTicketById function for ID ${id}: `, e);
    if (e instanceof Error) {
      throw new Error(`Failed to fetch ticket: ${e.message}`);
    }
    throw new Error('Failed to fetch ticket due to an unknown error.');
  }
}

export async function updateTicketStatus(ticketId: string, status: TicketStatus): Promise<void> {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({ status: status, updated_at: new Date().toISOString() })
      .eq('id', ticketId);

    if (error) {
      console.error(`Error updating ticket ${ticketId} status in Supabase: `, error);
      throw new Error(`Failed to update ticket status: ${error.message}`);
    }
    console.log(`Ticket ${ticketId} status updated to ${status}`);
  } catch (e) {
    console.error(`Error in updateTicketStatus function for ID ${ticketId}: `, e);
    if (e instanceof Error) {
      throw new Error(`Failed to update ticket status: ${e.message}`);
    }
    throw new Error('Failed to update ticket status due to an unknown error.');
  }
}
