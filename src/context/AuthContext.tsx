// ============================================
// AUTH CONTEXT - Sistema de Autenticación (Admin + Clientes)
// ============================================

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Tipos para usuario cliente
export interface ClientUser {
  id: string;
  name: string;
  email: string;
  password?: string; // Solo para validación interna simulada
  address?: string;
  phone?: string;
  city?: string;
}

interface AuthContextType {
  // Admin
  isAdmin: boolean;
  loginAdmin: (email: string, password: string) => boolean;
  logoutAdmin: () => void;
  
  // Cliente
  clientUser: ClientUser | null;
  loginClient: (email: string, password: string) => boolean;
  registerClient: (userData: Omit<ClientUser, 'id'>) => boolean;
  logoutClient: () => void;
  updateClientData: (data: Partial<ClientUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_PASSWORD = 'admin123';
const ADMIN_EMAIL = 'admin@minimoda.com';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Estado Admin
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Estado Cliente
  const [clientUser, setClientUser] = useState<ClientUser | null>(null);

  useEffect(() => {
    // Verificar sesión Admin
    const savedAdmin = localStorage.getItem('isAdmin');
    if (savedAdmin === 'true') setIsAdmin(true);

    // Verificar sesión Cliente
    const savedClient = localStorage.getItem('clientUser');
    if (savedClient) {
      setClientUser(JSON.parse(savedClient));
    }
  }, []);

  // --- Funciones Admin ---
  const loginAdmin = (email: string, password: string): boolean => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
    window.location.hash = '#/';
  };

  // --- Funciones Cliente ---
  const loginClient = (email: string, password: string): boolean => {
    // Simulación: Buscar en "base de datos" (localStorage de usuarios registrados)
    const usersDB = JSON.parse(localStorage.getItem('usersDB') || '[]');
    const user = usersDB.find((u: ClientUser) => u.email === email && u.password === password);
    
    if (user) {
      // No guardamos la contraseña en el estado de sesión por seguridad (simulada)
      const { password: _, ...safeUser } = user;
      setClientUser(safeUser as ClientUser);
      localStorage.setItem('clientUser', JSON.stringify(safeUser));
      return true;
    }
    return false;
  };

  const registerClient = (userData: Omit<ClientUser, 'id'>): boolean => {
    const usersDB = JSON.parse(localStorage.getItem('usersDB') || '[]');
    
    // Verificar si ya existe
    if (usersDB.some((u: ClientUser) => u.email === userData.email)) {
      return false; // Email ya registrado
    }

    const newUser = { ...userData, id: Date.now().toString() };
    usersDB.push(newUser);
    localStorage.setItem('usersDB', JSON.stringify(usersDB));
    
    // Auto-login al registrarse
    const { password: _, ...safeUser } = newUser;
    setClientUser(safeUser as ClientUser);
    localStorage.setItem('clientUser', JSON.stringify(safeUser));
    
    return true;
  };

  const logoutClient = () => {
    setClientUser(null);
    localStorage.removeItem('clientUser');
    window.location.hash = '#/';
  };

  const updateClientData = (data: Partial<ClientUser>) => {
    if (!clientUser) return;
    
    const updatedUser = { ...clientUser, ...data };
    setClientUser(updatedUser);
    localStorage.setItem('clientUser', JSON.stringify(updatedUser));
    
    // Actualizar también en "DB"
    const usersDB = JSON.parse(localStorage.getItem('usersDB') || '[]');
    const updatedDB = usersDB.map((u: ClientUser) => 
      u.email === clientUser.email ? { ...u, ...data } : u
    );
    localStorage.setItem('usersDB', JSON.stringify(updatedDB));
  };

  return (
    <AuthContext.Provider value={{ 
      isAdmin, loginAdmin, logoutAdmin,
      clientUser, loginClient, registerClient, logoutClient, updateClientData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
