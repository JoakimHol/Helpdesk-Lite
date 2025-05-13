
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let clientErrorMessage = 'Failed to initialize Supabase client. Please check your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables in your .env file or deployment settings.';

if (!supabaseUrl || typeof supabaseUrl !== 'string' || supabaseUrl.trim() === '') {
  const specificError = 'NEXT_PUBLIC_SUPABASE_URL is missing, not a string, or an empty string.';
  console.error(clientErrorMessage, specificError);
  throw new Error(`${clientErrorMessage} ${specificError}`);
}

if (!supabaseAnonKey || typeof supabaseAnonKey !== 'string' || supabaseAnonKey.trim() === '') {
  const specificError = 'NEXT_PUBLIC_SUPABASE_ANON_KEY is missing, not a string, or an empty string.';
  console.error(clientErrorMessage, specificError);
  throw new Error(`${clientErrorMessage} ${specificError}`);
}

let supabaseInstance: ReturnType<typeof createBrowserClient<Database>>;

try {
  supabaseInstance = createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  );
} catch (error: unknown) {
  let creationErrorMessage = 'Failed to initialize Supabase client during createBrowserClient call.';
  if (error instanceof Error) {
    creationErrorMessage += ` The client creation reported: "${error.message}".`;
  } else {
    creationErrorMessage += ` An unexpected error occurred during client creation: ${String(error)}.`;
  }
  creationErrorMessage += ' Please ensure your Supabase URL and Anon Key are correct and the Supabase services are reachable.';
  console.error(creationErrorMessage, error);
  throw new Error(creationErrorMessage);
}

export const supabase = supabaseInstance;
