'use server';
import type { Ticket, TicketFormData } from '@/types/ticket';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
// import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// TODO: Implement file upload to Firebase Storage if attachments are needed.
// const storage = getStorage();

export async function addTicket(formData: TicketFormData): Promise<Ticket> {
  // let attachmentURL: string | undefined = undefined;
  // if (formData.attachment) {
  //   const attachmentRef = ref(storage, `attachments/${formData.attachment.name}-${Date.now()}`);
  //   const snapshot = await uploadBytes(attachmentRef, formData.attachment);
  //   attachmentURL = await getDownloadURL(snapshot.ref);
  // }

  const ticketData: Omit<Ticket, 'id' | 'createdAt'> & { createdAt: any } = {
    subject: formData.subject,
    description: formData.description,
    // attachmentURL,
    email: formData.email,
    phoneNumber: formData.phoneNumber,
    employeeId: formData.employeeId,
    status: 'Open', // Default status
    createdAt: serverTimestamp(), // Firestore server-side timestamp
  };

  const docRef = await addDoc(collection(db, 'tickets'), ticketData);
  return { id: docRef.id, ...ticketData, createdAt: Timestamp.now() } as Ticket; // Approximate client-side, server will have precise
}

export async function getTickets(): Promise<Ticket[]> {
  const ticketsCol = collection(db, 'tickets');
  const q = query(ticketsCol, orderBy('createdAt', 'desc'));
  const ticketSnapshot = await getDocs(q);
  const ticketList = ticketSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Ticket[];
  return ticketList;
}
