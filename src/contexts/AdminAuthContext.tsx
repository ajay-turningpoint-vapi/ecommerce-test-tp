import React, { createContext, useContext, useState, useEffect } from 'react';

const ADMIN_CREDENTIALS = {
  email: 'admin@superbeauty.com',
  password: 'admin123',
  user: { id: '1', name: 'Super Admin', email: 'admin@superbeauty.com', role: 'admin' },
};

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminAuthContextType {
  isAdminLoggedIn: boolean;
  adminUser: AdminUser | null;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('adminUser');
    if (saved) {
      try { setAdminUser(JSON.parse(saved)); } catch { localStorage.removeItem('adminUser'); }
    }
    setLoading(false);
  }, []);

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setAdminUser(ADMIN_CREDENTIALS.user);
      localStorage.setItem('adminUser', JSON.stringify(ADMIN_CREDENTIALS.user));
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ isAdminLoggedIn: !!adminUser, adminUser, adminLogin, adminLogout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};
