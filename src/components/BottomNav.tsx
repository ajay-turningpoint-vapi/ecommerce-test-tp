import { Link, useLocation } from 'react-router-dom';
import { Home, Grid3X3, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const BottomNav = () => {
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) return null;
  const { totalItems } = useCart();
  const { user } = useAuth();

  const tabs = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/categories', icon: Grid3X3, label: 'Categories' },
    { to: '/cart', icon: ShoppingCart, label: 'Cart', badge: totalItems },
    { to: user ? '/profile' : '/login', icon: User, label: user ? 'Profile' : 'Login' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background md:hidden">
      <div className="flex items-center justify-around py-2">
        {tabs.map(({ to, icon: Icon, label, badge }) => (
          <Link
            key={label}
            to={to}
            className={cn(
              'flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium transition-colors',
              isActive(to) ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <div className="relative">
              <Icon className="h-5 w-5" />
              {badge != null && badge > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                  {badge}
                </span>
              )}
            </div>
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
