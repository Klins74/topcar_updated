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
  user: User | null; // Specify User type
  login: (userData: User) => void; // Specify User type
  logout: () => void;
  isAdmin: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null); // Specify User | null
  const [isAdmin, setIsAdmin] = useState(false); // State to check if user is admin
  // Ensure NEXT_PUBLIC_ADMIN_EMAIL is correctly set in your .env.local
  const NEXT_PUBLIC_ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL; 

  useEffect(() => {
    // Attempt to load user from localStorage on mount (client-side only)
    if (typeof window !== 'undefined') { // Check if running in browser
      const storedUser = localStorage.getItem('topcar-user');
      if (storedUser) {
        try {
          const parsedUser: User = JSON.parse(storedUser); // Cast to User
          setUser(parsedUser);
          setIsAdmin(parsedUser.email === NEXT_PUBLIC_ADMIN_EMAIL);
        } catch (e: unknown) { // Explicitly type 'e' as 'unknown' for safety
          console.error("Failed to parse user from localStorage", e);
          localStorage.removeItem('topcar-user'); // Clear corrupted data
        }
      }
    }
  }, [NEXT_PUBLIC_ADMIN_EMAIL]);

  // Login function
  const login = (userData: User) => { // Specify User type
    if (typeof window !== 'undefined') {
      localStorage.setItem('topcar-user', JSON.stringify(userData));
    }
    setUser(userData);
    setIsAdmin(userData.email === NEXT_PUBLIC_ADMIN_EMAIL);
  };

  // Logout function
  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('topcar-user');
    }
    setUser(null);
    setIsAdmin(false);
  };

  // The value that will be supplied to any consumer of this context
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