import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || '');

  const login = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setToken(token);
    setRole(role);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken('');
    setRole('');
  };

  return (
    <AuthContext.Provider value={{ token, role, isLoggedIn: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
