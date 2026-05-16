import { useState, useMemo, useCallback } from 'react';
import AdminPagination, { usePagination } from '@/components/admin/AdminPagination';
import { Search, AlertTriangle, Plus, X } from 'lucide-react';
import { store, addItem, updateItem, type InventoryItem } from '@/data/adminStore';
import { toast } from 'sonner';

const LOW_STOCK_THRESHOLD = 10;

const StockManagement = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([...store.inventory]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'low'>('all');
  const [showForm, setShowForm] = useState(false);

  const refresh = useCallback(() => setInventory([...store.inventory]), []);

  const filtered = useMemo(() => {
    let list = inventory;
    if (filter === 'low') list = list.filter(s => s.availableStock <= LOW_STOCK_THRESHOLD);
    if (search) list = list.filter(s => {
      const variant = store.variants.find(v => v.id === s.variantId);
      const product = variant ? store.products.find(p => p.id === variant.productId) : null;
      return (product?.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (variant?.sku || '').toLowerCase().includes(search.toLowerCase());
    });
    return list;
  }, [inventory, search, filter]);

  const updateStock = (id: string, availableStock: number) => {
    updateItem(store.inventory, id, { availableStock });
    toast.success('Stock updated');
    refresh();
  };

  const addInventory = (data: Omit<InventoryItem, 'id'>) => {
    addItem(store.inventory, data);
    toast.success('Inventory record added');
    refresh(); setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Inventory / Stock</h2>
          <p className="text-sm text-muted-foreground mt-1">Step 8 — Track stock at variant (SKU) level per warehouse</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Add Inventory
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by product or SKU..."
            className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${filter === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}>All ({inventory.length})</button>
          <button onClick={() => setFilter('low')}
            className={`px-4 py-2 rounded-lg text-sm font-medium border flex items-center gap-1 transition-colors ${filter === 'low' ? 'bg-destructive text-destructive-foreground border-destructive' : 'border-border hover:bg-muted'}`}>
            <AlertTriangle className="h-3 w-3" /> Low Stock ({inventory.filter(s => s.availableStock <= LOW_STOCK_THRESHOLD).length})
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/50">
            <th className="text-left px-4 py-3 font-medium">Product</th>
            <th className="text-left px-4 py-3 font-medium">SKU</th>
            <th className="text-left px-4 py-3 font-medium">Warehouse</th>
            <th className="text-left px-4 py-3 font-medium">Available</th>
            <th className="text-left px-4 py-3 font-medium">Reserved</th>
            <th className="text-left px-4 py-3 font-medium">Damaged</th>
            <th className="text-left px-4 py-3 font-medium">Update Stock</th>
          </tr></thead>
          <tbody>
            {filtered.map(s => {
              const variant = store.variants.find(v => v.id === s.variantId);
              const product = variant ? store.products.find(p => p.id === variant.productId) : null;
              const warehouse = store.warehouses.find(w => w.id === s.warehouseId);
              const isLow = s.availableStock <= LOW_STOCK_THRESHOLD;
              return (
                <tr key={s.id} className={`border-b border-border transition-colors ${isLow ? 'bg-destructive/5' : 'hover:bg-muted/30'}`}>
                  <td className="px-4 py-3 font-medium max-w-[200px] truncate">{product?.title || 'Unknown'}</td>
                  <td className="px-4 py-3 font-mono text-xs">{variant?.sku || '—'} <span className="text-muted-foreground">({variant?.name})</span></td>
                  <td className="px-4 py-3 text-muted-foreground">{warehouse?.name || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1">
                      {isLow && <AlertTriangle className="h-3 w-3 text-destructive" />}
                      <span className={isLow ? 'text-destructive font-bold' : ''}>{s.availableStock}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">{s.reservedStock}</td>
                  <td className="px-4 py-3">{s.damagedStock}</td>
                  <td className="px-4 py-3">
                    <input type="number" defaultValue={s.availableStock} min={0}
                      onBlur={e => { const v = Number(e.target.value); if (v !== s.availableStock) updateStock(s.id, v); }}
                      className="w-20 rounded border border-border px-2 py-1 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No inventory records</p>}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">Add Inventory</h3>
              <button onClick={() => setShowForm(false)}><X className="h-5 w-5" /></button>
            </div>
            <InventoryForm onSave={addInventory} />
          </div>
        </div>
      )}
    </div>
  );
};

const InventoryForm = ({ onSave }: { onSave: (d: any) => void }) => {
  const [variantId, setVariantId] = useState('');
  const [warehouseId, setWarehouseId] = useState(store.warehouses[0]?.id || '');
  const [stock, setStock] = useState(0);

  return (
    <form onSubmit={e => {
      e.preventDefault();
      if (!variantId || !warehouseId) { toast.error('Select variant and warehouse'); return; }
      onSave({ variantId, warehouseId, availableStock: stock, reservedStock: 0, damagedStock: 0 });
    }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5">Select Variant (SKU) *</label>
        <select value={variantId} onChange={e => setVariantId(e.target.value)} required
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm">
          <option value="">Choose variant...</option>
          {store.products.map(p => {
            const pvs = store.variants.filter(v => v.productId === p.id);
            return pvs.length > 0 ? (
              <optgroup key={p.id} label={p.title}>
                {pvs.map(v => <option key={v.id} value={v.id}>{v.sku} — {v.name}</option>)}
              </optgroup>
            ) : null;
          })}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Warehouse *</label>
        <select value={warehouseId} onChange={e => setWarehouseId(e.target.value)} required
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm">
          {store.warehouses.map(w => <option key={w.id} value={w.id}>{w.name} — {w.city}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Stock Quantity</label>
        <input type="number" value={stock} onChange={e => setStock(Number(e.target.value))} min={0}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm" />
      </div>
      <button type="submit" className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors">
        Add Inventory
      </button>
    </form>
  );
};

export default StockManagement;
