import { useState, useMemo } from 'react';
import AdminPagination from '@/components/admin/AdminPagination';
import { Search, Eye, X, Plus, Pencil, Trash2 } from 'lucide-react';
import { products, categories, subCategories, getCategoryName, addItem, updateItem, deleteItem } from '@/data/adminSharedData';
import { useAdminStore } from '@/hooks/useAdminStore';
import { toast } from 'sonner';
import type { Product } from '@/types';

const defaultProduct: Omit<Product, 'id'> = {
  name: '', slug: '', categoryId: '', subCategoryId: '', brandName: '',
  image: '/placeholder.svg', description: '', tags: [], weight: '',
  variants: [{ id: 'v1', name: 'Default', size: 'Standard', price: 0, mrp: 0 }],
  discount: 0, deliveryTime: '2-3 days',
};

const ProductManagement = () => {
  useAdminStore();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const filtered = useMemo(() =>
    products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())),
    [search, products.length]
  );

  const detail = selectedId ? products.find(p => p.id === selectedId) : null;

  const openAdd = () => {
    setEditId(null);
    setForm({ ...defaultProduct, variants: [{ id: `v-${Date.now()}`, name: 'Default', size: 'Standard', price: 0, mrp: 0 }] });
    setShowForm(true);
  };
  const openEdit = (p: Product) => {
    setEditId(p.id);
    setForm({ ...p });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name?.trim()) { toast.error('Product name is required'); return; }
    if (!form.slug?.trim()) form.slug = form.name.toLowerCase().replace(/\s+/g, '-');
    if (editId) {
      updateItem(products, editId, form);
      toast.success('Product updated');
    } else {
      addItem(products, form, 'prod');
      toast.success('Product added');
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    deleteItem(products, id);
    toast.success('Product deleted');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Products ({products.length})</h2>
        <button onClick={openAdd} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"><Plus className="h-4 w-4" /> Add Product</button>
      </div>
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
                      {p.discount > 0 ? <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">{p.discount}% OFF</span> : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => setSelectedId(p.id)} className="p-1.5 rounded hover:bg-muted transition-colors"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded hover:bg-muted transition-colors"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
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

      {/* Detail modal */}
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

      {/* Add/Edit form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{editId ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setShowForm(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block font-medium mb-1">Name *</label>
                <input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Slug</label>
                  <input value={form.slug || ''} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="auto" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="block font-medium mb-1">Category</label>
                  <select value={form.categoryId || ''} onChange={e => setForm({ ...form, categoryId: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">Select...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Brand Name</label>
                  <input value={form.brandName || ''} onChange={e => setForm({ ...form, brandName: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="block font-medium mb-1">Discount %</label>
                  <input type="number" value={form.discount ?? 0} onChange={e => setForm({ ...form, discount: Number(e.target.value) })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Description</label>
                <textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Weight</label>
                  <input value={form.weight || ''} onChange={e => setForm({ ...form, weight: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="block font-medium mb-1">Delivery Time</label>
                  <input value={form.deliveryTime || ''} onChange={e => setForm({ ...form, deliveryTime: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Image URL</label>
                <input value={form.image || ''} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block font-medium mb-1">Tags (comma-separated)</label>
                <input value={(form.tags || []).join(', ')} onChange={e => setForm({ ...form, tags: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean) })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              {/* Variant price quick-edit */}
              <div>
                <p className="font-medium mb-1">Default Variant Price</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Price</label>
                    <input type="number" value={form.variants?.[0]?.price ?? 0} onChange={e => { const v = [...(form.variants || [])]; v[0] = { ...v[0], price: Number(e.target.value) }; setForm({ ...form, variants: v }); }} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">MRP</label>
                    <input type="number" value={form.variants?.[0]?.mrp ?? 0} onChange={e => { const v = [...(form.variants || [])]; v[0] = { ...v[0], mrp: Number(e.target.value) }; setForm({ ...form, variants: v }); }} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleSave} className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">{editId ? 'Update' : 'Add'}</button>
                <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
