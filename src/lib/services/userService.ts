
'use server';

import { supabase } from '@/lib/supabase/client';
import type { UserProfile, UserRole } from '@/types/user';

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // PGRST116 means no rows found, which is fine for a profile lookup
      if (error.code === 'PGRST116') {
        console.warn(`No profile found for user ID: ${userId}`);
        return null;
      }
      console.error('Error fetching user profile:', error.message);
      throw error;
    }
    return data as UserProfile;
  } catch (e) {
    const error = e as Error;
    console.error('Supabase call failed in getUserProfile:', error.message);
    return null; // Or rethrow if you want to handle it higher up
  }
}

export async function getAllUserProfiles(): Promise<UserProfile[]> {
  // This should be restricted by RLS to admins only
  try {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) {
      console.error('Error fetching all user profiles:', error.message);
      throw error;
    }
    return (data as UserProfile[]) || [];
  } catch (e) {
    const error = e as Error;
    console.error('Supabase call failed in getAllUserProfiles:', error.message);
    return [];
  }
}

export async function updateUserRole(userId: string, role: UserRole): Promise<boolean> {
  // This should be restricted by RLS to admins only
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user role:', error.message);
      throw error;
    }
    return true;
  } catch (e) {
    const error = e as Error;
    console.error('Supabase call failed in updateUserRole:', error.message);
    return false;
  }
}

// Note: Sign-in, sign-out, and sign-up are typically handled client-side
// using the Supabase JS client directly, often within an AuthContext or similar.
// These server-side functions are for operations an admin might perform or
// if you have specific server-side auth flows.
