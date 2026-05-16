import { useMemo } from 'react';
import { getBanners } from '@/data/adminSharedData';

const BannerManagement = () => {
  const banners = useMemo(() => getBanners(), []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Banners & Promotions ({banners.length})</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {banners.map(b => (
          <div key={b.id} className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-sm transition-shadow">
            <div className="aspect-[16/7] bg-muted flex items-center justify-center">
              <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-sm">{b.title}</h4>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${b.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>
                  {b.isActive ? 'active' : 'inactive'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{b.type}</p>
            </div>
          </div>
        ))}
      </div>
      {banners.length === 0 && <p className="text-center text-muted-foreground py-8">No banners yet</p>}
    </div>
  );
};

export default BannerManagement;
