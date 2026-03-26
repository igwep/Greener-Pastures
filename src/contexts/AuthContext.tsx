import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getStoredUser, getStoredToken, clearSession } from '../services/auth/session';
import { AuthUser } from '../services/auth/session';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const isAuthenticated = !!token && !!user;

  const refreshAuth = () => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();
    setToken(storedToken);
    setUser(storedUser);
  };

  const login = (newToken: string, newUser: AuthUser) => {
    // Store auth data
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    
    // Remove only auth-related queries from cache to force fresh data
    // but keep other non-sensitive cached data
    queryClient.removeQueries({ queryKey: ['dashboardSummary'] });
    queryClient.removeQueries({ queryKey: ['auth'] });
    queryClient.removeQueries({ queryKey: ['loans'] });
    queryClient.removeQueries({ queryKey: ['deposits'] });
    queryClient.removeQueries({ queryKey: ['withdrawals'] });
    queryClient.removeQueries({ queryKey: ['repayments'] });
    
    // Invalidate remaining queries to ensure they're fresh
    queryClient.invalidateQueries();
  };

  const logout = () => {
    // Clear all storage first
    clearSession();
    
    // Clear all React Query cache
    queryClient.clear();
    
    // Reset auth state
    setToken(null);
    setUser(null);
    
    // Force garbage collection to free memory
    if (typeof window !== 'undefined' && 'gc' in window) {
      (window as any).gc?.();
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      login,
      logout,
      refreshAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
