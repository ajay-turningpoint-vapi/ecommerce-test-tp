import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, ShoppingCart, User, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useDbCategories } from '@/hooks/useDbCategories';

const Header = () => {
  const { totalItems, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: catData } = useDbCategories();
  const categories = catData?.categories || [];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowCategories(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="text-2xl font-extrabold italic text-primary shrink-0">
          Super Beauty
        </Link>

        <div className="hidden md:flex items-center gap-1 text-sm shrink-0">
          <MapPin className="h-4 w-4 text-primary" />
          <div>
            <span className="font-semibold">Mumbai</span>
            <ChevronDown className="inline h-3 w-3 ml-0.5" />
            <p className="text-xs text-muted-foreground">Andheri West, Mum...</p>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-lg">
          <form className="relative w-full" onSubmit={e => { e.preventDefault(); if (search.trim()) navigate(`/search?q=${encodeURIComponent(search.trim())}`); }}>
            <input
              type="text"
              placeholder="Search for any beauty product..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
              <Search className="h-4 w-4 text-muted-foreground" />
            </button>
          </form>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="hidden md:flex items-center gap-1 text-sm font-medium"
            >
              Categories <ChevronDown className="h-3 w-3" />
            </button>
            {showCategories && (
              <div className="absolute right-0 top-8 w-56 rounded-lg border border-border bg-background shadow-lg p-2 z-50">
                {categories.slice(0, 10).map(cat => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className="block px-3 py-2 text-sm rounded-md hover:bg-accent"
                    onClick={() => setShowCategories(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to={user ? '/profile' : '/login'} className="hidden md:flex items-center gap-1 text-sm font-medium">
            <User className="h-4 w-4" />
            {user ? 'Profile' : 'Login'}
          </Link>

          <Link
            to="/cart"
            className="relative flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
          >
            <ShoppingCart className="h-4 w-4" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile search bar on second line */}
      <div className="md:hidden px-4 pb-3">
        <form className="relative" onSubmit={e => { e.preventDefault(); if (search.trim()) navigate(`/search?q=${encodeURIComponent(search.trim())}`); }}>
          <input
            type="text"
            placeholder="Search for any beauty product..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-4 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
            <Search className="h-4 w-4 text-muted-foreground" />
          </button>
        </form>
      </div>
    </header>
  );
};

export default Header;
