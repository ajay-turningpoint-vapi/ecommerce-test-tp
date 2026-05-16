import { useState, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useAdminProducts, useAdminCategories, useAdminMutation } from '@/hooks/useAdminData';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const ProductManagement = () => {
  const { data: products = [], isLoading } = useAdminProducts();
  const { data: categories = [] } = useAdminCategories();
  const { create, update, remove } = useAdminMutation('products');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const filtered = useMemo(() =>
    products.filter((p: any) => p.title.toLowerCase().includes(search.toLowerCase())),
    [products, search]
  );

  const deleteProduct = (id: string) => {
    remove.mutate(id, { onSuccess: () => toast.success('Product deleted') });
  };

  const saveProduct = (formData: any) => {
    if (editing) {
      update.mutate({ id: editing.id, ...formData }, {
        onSuccess: () => { toast.success('Product updated'); setShowForm(false); setEditing(null); },
        onError: (e) => toast.error(e.message),
      });
    } else {
      create.mutate(formData, {
        onSuccess: () => { toast.success('Product added'); setShowForm(false); },
        onError: (e) => toast.error(e.message),
      });
    }
  };

  const getCategoryName = (catId: string) => {
    const cat = categories.find((c: any) => c.id === catId);
    return cat?.name || '—';
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Products</h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
          className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm" />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/50">
            <th className="text-left px-4 py-3 font-medium">Name</th>
            <th className="text-left px-4 py-3 font-medium">Category</th>
            <th className="text-left px-4 py-3 font-medium">Variants</th>
            <th className="text-left px-4 py-3 font-medium">Price</th>
            <th className="text-left px-4 py-3 font-medium">Status</th>
            <th className="text-left px-4 py-3 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map((p: any) => (
              <tr key={p.id} className="border-b border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-medium max-w-[200px] truncate">{p.title}</td>
                <td className="px-4 py-3">{getCategoryName(p.category_id)}</td>
                <td className="px-4 py-3">{p.product_variants?.length || 0}</td>
                <td className="px-4 py-3">₹{p.product_variants?.[0]?.price || 0}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'}`}>{p.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => { setEditing(p); setShowForm(true); }} className="p-1.5 rounded hover:bg-muted"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => deleteProduct(p.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No products found</p>}
      </div>

      {showForm && <ProductForm product={editing} categories={categories} onSave={saveProduct} onClose={() => { setShowForm(false); setEditing(null); }} />}
    </div>
  );
};

const ProductForm = ({ product, categories, onSave, onClose }: { product: any; categories: any[]; onSave: (d: any) => void; onClose: () => void }) => {
  const [form, setForm] = useState({
    title: product?.title || '',
    slug: product?.slug || '',
    category_id: product?.category_id || '',
    description: product?.description || '',
    weight: product?.weight || '',
    discount: product?.discount || 0,
    delivery_time: product?.delivery_time || '30 mins',
    status: product?.status || 'active',
  });
  const [variants, setVariants] = useState<any[]>(
    product?.product_variants?.length ? product.product_variants : [{ name: '', size: '', price: 0, mrp: 0, sku: '' }]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.category_id) { toast.error('Name and category required'); return; }
    const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-');
    const vData = variants.map((v: any, i: number) => ({
      ...(v.id ? { id: v.id } : {}),
      name: v.name,
      size: v.size,
      price: Number(v.price),
      mrp: Number(v.mrp) || null,
      sku: v.sku || `${slug}-v${i + 1}`,
      is_default: i === 0,
    }));
    onSave({ ...form, slug, discount: Number(form.discount), variants: vData });
  };

  const parentCats = categories.filter((c: any) => c.level === 0);
  const subCats = categories.filter((c: any) => c.level === 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card rounded-xl border border-border w-full max-w-lg max-h-[80vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">{product ? 'Edit Product' : 'Add Product'}</h3>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Product Name"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
          <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm">
            <option value="">Select Category</option>
            {parentCats.map((c: any) => (
              <optgroup key={c.id} label={c.name}>
                {subCats.filter((s: any) => s.parent_id === c.id).map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm" rows={3} />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.weight || ''} onChange={e => setForm({ ...form, weight: e.target.value })} placeholder="Weight" className="rounded-lg border border-border px-3 py-2 text-sm" />
            <input type="number" value={form.discount} onChange={e => setForm({ ...form, discount: Number(e.target.value) })} placeholder="Discount %" className="rounded-lg border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Variants</p>
            {variants.map((v: any, i: number) => (
              <div key={i} className="grid grid-cols-4 gap-2 mb-2">
                <input value={v.name || ''} onChange={e => { const vs = [...variants]; vs[i] = { ...vs[i], name: e.target.value }; setVariants(vs); }} placeholder="Name" className="rounded border border-border px-2 py-1 text-sm" />
                <input value={v.size || ''} onChange={e => { const vs = [...variants]; vs[i] = { ...vs[i], size: e.target.value }; setVariants(vs); }} placeholder="Size" className="rounded border border-border px-2 py-1 text-sm" />
                <input type="number" value={v.price} onChange={e => { const vs = [...variants]; vs[i] = { ...vs[i], price: e.target.value }; setVariants(vs); }} placeholder="Price" className="rounded border border-border px-2 py-1 text-sm" />
                <input type="number" value={v.mrp || ''} onChange={e => { const vs = [...variants]; vs[i] = { ...vs[i], mrp: e.target.value }; setVariants(vs); }} placeholder="MRP" className="rounded border border-border px-2 py-1 text-sm" />
              </div>
            ))}
            <button type="button" onClick={() => setVariants([...variants, { name: '', size: '', price: 0, mrp: 0, sku: '' }])}
              className="text-xs text-primary font-medium">+ Add Variant</button>
          </div>
          <button type="submit" className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground">{product ? 'Update' : 'Add'} Product</button>
        </form>
      </div>
    </div>
  );
};

export default ProductManagement;
