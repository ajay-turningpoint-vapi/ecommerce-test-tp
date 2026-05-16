import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { products, addItem, updateItem, deleteItem } from '@/data/adminSharedData';
import { useAdminStore } from '@/hooks/useAdminStore';
import { toast } from 'sonner';

interface BrandInfo {
  name: string;
  productCount: number;
  productNames: string[];
}

const BrandManagement = () => {
  useAdminStore();
  const [showForm, setShowForm] = useState(false);
  const [editName, setEditName] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '' });

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
  }, [products.length]);

  const openAdd = () => { setEditName(null); setForm({ name: '' }); setShowForm(true); };
  const openEdit = (name: string) => { setEditName(name); setForm({ name }); setShowForm(true); };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error('Brand name is required'); return; }
    if (editName) {
      // Rename brand across all products
      products.forEach(p => { if (p.brandName === editName) p.brandName = form.name; });
      toast.success('Brand renamed');
    } else {
      // Just track — brands are derived from products
      toast.success(`Brand "${form.name}" noted. Assign it to products to see it listed.`);
    }
    setShowForm(false);
  };

  const handleDelete = (brandName: string) => {
    products.forEach(p => { if (p.brandName === brandName) p.brandName = undefined; });
    toast.success('Brand removed from products');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Brands ({brands.length})</h2>
        <button onClick={openAdd} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"><Plus className="h-4 w-4" /> Add Brand</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {brands.map(b => (
          <div key={b.name} className="rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-sm">{b.name}</h4>
              {b.name !== 'Unbranded' && (
                <div className="flex gap-1">
                  <button onClick={() => openEdit(b.name)} className="p-1 rounded hover:bg-muted"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={() => handleDelete(b.name)} className="p-1 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-2">{b.productCount} products</p>
            <div className="space-y-1">
              {b.productNames.slice(0, 3).map(n => (
                <p key={n} className="text-xs text-muted-foreground truncate">• {n}</p>
              ))}
              {b.productNames.length > 3 && <p className="text-xs text-muted-foreground">+{b.productNames.length - 3} more</p>}
            </div>
          </div>
        ))}
      </div>
      {brands.length === 0 && <p className="text-center text-muted-foreground py-8">No brands yet</p>}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-sm p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{editName ? 'Rename Brand' : 'Add Brand'}</h3>
              <button onClick={() => setShowForm(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Brand Name</label>
                <input value={form.name} onChange={e => setForm({ name: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleSave} className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">{editName ? 'Update' : 'Add'}</button>
                <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandManagement;
