
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string; needsVerification?: boolean }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signInWithFacebook: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      profile: null,
      isAuthenticated: false,
      loading: true,
      
      initialize: async () => {
        try {
          // Get initial session
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            set({ 
              user: session.user, 
              session, 
              isAuthenticated: true 
            });
            await get().fetchProfile();
          }
          
          // Listen for auth changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
              set({ 
                user: session.user, 
                session, 
                isAuthenticated: true 
              });
              
              if (event === 'SIGNED_IN') {
                setTimeout(() => {
                  get().fetchProfile();
                }, 0);
              }
            } else {
              set({ 
                user: null, 
                session: null, 
                profile: null, 
                isAuthenticated: false 
              });
            }
          });
        } catch (error) {
          console.error('Error initializing auth:', error);
        } finally {
          set({ loading: false });
        }
      },
      
      fetchProfile: async () => {
        const { user } = get();
        if (!user) return;
        
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching profile:', error);
            return;
          }
          
          if (data) {
            set({ profile: data });
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      },
      
      login: async (email: string, password: string) => {
        try {
          set({ loading: true });
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (error) {
            return { success: false, error: error.message };
          }
          
          return { success: true };
        } catch (error) {
          return { success: false, error: 'حدث خطأ غير متوقع' };
        } finally {
          set({ loading: false });
        }
      },
      
      signup: async (name: string, email: string, password: string) => {
        try {
          set({ loading: true });
          
          const redirectUrl = `${window.location.origin}/`;
          
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name: name
              },
              emailRedirectTo: redirectUrl
            }
          });
          
          if (error) {
            return { success: false, error: error.message };
          }
          
          // If user needs email confirmation
          if (data.user && !data.session) {
            return { 
              success: true, 
              needsVerification: true 
            };
          }
          
          return { success: true };
        } catch (error) {
          return { success: false, error: 'حدث خطأ غير متوقع' };
        } finally {
          set({ loading: false });
        }
      },

      signInWithGoogle: async () => {
        try {
          set({ loading: true });
          
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/`
            }
          });
          
          if (error) {
            return { success: false, error: error.message };
          }
          
          return { success: true };
        } catch (error) {
          return { success: false, error: 'حدث خطأ غير متوقع' };
        } finally {
          set({ loading: false });
        }
      },

      signInWithFacebook: async () => {
        try {
          set({ loading: true });
          
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'facebook',
            options: {
              redirectTo: `${window.location.origin}/`
            }
          });
          
          if (error) {
            return { success: false, error: error.message };
          }
          
          return { success: true };
        } catch (error) {
          return { success: false, error: 'حدث خطأ غير متوقع' };
        } finally {
          set({ loading: false });
        }
      },
      
      logout: async () => {
        try {
          await supabase.auth.signOut();
        } catch (error) {
          console.error('Error logging out:', error);
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        // Only persist non-sensitive data
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
