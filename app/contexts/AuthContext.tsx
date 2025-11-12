'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    // Faux authentication - accept any username with password "password"
    if (password === 'password' && username.length > 0) {
      setUser(username);
      setIsAuthenticated(true);
      localStorage.setItem('auth_user', username);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth_user');
  };

  // Don't render children until we've checked for existing session
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
