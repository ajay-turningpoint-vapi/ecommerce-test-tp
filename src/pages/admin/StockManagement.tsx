import { useState, useMemo } from 'react';
import { Search, AlertTriangle } from 'lucide-react';
import { generateMockStock, StockItem } from '@/data/adminMockData';
import { toast } from 'sonner';

const StockManagement = () => {
  const [stock, setStock] = useState<StockItem[]>(() => generateMockStock());
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'low'>('all');

  const filtered = useMemo(() => {
    let list = stock;
    if (filter === 'low') list = list.filter(s => s.currentStock <= s.lowStockThreshold);
    if (search) list = list.filter(s => s.productName.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [stock, search, filter]);

  const updateStock = (variantId: string, newStock: number) => {
    setStock(prev => prev.map(s => s.variantId === variantId ? { ...s, currentStock: newStock } : s));
    toast.success('Stock updated');
  };

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
            <th className="text-left px-4 py-3 font-medium">Current Stock</th>
            <th className="text-left px-4 py-3 font-medium">Reserved</th>
            <th className="text-left px-4 py-3 font-medium">Available</th>
            <th className="text-left px-4 py-3 font-medium">Update</th>
          </tr></thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.variantId} className={`border-b border-border ${s.currentStock <= s.lowStockThreshold ? 'bg-destructive/5' : 'hover:bg-muted/30'}`}>
                <td className="px-4 py-3 font-medium max-w-[200px] truncate">{s.productName}</td>
                <td className="px-4 py-3">{s.variantName}</td>
                <td className="px-4 py-3">
                  {s.currentStock <= s.lowStockThreshold && <AlertTriangle className="h-3 w-3 text-destructive inline mr-1" />}
                  {s.currentStock}
                </td>
                <td className="px-4 py-3">{s.reservedStock}</td>
                <td className="px-4 py-3 font-medium">{Math.max(0, s.currentStock - s.reservedStock)}</td>
                <td className="px-4 py-3">
                  <input type="number" defaultValue={s.currentStock} min={0}
                    onBlur={e => updateStock(s.variantId, Number(e.target.value))}
                    className="w-20 rounded border border-border px-2 py-1 text-sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockManagement;
