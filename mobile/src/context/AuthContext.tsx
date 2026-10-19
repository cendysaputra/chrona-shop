import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { getStatus, isNetworkError, TOKEN_KEY } from '@/api/axiosClient';
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

const USER_KEY = 'user';

// Simpan profil
const storeUser = (user: User) => AsyncStorage.setItem(USER_KEY, JSON.stringify(user)).catch(() => {});

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
        storeUser(me);
      } catch (err) {
        if (getStatus(err) === 401) {
          await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
        } else if (isNetworkError(err)) {
          // Profil offline
          const cached = await AsyncStorage.getItem(USER_KEY);
          if (alive && cached) setUser(JSON.parse(cached));
        }
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
    storeUser(data.user);
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
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    setUser(null);
  }, []);

  // Re-fetch profile
  const refresh = useCallback(async () => {
    try {
      const me = await getMe();
      setUser(me);
      storeUser(me);
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
