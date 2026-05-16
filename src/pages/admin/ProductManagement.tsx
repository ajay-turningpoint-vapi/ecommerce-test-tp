import { useState, useMemo } from 'react';
import AdminPagination from '@/components/admin/AdminPagination';
import { Search, Eye, X, Package } from 'lucide-react';
import { products, categories, subCategories, getCategoryName } from '@/data/adminSharedData';

const ProductManagement = () => {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const filtered = useMemo(() =>
    products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  const detail = selectedId ? products.find(p => p.id === selectedId) : null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Products ({products.length})</h2>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
          className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/50">
            <th className="text-left px-4 py-3 font-medium">Product</th>
            <th className="text-left px-4 py-3 font-medium">Category</th>
            <th className="text-left px-4 py-3 font-medium">Variants</th>
            <th className="text-left px-4 py-3 font-medium">Price Range</th>
            <th className="text-left px-4 py-3 font-medium">Discount</th>
            <th className="text-left px-4 py-3 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {(() => {
              const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
              const safePage = Math.min(page, totalPages);
              return filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE).map(p => {
                const prices = p.variants.map(v => v.price);
                const minP = Math.min(...prices);
                const maxP = Math.max(...prices);
                return (
                  <tr key={p.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover bg-muted" />
                        <div>
                          <p className="font-medium max-w-[200px] truncate">{p.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">/{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{getCategoryName(p.categoryId)}</td>
                    <td className="px-4 py-3">{p.variants.length}</td>
                    <td className="px-4 py-3">₹{minP}{maxP !== minP ? ` – ₹${maxP}` : ''}</td>
                    <td className="px-4 py-3">
                      {p.discount > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">{p.discount}% OFF</span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelectedId(p.id)} className="p-1.5 rounded hover:bg-muted transition-colors"><Eye className="h-4 w-4" /></button>
                    </td>
                  </tr>
                );
              });
            })()}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No products found</p>}
        <AdminPagination currentPage={page} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{detail.name}</h3>
              <button onClick={() => setSelectedId(null)}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4 text-sm">
              <img src={detail.image} alt={detail.name} className="w-full h-48 object-cover rounded-lg" />
              <p className="text-muted-foreground">{detail.description}</p>
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-muted-foreground">Category:</span> {getCategoryName(detail.categoryId)}</div>
                <div><span className="text-muted-foreground">Weight:</span> {detail.weight}</div>
                <div><span className="text-muted-foreground">Discount:</span> {detail.discount}%</div>
                <div><span className="text-muted-foreground">Delivery:</span> {detail.deliveryTime}</div>
              </div>
              {detail.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {detail.tags.map(t => <span key={t} className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium">{t}</span>)}
                </div>
              )}
              <div>
                <p className="font-medium mb-2">Variants</p>
                {detail.variants.map(v => (
                  <div key={v.id} className="flex justify-between py-1 border-b border-border last:border-0">
                    <span>{v.name} ({v.size})</span>
                    <span>₹{v.price} <span className="text-muted-foreground line-through text-xs">₹{v.mrp}</span></span>
                  </div>
                ))}
              </div>
              {detail.ingredients && <div><span className="font-medium">Ingredients:</span> {detail.ingredients}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
