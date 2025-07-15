import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'kasir1' | 'kasir2';
  institution: string;
  email: string;
  lastLogin: Date;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data
const mockUsers = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    name: 'Administrator',
    role: 'admin' as const,
    institution: 'SMA Negeri 1 Jakarta',
    email: 'admin@sman1jkt.edu',
    lastLogin: new Date()
  },
  {
    id: '2',
    username: 'kasir1',
    password: 'kasir123',
    name: 'Kasir Satu',
    role: 'kasir1' as const,
    institution: 'SMA Negeri 1 Jakarta',
    email: 'kasir1@sman1jkt.edu',
    lastLogin: new Date()
  },
  {
    id: '3',
    username: 'kasir2',
    password: 'kasir123',
    name: 'Kasir Dua',
    role: 'kasir2' as const,
    institution: 'SMA Negeri 1 Jakarta',
    email: 'kasir2@sman1jkt.edu',
    lastLogin: new Date()
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call
    const foundUser = mockUsers.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      const userWithoutPassword = {
        id: foundUser.id,
        username: foundUser.username,
        name: foundUser.name,
        role: foundUser.role,
        institution: foundUser.institution,
        email: foundUser.email,
        lastLogin: new Date()
      };
      
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};