
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => Promise<void>;
  login: (mockUser: MockUser) => Promise<void>;
  logout: () => Promise<void>;
  clearAuth: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      session: null,
      loading: true,
      isAuthenticated: false,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setSession: (session) => set({ 
        session, 
        user: session?.user ?? null,
        isAuthenticated: !!session?.user 
      }),
      setLoading: (loading) => set({ loading }),

      signOut: async () => {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          set({ user: null, session: null, isAuthenticated: false });
        } catch (error) {
          console.error('Error signing out:', error);
        }
      },

      login: async (mockUser) => {
        try {
          const mockSupabaseUser: User = {
            id: mockUser.id,
            email: mockUser.email,
            user_metadata: {
              name: mockUser.name,
              avatar: mockUser.avatar
            },
            app_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString()
          };
          
          set({ user: mockSupabaseUser, isAuthenticated: true });
          console.log('Mock user logged in:', mockUser.name);
        } catch (error) {
          console.error('Mock login failed:', error);
          throw error;
        }
      },

      logout: async () => {
        try {
          set({ user: null, session: null, isAuthenticated: false });
          console.log('User logged out');
        } catch (error) {
          console.error('Logout failed:', error);
          throw error;
        }
      },

      clearAuth: () => {
        set({ user: null, session: null, isAuthenticated: false });
        console.log('Auth state cleared');
      },

      initialize: () => {
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log('Auth state change:', event, session?.user?.email);
            set({ 
              session, 
              user: session?.user ?? null,
              isAuthenticated: !!session?.user,
              loading: false 
            });

            if (event === 'SIGNED_IN' && session) {
              console.log('User signed in successfully');
            }
          }
        );

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
          set({ 
            session, 
            user: session?.user ?? null,
            isAuthenticated: !!session?.user,
            loading: false 
          });
        });

        return () => subscription.unsubscribe();
      }
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ 
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
