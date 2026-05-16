import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { useDbCategories } from '@/hooks/useDbCategories';
import CategorySkeleton from '@/components/skeletons/CategorySkeleton';
import BannerSlider from '@/components/banners/BannerSlider';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const Categories = () => {
  const { data, isLoading } = useDbCategories();
  const categories = data?.categories || [];

  const { data: banners = [], isLoading: bannersLoading } = useQuery({
    queryKey: ['banners-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('status', 'active')
        .order('position');
      if (error) throw error;
      return (data || []).map(b => ({ image: b.image_url, alt: b.title, link: b.link || undefined }));
    },
    staleTime: 10 * 60 * 1000,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-4 space-y-6">
        {bannersLoading ? (
          <Skeleton className="w-full h-40 md:h-56 rounded-xl" />
        ) : banners.length > 0 ? (
          <BannerSlider banners={banners} />
        ) : null}

        <h1 className="text-xl font-bold">Shop by Category</h1>

        {isLoading ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-3 hover:shadow-md transition-shadow"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  decoding="async"
                  width={80}
                  height={80}
                  sizes="80px"
                  className="h-16 w-16 md:h-20 md:w-20 object-cover rounded-full"
                />
                <span className="text-xs md:text-sm font-medium text-center leading-tight">{cat.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Categories;
