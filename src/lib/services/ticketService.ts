'use server';
import type { Ticket, TicketFormData } from '@/types/ticket';
import { db } from '@/lib/firebase'; // Updated import path
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
// import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Uncomment if file uploads are needed

// const storage = getStorage(); // Initialize storage if not already done in firebase.ts and if needed

export async function addTicket(ticketData: TicketFormData): Promise<string> {
  try {
    // Example of how attachmentURL would be handled if file uploads were implemented:
    // let attachmentURL: string | undefined = undefined;
    // if (ticketData.attachment) {
    //   // Placeholder for actual upload logic:
    //   // attachmentURL = await uploadFile(ticketData.attachment);
    // }

    const docRef = await addDoc(collection(db, 'tickets'), {
      subject: ticketData.subject,
      description: ticketData.description,
      email: ticketData.email,
      phoneNumber: ticketData.phoneNumber || null,
      employeeId: ticketData.employeeId || null,
      // attachmentURL: attachmentURL || null, // Store the URL if an attachment was uploaded
      status: 'Open', // Default status
      createdAt: serverTimestamp(), // Firestore server-side timestamp
    });
    console.log('Document written with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    // It's good practice to throw a more specific error or handle it appropriately
    if (e instanceof Error) {
      throw new Error(`Failed to add ticket: ${e.message}`);
    }
    throw new Error('Failed to add ticket due to an unknown error.');
  }
}

export async function getTickets(): Promise<Ticket[]> {
  try {
    const ticketsCol = collection(db, 'tickets');
    // Order tickets by creation date, newest first
    const q = query(ticketsCol, orderBy('createdAt', 'desc'));
    const ticketSnapshot = await getDocs(q);
    const ticketList = ticketSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        subject: data.subject,
        description: data.description,
        email: data.email,
        phoneNumber: data.phoneNumber,
        employeeId: data.employeeId,
        status: data.status,
        createdAt: data.createdAt as Timestamp, // Ensure createdAt is treated as a Firestore Timestamp
        // attachmentURL: data.attachmentURL, // Include if attachments are part of the Ticket type
      } as Ticket; // Cast to Ticket type for type safety
    });
    return ticketList;
  } catch (e) {
    console.error('Error fetching tickets: ', e);
    if (e instanceof Error) {
      throw new Error(`Failed to fetch tickets: ${e.message}`);
    }
    throw new Error('Failed to fetch tickets due to an unknown error.');
  }
}

/*
// Example helper function to upload file (if attachments are needed)
// Ensure getStorage is initialized and exported from firebase.ts if you use this
// import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
// const storage = getStorage(); // Or import from firebase.ts

async function uploadFile(file: File): Promise<string> {
  const uniqueFileName = `${Date.now()}_${file.name}`;
  const fileRef = storageRef(storage, `attachments/${uniqueFileName}`);
  await uploadBytes(fileRef, file);
  const downloadURL = await getDownloadURL(fileRef);
  return downloadURL;
}
*/
