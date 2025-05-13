
import type { User } from '@supabase/supabase-js';

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
