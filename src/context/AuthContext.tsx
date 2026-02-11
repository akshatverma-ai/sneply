import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '../services/authService';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setAuthState({
        user,
        isLoading: false,
        error: null,
      });
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const user = await authService.signIn(email, password);
      setAuthState({
        user,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState({
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Sign in failed',
      });
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    username: string, 
    displayName: string
  ): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const user = await authService.signUp(email, password, username, displayName);
      setAuthState({
        user,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState({
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Sign up failed',
      });
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      await authService.signOut();
      setAuthState({
        user: null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Sign out failed',
      }));
    }
  };

  const updateUser = (userData: Partial<User>): void => {
    if (authState.user) {
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...userData } : null,
      }));
    }
  };

  const value: AuthContextType = {
    ...authState,
    signIn,
    signUp,
    signOut,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
