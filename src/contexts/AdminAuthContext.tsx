import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
    const token = localStorage.getItem('adminToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token));
        if (payload.exp > Date.now()) {
          setAdminUser({ id: payload.sub, name: payload.name, email: payload.email, role: payload.role });
        } else {
          localStorage.removeItem('adminToken');
        }
      } catch {
        localStorage.removeItem('adminToken');
      }
    }
    setLoading(false);
  }, []);

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('admin_login', {
        p_email: email,
        p_password: password,
      });
      if (error || !data || data.error) return false;
      const result = data as any;
      localStorage.setItem('adminToken', result.token);
      setAdminUser(result.admin);
      return true;
    } catch {
      return false;
    }
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
