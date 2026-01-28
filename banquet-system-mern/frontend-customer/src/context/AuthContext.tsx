import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/api/auth';
import type { User, LoginCredentials, RegisterData, AuthResponse } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // 1. SYNCHRONOUS INIT - The "Big Hammer" approach
  // We initialize state directly from storage. NO useEffect for initial value.
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  const [user, setUser] = useState<User | null>(() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null; // Fail silent
    }
  });

  // If token exists in storage, we are authenticated immediately.
  // We do NOT start with loading = true if we already have the token.
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Derived state
  const isAuthenticated = !!token;

  // We can still listen for storage changes or do a validation check, 
  // but we TRUST the local storage for the initial render.
  useEffect(() => {
    // Optional: You could verify token validity here, but for "Integrity" preventing redirect loop, we trust it.
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await authAPI.login(credentials);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await authAPI.register(userData);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authAPI.logout(); // Should clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
