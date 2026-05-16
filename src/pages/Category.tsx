import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import PromoBanner from '@/components/banners/PromoBanner';
import BannerSlider from '@/components/banners/BannerSlider';
import ProductCardSkeleton from '@/components/skeletons/ProductCardSkeleton';
import BannerSkeleton from '@/components/skeletons/BannerSkeleton';
import { useDbProducts } from '@/hooks/useDbProducts';
import { useDbCategories } from '@/hooks/useDbCategories';
import sale50 from '@/assets/banners/sale-50-off.jpg';
import glowUp from '@/assets/banners/glow-up-sale.jpg';
import hairCare from '@/assets/banners/hair-care-week.jpg';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, SlidersHorizontal, X, Check, ArrowUpDown } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const ITEMS_PER_PAGE = 8;

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: products = [], isLoading: productsLoading } = useDbProducts();
  const { data: catData, isLoading: catsLoading } = useDbCategories();
  const categories = catData?.categories || [];
  const subCategories = catData?.subCategories || [];

  const category = categories.find(c => c.slug === slug);
  const subs = subCategories.filter(s => s.categoryId === category?.id);
  const [activeSub, setActiveSub] = useState('all');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [loadingMore, setLoadingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [sortOrder, setSortOrder] = useState<'none' | 'low-high' | 'high-low'>('none');
  const [filterOpen, setFilterOpen] = useState(false);

  const loading = productsLoading || catsLoading;

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
    setActiveSub('all');
    setActiveFilters({});
    setSortOrder('none');
  }, [slug]);

  // Products in this category (before attribute filters)
  const categoryProducts = products.filter(p => {
    if (p.categoryId !== category?.id) return false;
    if (activeSub === 'all') return true;
    return p.subCategoryId === activeSub;
  });

  // Extract available attributes & values from category products
  const availableAttributes = useMemo(() => {
    const attrMap: Record<string, Set<string>> = {};
    categoryProducts.forEach(p => {
      if (!p.variantAttributes) return;
      Object.values(p.variantAttributes).forEach(attrs => {
        attrs.forEach(a => {
          if (!attrMap[a.name]) attrMap[a.name] = new Set();
          attrMap[a.name].add(a.value);
        });
      });
    });
    // Also collect brand names as a filterable attribute
    const brands = new Set<string>();
    categoryProducts.forEach(p => { if (p.brandName) brands.add(p.brandName); });
    if (brands.size > 1) attrMap['Brand'] = brands;

    return Object.entries(attrMap)
      .filter(([, values]) => values.size > 0)
      .map(([name, values]) => ({ name, values: Array.from(values).sort() }));
  }, [categoryProducts]);

  // Apply attribute filters
  const filteredProducts = useMemo(() => {
    const activeKeys = Object.entries(activeFilters).filter(([, vals]) => vals.length > 0);
    if (activeKeys.length === 0) return categoryProducts;

    return categoryProducts.filter(p => {
      return activeKeys.every(([attrName, selectedValues]) => {
        // Brand filter
        if (attrName === 'Brand') {
          return p.brandName ? selectedValues.includes(p.brandName) : false;
        }
        // Variant attribute filter — product matches if ANY variant has a matching value
        if (!p.variantAttributes) return false;
        return Object.values(p.variantAttributes).some(attrs =>
          attrs.some(a => a.name === attrName && selectedValues.includes(a.value))
        );
      });
    });
  }, [categoryProducts, activeFilters]);

  // Sort products
  const sortedProducts = useMemo(() => {
    if (sortOrder === 'none') return filteredProducts;
    return [...filteredProducts].sort((a, b) => {
      const getMinPrice = (p: typeof a) => {
        const prices = p.variants.map(v => v.price);
        return prices.length > 0 ? Math.min(...prices) : 0;
      };
      const priceA = getMinPrice(a);
      const priceB = getMinPrice(b);
      return sortOrder === 'low-high' ? priceA - priceB : priceB - priceA;
    });
  }, [filteredProducts, sortOrder]);

  const activeFilterCount = Object.values(activeFilters).reduce((sum, v) => sum + v.length, 0);

  const toggleFilter = (attrName: string, value: string) => {
    setActiveFilters(prev => {
      const current = prev[attrName] || [];
      const next = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [attrName]: next };
    });
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const clearFilters = () => {
    setActiveFilters({});
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const hasMore = visibleCount < sortedProducts.length;

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + ITEMS_PER_PAGE, sortedProducts.length));
      setLoadingMore(false);
    }, 300);
  }, [loadingMore, hasMore, sortedProducts.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );
    const el = loaderRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [hasMore, loading, loadMore]);

  if (!loading && !category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Category not found</h1>
          <Link to="/" className="text-primary mt-4 inline-block">Go Home</Link>
        </div>
      </div>
    );
  }

  const categoryBanners = [
    { image: sale50, alt: '50% Off Sale' },
    { image: glowUp, alt: 'Glow Up Sale' },
    { image: hairCare, alt: 'Hair Care Essentials' },
  ];

  const visibleProducts = sortedProducts.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-4">
        <div className="text-sm text-muted-foreground mb-2">
          <Link to="/" className="hover:text-primary">Home</Link> / <span className="text-primary">{category?.name || slug}</span>
        </div>

        {loading ? <BannerSkeleton variant="hero" className="mb-4" /> : <BannerSlider banners={categoryBanners} className="mb-4" />}

        <h1 className="text-xl font-bold">{category?.name}</h1>

        {subs.length > 0 && (
          <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 shrink-0">
                    <Skeleton className="w-14 h-14 rounded-full" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                ))
              : subs.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSub(sub.slug === 'all' ? 'all' : sub.id)}
                    className={`flex flex-col items-center gap-1 shrink-0 ${
                      (sub.slug === 'all' && activeSub === 'all') || activeSub === sub.id
                        ? 'opacity-100'
                        : 'opacity-60 hover:opacity-80'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-full overflow-hidden border-2 ${
                      (sub.slug === 'all' && activeSub === 'all') || activeSub === sub.id
                        ? 'border-primary'
                        : 'border-border'
                    }`}>
                      <img src={sub.image} alt={sub.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-medium">{sub.name}</span>
                  </button>
                ))}
          </div>
        )}

        {/* Filter bar */}
        <div className="flex gap-2 mt-4 flex-wrap">
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild>
              <button className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[75vh] rounded-t-2xl">
              <SheetHeader className="flex flex-row items-center justify-between pr-2">
                <SheetTitle>Filters</SheetTitle>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-primary font-medium">
                    Clear all
                  </button>
                )}
              </SheetHeader>
              <div className="mt-4 space-y-5 overflow-y-auto max-h-[55vh] pb-4">
                {/* Sort options */}
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5"><ArrowUpDown className="h-3.5 w-3.5" /> Sort by Price</h4>
                  <div className="flex flex-wrap gap-2">
                    {([['none', 'Default'], ['low-high', 'Low to High'], ['high-low', 'High to Low']] as const).map(([val, label]) => {
                      const isActive = sortOrder === val;
                      return (
                        <button
                          key={val}
                          onClick={() => { setSortOrder(val); setVisibleCount(ITEMS_PER_PAGE); }}
                          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                            isActive
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:bg-muted'
                          }`}
                        >
                          {isActive && <Check className="h-3 w-3" />}
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {availableAttributes.length === 0 && sortOrder === 'none' && (
                  <p className="text-sm text-muted-foreground text-center py-6">No filters available for this category</p>
                )}
                {availableAttributes.map(attr => (
                  <div key={attr.name}>
                    <h4 className="text-sm font-semibold mb-2">{attr.name}</h4>
                    <div className="flex flex-wrap gap-2">
                      {attr.values.map(val => {
                        const isActive = (activeFilters[attr.name] || []).includes(val);
                        return (
                          <button
                            key={val}
                            onClick={() => toggleFilter(attr.name, val)}
                            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                              isActive
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border hover:bg-muted'
                            }`}
                          >
                            {isActive && <Check className="h-3 w-3" />}
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {(activeFilterCount > 0 || sortOrder !== 'none') && (
                <button
                  onClick={() => setFilterOpen(false)}
                  className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground mt-2"
                >
                  Show {sortedProducts.length} results
                </button>
              )}
            </SheetContent>
          </Sheet>

          {/* Active filter chips */}
          {Object.entries(activeFilters).map(([attrName, values]) =>
            values.map(val => (
              <button
                key={`${attrName}-${val}`}
                onClick={() => toggleFilter(attrName, val)}
                className="flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-1 text-xs font-medium text-primary"
              >
                {val}
                <X className="h-3 w-3" />
              </button>
            ))
          )}

          <button className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" /> 30min delivery
          </button>
        </div>

        <p className="text-sm text-muted-foreground mt-3">{sortedProducts.length} items available</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {loading
            ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => <ProductCardSkeleton key={i} />)
            : visibleProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>

        {hasMore && !loading && (
          <div ref={loaderRef} className="flex justify-center py-8">
            {loadingMore && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading more...
              </div>
            )}
          </div>
        )}

        {!hasMore && !loading && sortedProducts.length > ITEMS_PER_PAGE && (
          <p className="text-center text-sm text-muted-foreground py-6">You've seen all {sortedProducts.length} products</p>
        )}

        {!loading && sortedProducts.length === 0 && activeFilterCount > 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products match the selected filters</p>
            <button onClick={clearFilters} className="text-primary text-sm font-medium mt-2">Clear filters</button>
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-lg font-bold italic">Recommended for you</h2>
          <p className="text-sm text-muted-foreground">You might also like these</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : products.filter(p => p.categoryId !== category?.id).slice(0, 4).map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Category;
