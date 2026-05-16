import { useState, useMemo } from 'react';
import { Search, AlertTriangle } from 'lucide-react';
import { useAdminInventory, useAdminMutation } from '@/hooks/useAdminData';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const LOW_STOCK_THRESHOLD = 10;

const StockManagement = () => {
  const { data: inventory = [], isLoading } = useAdminInventory();
  const { update } = useAdminMutation('inventory');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'low'>('all');

  const filtered = useMemo(() => {
    let list = inventory;
    if (filter === 'low') list = list.filter((s: any) => s.available_stock <= LOW_STOCK_THRESHOLD);
    if (search) list = list.filter((s: any) => {
      const productName = s.product_variants?.products?.title || '';
      const variantName = s.product_variants?.name || '';
      return productName.toLowerCase().includes(search.toLowerCase()) || variantName.toLowerCase().includes(search.toLowerCase());
    });
    return list;
  }, [inventory, search, filter]);

  const updateStock = (id: string, available_stock: number) => {
    update.mutate({ id, available_stock }, {
      onSuccess: () => toast.success('Stock updated'),
      onError: (e) => toast.error(e.message),
    });
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full" /></div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Stock Management</h2>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
            className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm" />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-sm font-medium border ${filter === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}>All</button>
          <button onClick={() => setFilter('low')} className={`px-4 py-2 rounded-lg text-sm font-medium border flex items-center gap-1 ${filter === 'low' ? 'bg-destructive text-destructive-foreground border-destructive' : 'border-border hover:bg-muted'}`}>
            <AlertTriangle className="h-3 w-3" /> Low Stock
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/50">
            <th className="text-left px-4 py-3 font-medium">Product</th>
            <th className="text-left px-4 py-3 font-medium">Variant</th>
            <th className="text-left px-4 py-3 font-medium">Available</th>
            <th className="text-left px-4 py-3 font-medium">Reserved</th>
            <th className="text-left px-4 py-3 font-medium">Damaged</th>
            <th className="text-left px-4 py-3 font-medium">Update</th>
          </tr></thead>
          <tbody>
            {filtered.map((s: any) => {
              const productName = s.product_variants?.products?.title || 'Unknown';
              const variantName = s.product_variants?.name || s.product_variants?.size || '—';
              const isLow = s.available_stock <= LOW_STOCK_THRESHOLD;
              return (
                <tr key={s.id} className={`border-b border-border ${isLow ? 'bg-destructive/5' : 'hover:bg-muted/30'}`}>
                  <td className="px-4 py-3 font-medium max-w-[200px] truncate">{productName}</td>
                  <td className="px-4 py-3">{variantName}</td>
                  <td className="px-4 py-3">
                    {isLow && <AlertTriangle className="h-3 w-3 text-destructive inline mr-1" />}
                    {s.available_stock}
                  </td>
                  <td className="px-4 py-3">{s.reserved_stock}</td>
                  <td className="px-4 py-3">{s.damaged_stock}</td>
                  <td className="px-4 py-3">
                    <input type="number" defaultValue={s.available_stock} min={0}
                      onBlur={e => {
                        const v = Number(e.target.value);
                        if (v !== s.available_stock) updateStock(s.id, v);
                      }}
                      className="w-20 rounded border border-border px-2 py-1 text-sm" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No inventory records</p>}
      </div>
    </div>
  );
};

export default StockManagement;
