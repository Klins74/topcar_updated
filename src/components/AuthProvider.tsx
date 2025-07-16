// src/components/AuthProvider.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Define a basic User interface based on the usage (e.g., user.email)
interface User {
  email: string;
  // Add other properties if they are part of your user object
  // For example: id?: string; name?: string;
}

// Define the shape of your authentication context
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAdmin: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const NEXT_PUBLIC_ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL; 

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('topcar-user');
      if (storedUser) {
        try {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAdmin(parsedUser.email === NEXT_PUBLIC_ADMIN_EMAIL);
        } catch (error: unknown) { // Типизация ошибки
          console.error("Failed to parse user from localStorage", error);
          localStorage.removeItem('topcar-user');
        }
      }
    }
  }, [NEXT_PUBLIC_ADMIN_EMAIL]);

  const login = (userData: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('topcar-user', JSON.stringify(userData));
    }
    setUser(userData);
    setIsAdmin(userData.email === NEXT_PUBLIC_ADMIN_EMAIL);
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('topcar-user');
    }
    setUser(null);
    setIsAdmin(false);
  };

  const contextValue = {
    user,
    login,
    logout,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}