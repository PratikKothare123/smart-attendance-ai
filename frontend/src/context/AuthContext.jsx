import { createContext, useContext, useState, useEffect } from 'react';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('sa_token');
    const u = localStorage.getItem('sa_user');
    if (t && u) { setToken(t); setUser(JSON.parse(u)); }
    setLoading(false);
  }, []);

  const login = (userData, tok) => {
    localStorage.setItem('sa_token', tok);
    localStorage.setItem('sa_user', JSON.stringify(userData));
    setToken(tok); setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('sa_token');
    localStorage.removeItem('sa_user');
    setToken(null); setUser(null);
  };

  const updateUser = (u) => {
    localStorage.setItem('sa_user', JSON.stringify(u));
    setUser(u);
  };

  return (
    <AuthCtx.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
