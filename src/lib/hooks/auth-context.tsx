import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Definindo os tipos para o contexto de autenticação
interface AuthContextType {
  user: string | null;
  login: (user: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Componente para fornecer o contexto
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    // Aqui você pode checar se há um token no localStorage ou em algum outro lugar
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = (user: string) => {
    localStorage.setItem('user', user);  // Salva o usuário no localStorage
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('user');  // Remove o usuário do localStorage
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
