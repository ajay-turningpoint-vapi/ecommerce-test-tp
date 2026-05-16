import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { useDbCategories } from '@/hooks/useDbCategories';
import CategorySkeleton from '@/components/skeletons/CategorySkeleton';

const Categories = () => {
  const { data, isLoading } = useDbCategories();
  const categories = data?.categories || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">All Categories</h1>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 hover:shadow-md transition-shadow"
              >
                {(cat as any).icon ? (
                  <img src={(cat as any).icon} alt={cat.name} className="h-16 w-16 object-contain rounded-lg" />
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
                    {cat.name.charAt(0)}
                  </div>
                )}
                <span className="text-sm font-medium text-center">{cat.name}</span>
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
