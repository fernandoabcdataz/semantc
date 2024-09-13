'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';

interface AuthContextProps {
  user: any;
  loading: boolean;
  error: any;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  error: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  let user = null;
  let loading = false;
  let error = null;

  if (process.env.NODE_ENV === 'development') {
    // Mock user data in development
    user = { uid: 'test-uid', email: 'test@example.com' };
  } else {
    // Use real authentication in production
    [user, loading, error] = useAuthState(auth);
  }

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);