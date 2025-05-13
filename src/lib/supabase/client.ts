import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  let errorMessage = 'Failed to initialize Supabase client. ';
  if (!supabaseUrl) {
    errorMessage += 'NEXT_PUBLIC_SUPABASE_URL is missing. ';
  }
  if (!supabaseAnonKey) {
    errorMessage += 'NEXT_PUBLIC_SUPABASE_ANON_KEY is missing. ';
  }
  errorMessage += 'Please check your environment variables.';
  throw new Error(errorMessage);
}

let supabaseInstance: ReturnType<typeof createBrowserClient<Database>>;

try {
  supabaseInstance = createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  );
} catch (error: unknown) {
  let clientErrorMessage = 'Failed to initialize Supabase client.';
  if (error instanceof Error) {
    clientErrorMessage += ` The client creation reported: "${error.message}".`;
  } else {
    clientErrorMessage += ` An unexpected error occurred during client creation: ${String(error)}.`;
  }
  clientErrorMessage += ' Please check your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables in your .env file or deployment settings.';
  console.error(clientErrorMessage, error);
  throw new Error(clientErrorMessage);
}

export const supabase = supabaseInstance;
