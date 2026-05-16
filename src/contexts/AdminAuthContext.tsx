import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminAuthContextType {
  isAdminLoggedIn: boolean;
  adminLogin: (email: string, password: string) => boolean;
  adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'admin@superbeauty.com';
const ADMIN_PASSWORD = 'admin123';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('adminLoggedIn') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('adminLoggedIn', String(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  const adminLogin = (email: string, password: string) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const adminLogout = () => setIsAdminLoggedIn(false);

  return (
    <AdminAuthContext.Provider value={{ isAdminLoggedIn, adminLogin, adminLogout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};
