
'use client';

import type { PropsWithChildren } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import type { UserProfile, UserRole } from '@/types/user';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  isAdmin: boolean;
  isSupport: boolean;
  signInWithPassword: typeof supabase.auth.signInWithPassword;
  signOut: typeof supabase.auth.signOut;
  signUp: typeof supabase.auth.signUp;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        await fetchUserProfile(currentSession.user.id);
      }
      setLoading(false);
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        if (newSession?.user) {
          await fetchUserProfile(newSession.user.id);
        } else {
          setProfile(null);
          setRole(null);
        }
        if (_event !== 'INITIAL_SESSION') {
          setLoading(false);
        }
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setProfile(null);
        setRole(null);
      } else if (data) {
        setProfile(data as UserProfile);
        setRole((data as UserProfile).role || 'user');
      }
    } catch (e) {
      console.error('Exception fetching user profile:', e);
      setProfile(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user,
    profile,
    role,
    loading,
    isAdmin: role === 'admin',
    isSupport: role === 'support' || role === 'admin',
    signInWithPassword: supabase.auth.signInWithPassword,
    signOut: () => supabase.auth.signOut(),
    signUp: supabase.auth.signUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
