import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check localStorage for existing session
    const storedAuth = localStorage.getItem('cloudlens_auth');
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        setIsAuthenticated(true);
        setUser(parsed);
      } catch (e) {
        localStorage.removeItem('cloudlens_auth');
      }
    }
  }, []);

  const login = (email: string, name: string = 'Demo User') => {
    const newUser = { id: 'usr_123', name, email };
    setIsAuthenticated(true);
    setUser(newUser);
    localStorage.setItem('cloudlens_auth', JSON.stringify(newUser));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('cloudlens_auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
