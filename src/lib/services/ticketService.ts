'use server';
import type { Ticket, TicketFormData } from '@/types/ticket';
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
          phoneNumber: item.phone_number, // Map from snake_case
          employeeId: item.employee_id,   // Map from snake_case
          status: item.status,
          created_at: item.created_at,       // Ensure this is a string (ISO format)
          // attachmentURL: item.attachment_url, // Map from snake_case
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
