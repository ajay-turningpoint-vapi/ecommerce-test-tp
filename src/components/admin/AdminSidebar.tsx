import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingCart, Package, Layers, Warehouse,
  Users, Truck, RotateCcw, Image, BarChart3, Settings, LogOut, X,
  Tag, Bookmark, ChevronDown, Percent
} from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useState } from 'react';

const navGroups = [
  {
    label: null,
    items: [{ label: 'Dashboard', icon: LayoutDashboard, path: '/admin' }],
  },
  {
    label: 'Catalog',
    items: [
      { label: 'Categories', icon: Layers, path: '/admin/categories' },
      { label: 'Brands', icon: Bookmark, path: '/admin/brands' },
      { label: 'Attributes', icon: Tag, path: '/admin/attributes' },
      { label: 'Products', icon: Package, path: '/admin/products' },
    ],
  },
  {
    label: 'Orders & Fulfillment',
    items: [
      { label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
      { label: 'Shipping', icon: Truck, path: '/admin/shipping' },
      { label: 'Returns & Refunds', icon: RotateCcw, path: '/admin/returns' },
    ],
  },
  {
    label: 'Inventory',
    items: [{ label: 'Stock', icon: Warehouse, path: '/admin/stock' }],
  },
  {
    label: 'Marketing',
    items: [
      { label: 'Banners', icon: Image, path: '/admin/banners' },
      { label: 'Discounts', icon: Percent, path: '/admin/discounts' },
    ],
  },
  {
    label: 'People',
    items: [{ label: 'Customers', icon: Users, path: '/admin/customers' }],
  },
  {
    label: 'System',
    items: [
      { label: 'Reports', icon: BarChart3, path: '/admin/reports' },
      { label: 'Settings', icon: Settings, path: '/admin/settings' },
    ],
  },
];

interface Props { open: boolean; onClose: () => void; }

const AdminSidebar = ({ open, onClose }: Props) => {
  const { adminLogout } = useAdminAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleGroup = (label: string) => setCollapsed(c => ({ ...c, [label]: !c[label] }));

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <span className="font-bold text-lg text-primary">Super Beauty Admin</span>
          <button onClick={onClose} className="lg:hidden"><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex-1 overflow-y-auto py-2 px-3">
          {navGroups.map((group, gi) => (
            <div key={gi} className="mb-1">
              {group.label && (
                <button onClick={() => toggleGroup(group.label!)}
                  className="flex items-center justify-between w-full px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                  {group.label}
                  <ChevronDown className={`h-3 w-3 transition-transform ${collapsed[group.label] ? '-rotate-90' : ''}`} />
                </button>
              )}
              {!collapsed[group.label || ''] && group.items.map(item => (
                <NavLink
                  key={item.path} to={item.path} end={item.path === '/admin'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'}`
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <button onClick={adminLogout} className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
