
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Session, User, AuthError, SignInWithPasswordCredentials, SignUpWithPasswordCredentials, SignUpWithPasswordCredentialsExtended } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import type { UserProfile, UserRole } from '@/types/user';
import { getUserProfile } from '@/lib/services/userService';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  isAdmin: boolean;
  isSupport: boolean;
  signInWithPassword: (credentials: SignInWithPasswordCredentials) => Promise<{ data: { user: User | null; session: Session | null; }; error: AuthError | null; }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  signUp: (credentials: SignUpWithPasswordCredentialsExtended) => Promise<{ data: { user: User | null; session: Session | null; }; error: AuthError | null; }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        setSession(currentSession);
        const currentUser = currentSession?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          try {
            const userProfile = await getUserProfile(currentUser.id);
            setProfile(userProfile);
            setRole(userProfile?.role || 'user'); 
          } catch (error) {
            console.error("Error fetching user profile:", error);
            setProfile(null);
            setRole('user'); // Fallback role
          }
        } else {
          setProfile(null);
          setRole(null);
        }
        setLoading(false);
      }
    );

    // Initial check for session to avoid flicker/delay
    const checkInitialSession = async () => {
        try {
            const { data: { session: initialSession } } = await supabase.auth.getSession();
            setSession(initialSession);
            const initialUser = initialSession?.user ?? null;
            setUser(initialUser);
            if (initialUser) {
                const userProfile = await getUserProfile(initialUser.id);
                setProfile(userProfile);
                setRole(userProfile?.role || 'user');
            }
        } catch (error) {
            console.error("Error checking initial session:", error);
        } finally {
            setLoading(false);
        }
    };
    checkInitialSession();

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    profile,
    role,
    loading,
    isAdmin: role === 'admin',
    isSupport: role === 'support' || role === 'admin',
    signInWithPassword: (credentials: SignInWithPasswordCredentials) => supabase.auth.signInWithPassword(credentials),
    signOut: () => supabase.auth.signOut(),
    signUp: (credentials: SignUpWithPasswordCredentialsExtended) => supabase.auth.signUp(credentials),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
