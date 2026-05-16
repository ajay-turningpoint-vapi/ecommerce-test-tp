import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  const { isAdminLoggedIn } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAdminLoggedIn) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card px-4 py-3">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold truncate">Admin Panel</h1>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
