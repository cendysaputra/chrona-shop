import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { TOKEN_KEY } from "../api/axiosClient";
import { getMe, loginRequest, registerRequest } from "../api/userApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)));

  useEffect(() => {
    if (!token || user) {
      setChecking(false);
      return;
    }
    let alive = true;
    getMe()
      .then((me) => alive && setUser(me))
      .catch(() => {
        if (!alive) return;
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      })
      .finally(() => alive && setChecking(false));
    return () => {
      alive = false;
    };
  }, [token, user]);

  const saveSession = useCallback((data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
    setToken(data.token);
    return data.user;
  }, []);

  const login = useCallback(async (email, password) => saveSession(await loginRequest({ email, password })), [saveSession]);

  const register = useCallback(
    async (name, email, password) => saveSession(await registerRequest({ name, email, password })),
    [saveSession]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, checking, isLoggedIn: Boolean(user), login, register, logout }),
    [user, token, checking, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
