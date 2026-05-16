import { useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { store, addItem, updateItem, deleteItem, type Brand } from '@/data/adminStore';
import { toast } from 'sonner';

const BrandManagement = () => {
  const [brands, setBrands] = useState<Brand[]>([...store.brands]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);

  const refresh = useCallback(() => setBrands([...store.brands]), []);

  const save = (data: Omit<Brand, 'id'>) => {
    if (editing) {
      updateItem(store.brands, editing.id, data);
      toast.success('Brand updated');
    } else {
      addItem(store.brands, data);
      toast.success('Brand created');
    }
    refresh(); setShowForm(false); setEditing(null);
  };

  const remove = (id: string) => {
    const hasProducts = store.products.some(p => p.brandId === id);
    if (hasProducts) { toast.error('Remove products using this brand first'); return; }
    deleteItem(store.brands, id);
    toast.success('Brand deleted');
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Brands</h2>
          <p className="text-sm text-muted-foreground mt-1">Step 2 — Brands must exist before product creation</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Add Brand
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {brands.map(b => {
          const productCount = store.products.filter(p => p.brandId === b.id).length;
          return (
            <div key={b.id} className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-sm transition-shadow">
              <div className="aspect-[3/1] bg-muted flex items-center justify-center border-b border-border">
                <img src={b.logo} alt={b.name} className="h-10 w-10 object-contain opacity-50" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-semibold text-sm">{b.name}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${b.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>
                    {b.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1 font-mono">/{b.slug}</p>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{b.description}</p>
                <p className="text-xs text-muted-foreground">{productCount} products</p>
                <div className="flex gap-1 mt-3 pt-3 border-t border-border">
                  <button onClick={() => { setEditing(b); setShowForm(true); }}
                    className="flex items-center gap-1 px-2 py-1 rounded text-xs hover:bg-muted transition-colors">
                    <Edit2 className="h-3 w-3" /> Edit
                  </button>
                  <button onClick={() => remove(b.id)}
                    className="flex items-center gap-1 px-2 py-1 rounded text-xs hover:bg-destructive/10 text-destructive transition-colors">
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {brands.length === 0 && <p className="text-center text-muted-foreground py-8">No brands yet</p>}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">{editing ? 'Edit Brand' : 'Add Brand'}</h3>
              <button onClick={() => { setShowForm(false); setEditing(null); }}
                className="p-1 rounded hover:bg-muted transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <BrandForm initial={editing} onSave={save} />
          </div>
        </div>
      )}
    </div>
  );
};

const BrandForm = ({ initial, onSave }: { initial: Brand | null; onSave: (d: Omit<Brand, 'id'>) => void }) => {
  const [name, setName] = useState(initial?.name || '');
  const [slug, setSlug] = useState(initial?.slug || '');
  const [logo, setLogo] = useState(initial?.logo || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [status, setStatus] = useState<'active' | 'inactive'>(initial?.status || 'active');

  const autoSlug = (val: string) => val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return (
    <form onSubmit={e => {
      e.preventDefault();
      if (!name) { toast.error('Brand name is required'); return; }
      onSave({ name, slug: slug || autoSlug(name), logo: logo || '/placeholder.svg', description, status });
    }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5">Brand Name *</label>
        <input value={name} onChange={e => { setName(e.target.value); if (!initial) setSlug(autoSlug(e.target.value)); }}
          placeholder="e.g. Lakmé" className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Slug</label>
        <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="auto-generated"
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Logo URL</label>
        <input value={logo} onChange={e => setLogo(e.target.value)} placeholder="/placeholder.svg"
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brand description..."
          rows={3} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors resize-none" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Status</label>
        <select value={status} onChange={e => setStatus(e.target.value as 'active' | 'inactive')}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <button type="submit"
        className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors mt-2">
        {initial ? 'Update Brand' : 'Create Brand'}
      </button>
    </form>
  );
};

export default BrandManagement;
