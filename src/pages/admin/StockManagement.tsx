import { useState, useMemo } from 'react';
import AdminPagination from '@/components/admin/AdminPagination';
import { Search, AlertTriangle } from 'lucide-react';
import { getStock } from '@/data/adminSharedData';

const LOW_STOCK_THRESHOLD = 10;

const StockManagement = () => {
  const stock = useMemo(() => getStock(), []);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'low'>('all');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const filtered = useMemo(() => {
    let list = stock;
    if (filter === 'low') list = list.filter(s => s.currentStock <= LOW_STOCK_THRESHOLD);
    if (search) list = list.filter(s =>
      s.productName.toLowerCase().includes(search.toLowerCase()) ||
      s.variantName.toLowerCase().includes(search.toLowerCase())
    );
    return list;
  }, [stock, search, filter]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Inventory / Stock</h2>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by product or variant..."
            className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${filter === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}>All ({stock.length})</button>
          <button onClick={() => setFilter('low')}
            className={`px-4 py-2 rounded-lg text-sm font-medium border flex items-center gap-1 transition-colors ${filter === 'low' ? 'bg-destructive text-destructive-foreground border-destructive' : 'border-border hover:bg-muted'}`}>
            <AlertTriangle className="h-3 w-3" /> Low Stock ({stock.filter(s => s.currentStock <= LOW_STOCK_THRESHOLD).length})
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
          </tr></thead>
          <tbody>
            {(() => {
              const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
              const safePage = Math.min(page, totalPages);
              return filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE).map(s => {
              const isLow = s.currentStock <= LOW_STOCK_THRESHOLD;
              return (
                <tr key={s.variantId} className={`border-b border-border transition-colors ${isLow ? 'bg-destructive/5' : 'hover:bg-muted/30'}`}>
                  <td className="px-4 py-3 font-medium max-w-[200px] truncate">{s.productName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.variantName}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1">
                      {isLow && <AlertTriangle className="h-3 w-3 text-destructive" />}
                      <span className={isLow ? 'text-destructive font-bold' : ''}>{s.currentStock}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">{s.reservedStock}</td>
                </tr>
              );
            });})()}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No inventory records</p>}
        <AdminPagination currentPage={page} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default StockManagement;
