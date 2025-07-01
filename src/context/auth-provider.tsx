
"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Signed In', description: 'Welcome back!' });
    } catch (error: any) {
      console.error("Sign in error", error);
      let description = "An unknown error occurred.";
       if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          description = 'Invalid email or password. Please try again.';
      } else if (error.code === 'auth/operation-not-allowed') {
         description = 'Email/Password sign in is not enabled in your Firebase project.';
      }
      toast({ title: 'Sign In Failed', description, variant: 'destructive' });
    } finally {
        setLoading(false);
    }
  };


  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast({ title: 'Signed out', description: 'You have been successfully signed out.' });
    } catch (error) {
      console.error('Sign out error', error);
      toast({ title: 'Error', description: 'Failed to sign out.', variant: 'destructive' });
    }
  };

  const value = { user, loading, signIn, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
