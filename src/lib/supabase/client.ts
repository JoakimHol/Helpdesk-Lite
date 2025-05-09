// src/lib/supabase/client.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const baseErrorMessage = "Failed to initialize Supabase client.";
const hintMessage = "Please check your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables in your .env file or deployment settings.";

if (!supabaseUrl) {
  console.error(`${baseErrorMessage} NEXT_PUBLIC_SUPABASE_URL is not set.`);
  throw new Error(`Missing Supabase URL. ${hintMessage}`);
}

if (!supabaseAnonKey) {
  console.error(`${baseErrorMessage} NEXT_PUBLIC_SUPABASE_ANON_KEY is not set.`);
  throw new Error(`Missing Supabase anonymous key. ${hintMessage}`);
}

let supabase: SupabaseClient;

try {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} catch (e) {
  console.error(`${baseErrorMessage} An error occurred during client creation:`, e);
  if (e instanceof Error) {
    throw new Error(`${baseErrorMessage} The client creation reported: "${e.message}". ${hintMessage}`);
  } else {
    throw new Error(`${baseErrorMessage} ${hintMessage} An unexpected issue occurred during client creation: ${String(e)}`);
  }
}

export { supabase };
