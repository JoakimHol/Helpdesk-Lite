
import type { User, SignUpWithPasswordCredentials } from '@supabase/supabase-js';

export type UserRole = 'user' | 'support' | 'admin';

export interface UserProfile {
  id: string; // Corresponds to Supabase auth.users.id
  email?: string;
  full_name?: string | null;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

// You might want a combined type for easier access in context
export interface AppUser extends User {
  profile?: UserProfile | null;
}

// Extend Supabase's SignUpWithPasswordCredentials to include the options.data field
export interface SignUpWithPasswordCredentialsExtended extends SignUpWithPasswordCredentials {
  options?: {
    data?: {
      [key: string]: any; // Allow any custom data
      full_name?: string;
      // Add other custom fields you expect in options.data
    };
    emailRedirectTo?: string;
  };
}
