import { useSearchParams, Link } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/skeletons/ProductCardSkeleton';
import { useDbProducts } from '@/hooks/useDbProducts';
import { Loader2, SlidersHorizontal, X, Check, ArrowUpDown, SearchX } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const ITEMS_PER_PAGE = 8;

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { data: products = [], isLoading: loading } = useDbProducts();

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [loadingMore, setLoadingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [sortOrder, setSortOrder] = useState<'none' | 'low-high' | 'high-low'>('none');
  const [filterOpen, setFilterOpen] = useState(false);

  // Reset on query change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
    setActiveFilters({});
    setSortOrder('none');
  }, [query]);

  // Search-matched products
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.brandName?.toLowerCase().includes(q) ||
      p.tags?.some(t => t.toLowerCase().includes(q))
    );
  }, [products, query]);

  // Available filter attributes from search results
  const availableAttributes = useMemo(() => {
    const attrMap: Record<string, Set<string>> = {};
    searchResults.forEach(p => {
      if (p.variantAttributes) {
        Object.values(p.variantAttributes).forEach(attrs => {
          attrs.forEach(a => {
            if (!attrMap[a.name]) attrMap[a.name] = new Set();
            attrMap[a.name].add(a.value);
          });
        });
      }
    });
    const brands = new Set<string>();
    searchResults.forEach(p => { if (p.brandName) brands.add(p.brandName); });
    if (brands.size > 1) attrMap['Brand'] = brands;

    return Object.entries(attrMap)
      .filter(([, values]) => values.size > 0)
      .map(([name, values]) => ({ name, values: Array.from(values).sort() }));
  }, [searchResults]);

  // Apply attribute filters
  const filteredProducts = useMemo(() => {
    const activeKeys = Object.entries(activeFilters).filter(([, vals]) => vals.length > 0);
    if (activeKeys.length === 0) return searchResults;

    return searchResults.filter(p =>
      activeKeys.every(([attrName, selectedValues]) => {
        if (attrName === 'Brand') {
          return p.brandName ? selectedValues.includes(p.brandName) : false;
        }
        if (!p.variantAttributes) return false;
        return Object.values(p.variantAttributes).some(attrs =>
          attrs.some(a => a.name === attrName && selectedValues.includes(a.value))
        );
      })
    );
  }, [searchResults, activeFilters]);

  // Sort
  const sortedProducts = useMemo(() => {
    if (sortOrder === 'none') return filteredProducts;
    return [...filteredProducts].sort((a, b) => {
      const getMinPrice = (p: typeof a) => {
        const prices = p.variants.map(v => v.price);
        return prices.length > 0 ? Math.min(...prices) : 0;
      };
      return sortOrder === 'low-high'
        ? getMinPrice(a) - getMinPrice(b)
        : getMinPrice(b) - getMinPrice(a);
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
    setSortOrder('none');
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
        if (entries[0].isIntersecting && hasMore && !loading) loadMore();
      },
      { threshold: 0.1 }
    );
    const el = loaderRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [hasMore, loading, loadMore]);

  const visibleProducts = sortedProducts.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-2">
          <Link to="/" className="hover:text-primary">Home</Link> / <span className="text-primary">Search</span>
        </div>

        <h1 className="text-xl font-bold">
          {query ? <>Results for "<span className="text-primary">{query}</span>"</> : 'Search Products'}
        </h1>

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
                {(activeFilterCount > 0 || sortOrder !== 'none') && (
                  <button onClick={clearFilters} className="text-xs text-primary font-medium">Clear all</button>
                )}
              </SheetHeader>
              <div className="mt-4 space-y-5 overflow-y-auto max-h-[55vh] pb-4">
                {/* Sort */}
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                    <ArrowUpDown className="h-3.5 w-3.5" /> Sort by Price
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {([['none', 'Default'], ['low-high', 'Low to High'], ['high-low', 'High to Low']] as const).map(([val, label]) => {
                      const isActive = sortOrder === val;
                      return (
                        <button
                          key={val}
                          onClick={() => { setSortOrder(val); setVisibleCount(ITEMS_PER_PAGE); }}
                          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                            isActive ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-muted'
                          }`}
                        >
                          {isActive && <Check className="h-3 w-3" />}
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Attribute filters */}
                {availableAttributes.length === 0 && sortOrder === 'none' && (
                  <p className="text-sm text-muted-foreground text-center py-6">No filters available</p>
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
                              isActive ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-muted'
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

          {sortOrder !== 'none' && (
            <span className="flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-1 text-xs font-medium text-primary">
              <ArrowUpDown className="h-3 w-3" />
              Price: {sortOrder === 'low-high' ? 'Low → High' : 'High → Low'}
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground mt-3">{sortedProducts.length} items found</p>

        {/* Products grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {loading
            ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => <ProductCardSkeleton key={i} />)
            : visibleProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>

        {/* Infinite scroll loader */}
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

        {/* Empty states */}
        {!loading && query && sortedProducts.length === 0 && activeFilterCount === 0 && (
          <div className="text-center py-16">
            <SearchX className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-lg font-semibold">No products found</p>
            <p className="text-sm text-muted-foreground mt-1">Try a different search term</p>
          </div>
        )}

        {!loading && sortedProducts.length === 0 && activeFilterCount > 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products match the selected filters</p>
            <button onClick={clearFilters} className="text-primary text-sm font-medium mt-2">Clear filters</button>
          </div>
        )}

        {!loading && !query && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Enter a search term to find products</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Search;
