import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
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
import { Loader2 } from 'lucide-react';

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

  const loading = productsLoading || catsLoading;

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
    setActiveSub('all');
  }, [slug]);

  const filteredProducts = products.filter(p => {
    if (p.categoryId !== category?.id) return false;
    if (activeSub === 'all') return true;
    return p.subCategoryId === activeSub;
  });

  const hasMore = visibleCount < filteredProducts.length;

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredProducts.length));
      setLoadingMore(false);
    }, 300);
  }, [loadingMore, hasMore, filteredProducts.length]);

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

  const visibleProducts = filteredProducts.slice(0, visibleCount);

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

        <div className="flex gap-2 mt-4">
          <button className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium">
            ☰ Filters
          </button>
          <button className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" /> 30min delivery
          </button>
        </div>

        <p className="text-sm text-muted-foreground mt-3">{filteredProducts.length} items available</p>

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

        {!hasMore && !loading && filteredProducts.length > ITEMS_PER_PAGE && (
          <p className="text-center text-sm text-muted-foreground py-6">You've seen all {filteredProducts.length} products</p>
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
