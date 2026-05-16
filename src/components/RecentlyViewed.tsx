import { useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { useDbProducts } from '@/hooks/useDbProducts';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

interface Props {
  excludeId?: string;
  limit?: number;
}

const RecentlyViewed = ({ excludeId, limit = 5 }: Props) => {
  const { recentIds } = useRecentlyViewed();
  const { data: products = [] } = useDbProducts();

  const items = useMemo(() => {
    return recentIds
      .filter(id => id !== excludeId)
      .map(id => products.find(p => p.id === id))
      .filter(Boolean)
      .slice(0, limit);
  }, [recentIds, products, excludeId, limit]);

  if (items.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold">Recently viewed</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
        {items.map(p => p && <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
};

export default RecentlyViewed;
