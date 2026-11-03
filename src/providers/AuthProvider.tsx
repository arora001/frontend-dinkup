'use client';

import React, {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
  ReactNode,
} from 'react';
import { User, Role } from '@/types';
import { apiClient } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isHost: boolean;
  isAdmin: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'dinkup_token';
const USER_KEY = 'dinkup_user';

interface AuthSnapshot {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

const SERVER_SNAPSHOT: AuthSnapshot = {
  user: null,
  token: null,
  isLoading: true,
};

let currentSnapshot: AuthSnapshot | null = null;
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

function getStoredSnapshot(): AuthSnapshot {
  if (typeof window === 'undefined') {
    return SERVER_SNAPSHOT;
  }
  if (!currentSnapshot) {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);
      currentSnapshot = {
        token: storedToken,
        user: storedToken && storedUser ? JSON.parse(storedUser) : null,
        isLoading: false,
      };
    } catch (err) {
      console.error('Error hydrating auth state:', err);
      currentSnapshot = {
        token: null,
        user: null,
        isLoading: false,
      };
    }
  }
  return currentSnapshot;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === TOKEN_KEY || e.key === USER_KEY) {
      currentSnapshot = null;
      callback();
    }
  };
  window.addEventListener('storage', handleStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', handleStorage);
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribe,
    getStoredSnapshot,
    () => SERVER_SNAPSHOT,
  );

  const { user, token, isLoading } = snapshot;

  const login = useCallback((newToken: string, newUser: User) => {
    try {
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    } catch (err) {
      console.error('Error storing auth credentials:', err);
    }
    currentSnapshot = {
      token: newToken,
      user: newUser,
      isLoading: false,
    };
    notify();
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (err) {
      console.error('Error clearing auth credentials:', err);
    }
    currentSnapshot = {
      token: null,
      user: null,
      isLoading: false,
    };
    notify();
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const currentUser = await apiClient<User>('auth/me');
      try {
        localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
      } catch (err) {
        console.error('Error updating cached user:', err);
      }
      currentSnapshot = {
        token,
        user: currentUser,
        isLoading: false,
      };
      notify();
    } catch {
      logout();
    }
  }, [token, logout]);

  const isHost = user?.role === Role.HOST || user?.role === Role.ADMIN;
  const isAdmin = user?.role === Role.ADMIN;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        isHost,
        isAdmin,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

