import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { getStatus, TOKEN_KEY } from '@/api/axiosClient';
import { getMe, loginRequest, registerRequest } from '@/api/userApi';
import type { AuthResponse, User } from '@/types';

type AuthValue = {
  user: User | null;
  checking: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  // Restore session
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        if (!token) return;
        const me = await getMe();
        if (alive) setUser(me);
      } catch (err) {
        if (getStatus(err) === 401) await AsyncStorage.removeItem(TOKEN_KEY);
      } finally {
        if (alive) setChecking(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const saveSession = useCallback(async (data: AuthResponse) => {
    await AsyncStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const login = useCallback(
    async (email: string, password: string) => saveSession(await loginRequest({ email, password })),
    [saveSession]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => saveSession(await registerRequest({ name, email, password })),
    [saveSession]
  );

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  // Re-fetch profile
  const refresh = useCallback(async () => {
    try {
      setUser(await getMe());
    } catch (err) {
      if (getStatus(err) === 401) await logout();
      else throw err;
    }
  }, [logout]);

  const value = useMemo(
    () => ({ user, checking, isLoggedIn: Boolean(user), login, register, logout, refresh }),
    [user, checking, login, register, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
