import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react';
import { products as initialProducts } from '@/data/products';
import type { Product, ProductVariant } from '@/types';
import { toast } from 'sonner';

const ProductManagement = () => {
  const [productList, setProductList] = useState<Product[]>([...initialProducts]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filtered = productList.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const deleteProduct = (id: string) => {
    setProductList(prev => prev.filter(p => p.id !== id));
    toast.success('Product deleted');
  };

  const saveProduct = (product: Product) => {
    if (editing) {
      setProductList(prev => prev.map(p => p.id === product.id ? product : p));
      toast.success('Product updated');
    } else {
      setProductList(prev => [...prev, { ...product, id: Date.now().toString() }]);
      toast.success('Product added');
    }
    setEditing(null);
    setShowForm(false);
  };

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
            <th className="text-left px-4 py-3 font-medium">Image</th>
            <th className="text-left px-4 py-3 font-medium">Name</th>
            <th className="text-left px-4 py-3 font-medium">Category</th>
            <th className="text-left px-4 py-3 font-medium">Variants</th>
            <th className="text-left px-4 py-3 font-medium">Price</th>
            <th className="text-left px-4 py-3 font-medium">Discount</th>
            <th className="text-left px-4 py-3 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-b border-border hover:bg-muted/30">
                <td className="px-4 py-2"><img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover" /></td>
                <td className="px-4 py-3 font-medium max-w-[200px] truncate">{p.name}</td>
                <td className="px-4 py-3">{p.categoryId}</td>
                <td className="px-4 py-3">{p.variants.length}</td>
                <td className="px-4 py-3">₹{p.variants[0]?.price}</td>
                <td className="px-4 py-3">{p.discount}%</td>
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
      </div>

      {showForm && <ProductForm product={editing} onSave={saveProduct} onClose={() => { setShowForm(false); setEditing(null); }} />}
    </div>
  );
};

const ProductForm = ({ product, onSave, onClose }: { product: Product | null; onSave: (p: Product) => void; onClose: () => void }) => {
  const [form, setForm] = useState<Partial<Product>>(product || {
    name: '', slug: '', categoryId: '', subCategoryId: '', image: '/placeholder.svg',
    description: '', tags: [], weight: '', discount: 0, deliveryTime: '30 mins', variants: [{ id: '1', name: '', size: '', price: 0, mrp: 0 }],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.categoryId) { toast.error('Name and category are required'); return; }
    onSave({ ...form, id: product?.id || '', slug: form.slug || form.name!.toLowerCase().replace(/\s+/g, '-') } as Product);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card rounded-xl border border-border w-full max-w-lg max-h-[80vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">{product ? 'Edit Product' : 'Add Product'}</h3>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Product Name"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
          <input value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} placeholder="Category ID"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
          <input value={form.subCategoryId} onChange={e => setForm({ ...form, subCategoryId: e.target.value })} placeholder="Sub-category ID"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm" rows={3} />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} placeholder="Weight" className="rounded-lg border border-border px-3 py-2 text-sm" />
            <input type="number" value={form.discount} onChange={e => setForm({ ...form, discount: Number(e.target.value) })} placeholder="Discount %" className="rounded-lg border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Variants</p>
            {(form.variants || []).map((v, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 mb-2">
                <input value={v.name} onChange={e => { const vs = [...(form.variants || [])]; vs[i] = { ...vs[i], name: e.target.value }; setForm({ ...form, variants: vs }); }} placeholder="Name" className="rounded border border-border px-2 py-1 text-sm" />
                <input value={v.size} onChange={e => { const vs = [...(form.variants || [])]; vs[i] = { ...vs[i], size: e.target.value }; setForm({ ...form, variants: vs }); }} placeholder="Size" className="rounded border border-border px-2 py-1 text-sm" />
                <input type="number" value={v.price} onChange={e => { const vs = [...(form.variants || [])]; vs[i] = { ...vs[i], price: Number(e.target.value) }; setForm({ ...form, variants: vs }); }} placeholder="Price" className="rounded border border-border px-2 py-1 text-sm" />
                <input type="number" value={v.mrp} onChange={e => { const vs = [...(form.variants || [])]; vs[i] = { ...vs[i], mrp: Number(e.target.value) }; setForm({ ...form, variants: vs }); }} placeholder="MRP" className="rounded border border-border px-2 py-1 text-sm" />
              </div>
            ))}
            <button type="button" onClick={() => setForm({ ...form, variants: [...(form.variants || []), { id: Date.now().toString(), name: '', size: '', price: 0, mrp: 0 }] })}
              className="text-xs text-primary font-medium">+ Add Variant</button>
          </div>
          <button type="submit" className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground">{product ? 'Update' : 'Add'} Product</button>
        </form>
      </div>
    </div>
  );
};

export default ProductManagement;
