import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load: restore session from httpOnly cookie via /auth/me.
  useEffect(() => {
    api.get('/auth/me')
      .then((res) => setUser(res.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password, totp) => {
    const res = await api.post('/auth/login', { email, password, ...(totp ? { totp } : {}) });
    if (res.mfaRequired) return { mfaRequired: true };
    setUser(res.user);
    return res.user;
  }, []);

  const register = useCallback(async (email, password, name) => {
    const res = await api.post('/auth/register', { email, password, name });
    setUser(res.user);
    return res.user;
  }, []);

  const loginWithGoogle = useCallback(async (credential) => {
    const res = await api.post('/auth/google', { credential });
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(async () => {
    await api.post('/auth/logout', {}).catch(() => {});
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    const res = await api.get('/auth/me');
    setUser(res.user);
    return res.user;
  }, []);

  const verifyEmail = useCallback(async (token) => {
    await api.post('/auth/verify-email', { token });
    setUser(u => u ? { ...u, emailVerified: true } : u);
  }, []);

  const resendVerification = useCallback(async () => {
    await api.post('/auth/resend-verification', {});
  }, []);

  const value = {
    user, loading,
    isAdmin: user?.role === 'admin',
    login, register, loginWithGoogle, logout, refresh, verifyEmail, resendVerification,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
