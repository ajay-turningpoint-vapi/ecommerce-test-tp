import { useMemo } from 'react';
import { products } from '@/data/adminSharedData';

interface BrandInfo {
  name: string;
  productCount: number;
  productNames: string[];
}

const BrandManagement = () => {
  const brands = useMemo(() => {
    const map = new Map<string, BrandInfo>();
    products.forEach(p => {
      const name = p.brandName || 'Unbranded';
      if (!map.has(name)) map.set(name, { name, productCount: 0, productNames: [] });
      const b = map.get(name)!;
      b.productCount++;
      b.productNames.push(p.name);
    });
    return Array.from(map.values()).sort((a, b) => b.productCount - a.productCount);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Brands ({brands.length})</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {brands.map(b => (
          <div key={b.name} className="rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow">
            <h4 className="font-semibold text-sm mb-1">{b.name}</h4>
            <p className="text-xs text-muted-foreground mb-2">{b.productCount} products</p>
            <div className="space-y-1">
              {b.productNames.slice(0, 3).map(n => (
                <p key={n} className="text-xs text-muted-foreground truncate">• {n}</p>
              ))}
              {b.productNames.length > 3 && (
                <p className="text-xs text-muted-foreground">+{b.productNames.length - 3} more</p>
              )}
            </div>
          </div>
        ))}
      </div>
      {brands.length === 0 && <p className="text-center text-muted-foreground py-8">No brands yet</p>}
    </div>
  );
};

export default BrandManagement;
