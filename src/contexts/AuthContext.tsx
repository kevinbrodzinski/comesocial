
import React, { createContext, useContext, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useAuthStore } from '@/stores/useAuthStore';

interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  login: (mockUser: MockUser) => Promise<void>;
  logout: () => Promise<void>;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const store = useAuthStore();

  useEffect(() => {
    const cleanup = store.initialize();
    return cleanup;
  }, []);

  const value = {
    user: store.user,
    session: store.session,
    loading: store.loading,
    signOut: store.signOut,
    login: store.login,
    logout: store.logout,
    clearAuth: store.clearAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
