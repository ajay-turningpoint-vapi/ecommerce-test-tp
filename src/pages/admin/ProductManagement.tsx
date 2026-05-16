import { useState, useMemo, useCallback } from 'react';
import AdminPagination, { usePagination } from '@/components/admin/AdminPagination';
import { Search, Plus, Edit2, Trash2, X, Package, Layers, Image as ImageIcon, Tag, Eye } from 'lucide-react';
import { store, addItem, updateItem, deleteItem, getCategoryName, getBrandName, getProductVariants, getVariantAttributes, getProductImages,
  type AdminProduct, type ProductVariant, type VariantAttributeValue, type ProductImage } from '@/data/adminStore';
import { toast } from 'sonner';

type Tab = 'details' | 'variants' | 'attributes' | 'images';

const ProductManagement = () => {
  const [products, setProducts] = useState<AdminProduct[]>([...store.products]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [managingProduct, setManagingProduct] = useState<AdminProduct | null>(null);
  const [_prodPage, _setProdPage] = useState(1);

  const refresh = useCallback(() => setProducts([...store.products]), []);

  const filtered = useMemo(() =>
    products.filter(p => p.title.toLowerCase().includes(search.toLowerCase())),
    [products, search]
  );

  const save = (data: Omit<AdminProduct, 'id' | 'createdAt'>) => {
    if (editing) {
      updateItem(store.products, editing.id, data);
      toast.success('Product updated');
    } else {
      addItem(store.products, { ...data, createdAt: new Date().toISOString() } as any);
      toast.success('Product created');
    }
    refresh(); setShowForm(false); setEditing(null);
  };

  const remove = (id: string) => {
    store.variants.filter(v => v.productId === id).forEach(v => {
      store.variantAttributes = store.variantAttributes.filter(va => va.variantId !== v.id);
      store.inventory = store.inventory.filter(inv => inv.variantId !== v.id);
    });
    store.variants = store.variants.filter(v => v.productId !== id);
    store.productImages = store.productImages.filter(img => img.productId !== id);
    deleteItem(store.products, id);
    toast.success('Product & related data deleted');
    refresh();
  };

  return (
    <div className="space-y-4">
      {managingProduct ? (
        <ProductDetailManager product={managingProduct} onBack={() => { setManagingProduct(null); refresh(); }} />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Products</h2>
              <p className="text-sm text-muted-foreground mt-1">Step 4 — Create products with variants, attributes & images</p>
            </div>
            <button onClick={() => { setEditing(null); setShowForm(true); }}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              <Plus className="h-4 w-4" /> Add Product
            </button>
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
                <th className="text-left px-4 py-3 font-medium">Brand</th>
                <th className="text-left px-4 py-3 font-medium">Variants</th>
                <th className="text-left px-4 py-3 font-medium">Price</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {(() => {
                  const pageSize = 10;
                  const [page, setPage] = [_prodPage, _setProdPage];
                  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
                  const safePage = Math.min(page, totalPages);
                  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
                  return (<>
                    {paginated.map(p => {
                      const pvs = getProductVariants(p.id);
                      const defaultV = pvs.find(v => v.isDefault) || pvs[0];
                      return (
                        <tr key={p.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                <Package className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="font-medium max-w-[200px] truncate">{p.title}</p>
                                <p className="text-xs text-muted-foreground font-mono">/{p.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{getCategoryName(p.categoryId)}</td>
                          <td className="px-4 py-3 text-muted-foreground">{getBrandName(p.brandId)}</td>
                          <td className="px-4 py-3">{pvs.length}</td>
                          <td className="px-4 py-3">₹{defaultV?.price || 0}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : p.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-muted text-muted-foreground'}`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <button onClick={() => setManagingProduct(p)} className="p-1.5 rounded hover:bg-muted transition-colors" title="Manage"><Eye className="h-4 w-4" /></button>
                              <button onClick={() => { setEditing(p); setShowForm(true); }} className="p-1.5 rounded hover:bg-muted transition-colors"><Edit2 className="h-4 w-4" /></button>
                              <button onClick={() => remove(p.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </>);
                })()}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No products found</p>}
            <AdminPagination currentPage={_prodPage} totalItems={filtered.length} pageSize={10} onPageChange={_setProdPage} />
          </div>

          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="bg-card rounded-xl border border-border w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 shadow-xl">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold">{editing ? 'Edit Product' : 'Add Product'}</h3>
                  <button onClick={() => { setShowForm(false); setEditing(null); }}
                    className="p-1 rounded hover:bg-muted transition-colors"><X className="h-5 w-5" /></button>
                </div>
                <ProductForm initial={editing} onSave={save} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ─── Product Create/Edit Form ───
const ProductForm = ({ initial, onSave }: { initial: AdminProduct | null; onSave: (d: any) => void }) => {
  const [title, setTitle] = useState(initial?.title || '');
  const [slug, setSlug] = useState(initial?.slug || '');
  const [categoryId, setCategoryId] = useState(initial?.categoryId || '');
  const [brandId, setBrandId] = useState(initial?.brandId || '');
  const [shortDesc, setShortDesc] = useState(initial?.shortDescription || '');
  const [fullDesc, setFullDesc] = useState(initial?.fullDescription || '');
  const [status, setStatus] = useState(initial?.status || 'active');
  const [discount, setDiscount] = useState(initial?.discount || 0);
  const [weight, setWeight] = useState(initial?.weight || '');
  const [deliveryTime, setDeliveryTime] = useState(initial?.deliveryTime || '2-3 days');
  const [tagsStr, setTagsStr] = useState((initial?.tags || []).join(', '));
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>(initial?.specifications?.length ? initial.specifications : [{ key: '', value: '' }]);

  const autoSlug = (val: string) => val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const parentCats = store.categories.filter(c => c.level === 0);
  const subCats = store.categories.filter(c => c.level === 1);

  return (
    <form onSubmit={e => {
      e.preventDefault();
      if (!title || !categoryId || !brandId) { toast.error('Title, category and brand are required'); return; }
      const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
      const specifications = specs.filter(s => s.key.trim() && s.value.trim());
      onSave({ title, slug: slug || autoSlug(title), categoryId, brandId, shortDescription: shortDesc, fullDescription: fullDesc, status, discount, weight, deliveryTime, tags, specifications });
    }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5">Product Title *</label>
        <input value={title} onChange={e => { setTitle(e.target.value); if (!initial) setSlug(autoSlug(e.target.value)); }}
          placeholder="e.g. Lakmé Matte Lipstick" className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Slug</label>
        <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="auto-generated"
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1.5">Category *</label>
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors">
            <option value="">Select Category</option>
            {parentCats.map(c => (
              <optgroup key={c.id} label={c.name}>
                {subCats.filter(s => s.parentId === c.id).map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Brand *</label>
          <select value={brandId} onChange={e => setBrandId(e.target.value)} required
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors">
            <option value="">Select Brand</option>
            {store.brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Short Description</label>
        <input value={shortDesc} onChange={e => setShortDesc(e.target.value)} placeholder="Brief product description"
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Full Description</label>
        <textarea value={fullDesc} onChange={e => setFullDesc(e.target.value)} placeholder="Detailed product description..." rows={3}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors resize-none" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Tags <span className="text-muted-foreground font-normal">(comma separated)</span></label>
        <input value={tagsStr} onChange={e => setTagsStr(e.target.value)} placeholder="e.g. Lipstick, Matte, Long-lasting"
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Specifications</label>
        <div className="space-y-2">
          {specs.map((s, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input value={s.key} onChange={e => { const n = [...specs]; n[i] = { ...n[i], key: e.target.value }; setSpecs(n); }} placeholder="Key (e.g. Ingredients)"
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" />
              <input value={s.value} onChange={e => { const n = [...specs]; n[i] = { ...n[i], value: e.target.value }; setSpecs(n); }} placeholder="Value"
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" />
              <button type="button" onClick={() => setSpecs(specs.filter((_, j) => j !== i))} className="text-destructive hover:text-destructive/80 p-1"><X className="h-4 w-4" /></button>
            </div>
          ))}
          <button type="button" onClick={() => setSpecs([...specs, { key: '', value: '' }])} className="text-sm text-primary hover:underline">+ Add specification</button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1.5">Discount %</label>
          <input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} min={0} max={100}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Weight</label>
          <input value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 50g"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Status</label>
          <select value={status} onChange={e => setStatus(e.target.value as any)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors">
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Delivery Time</label>
        <input value={deliveryTime} onChange={e => setDeliveryTime(e.target.value)} placeholder="e.g. 2-3 days"
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" />
      </div>
      <button type="submit"
        className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors mt-2">
        {initial ? 'Update Product' : 'Create Product'}
      </button>
    </form>
  );
};

// ─── Product Detail Manager (Variants, Attributes, Images) ───
const ProductDetailManager = ({ product, onBack }: { product: AdminProduct; onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<Tab>('variants');
  const [, setTick] = useState(0);
  const forceUpdate = () => setTick(t => t + 1);

  const tabs: { key: Tab; label: string; icon: typeof Package }[] = [
    { key: 'variants', label: 'Variants (SKU)', icon: Layers },
    { key: 'attributes', label: 'Variant Attributes', icon: Tag },
    { key: 'images', label: 'Images', icon: ImageIcon },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-sm text-primary hover:underline">← Back to Products</button>
        <span className="text-muted-foreground">/</span>
        <h2 className="text-xl font-bold">{product.title}</h2>
      </div>

      <div className="flex gap-1 border-b border-border">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === t.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'variants' && <VariantsTab productId={product.id} onUpdate={forceUpdate} />}
      {activeTab === 'attributes' && <AttributesTab productId={product.id} onUpdate={forceUpdate} />}
      {activeTab === 'images' && <ImagesTab productId={product.id} onUpdate={forceUpdate} />}
    </div>
  );
};

// ─── Variants Tab ───
const VariantsTab = ({ productId, onUpdate }: { productId: string; onUpdate: () => void }) => {
  const [variants, setVariants] = useState(getProductVariants(productId));
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ProductVariant | null>(null);

  const refresh = () => { setVariants(getProductVariants(productId)); onUpdate(); };

  const save = (data: Omit<ProductVariant, 'id'>) => {
    if (editing) {
      updateItem(store.variants, editing.id, data);
      toast.success('Variant updated');
    } else {
      addItem(store.variants, data);
      toast.success('Variant created');
    }
    refresh(); setShowForm(false); setEditing(null);
  };

  const remove = (id: string) => {
    store.variantAttributes = store.variantAttributes.filter(va => va.variantId !== id);
    store.inventory = store.inventory.filter(inv => inv.variantId !== id);
    deleteItem(store.variants, id);
    toast.success('Variant deleted');
    refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Step 5 — Variants represent actual sellable items (SKUs)</p>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Add Variant
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/50">
            <th className="text-left px-4 py-3 font-medium">SKU</th>
            <th className="text-left px-4 py-3 font-medium">Name</th>
            <th className="text-left px-4 py-3 font-medium">MRP</th>
            <th className="text-left px-4 py-3 font-medium">Price</th>
            <th className="text-left px-4 py-3 font-medium">Discount Price</th>
            <th className="text-left px-4 py-3 font-medium">Barcode</th>
            <th className="text-left px-4 py-3 font-medium">Status</th>
            <th className="text-left px-4 py-3 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {variants.map(v => (
              <tr key={v.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-mono text-xs font-bold">{v.sku}</td>
                <td className="px-4 py-3 font-medium">{v.name} {v.isDefault && <span className="text-xs text-primary ml-1">(default)</span>}</td>
                <td className="px-4 py-3 text-muted-foreground">₹{v.mrp}</td>
                <td className="px-4 py-3 font-medium">₹{v.price}</td>
                <td className="px-4 py-3">{v.discountPrice ? `₹${v.discountPrice}` : '—'}</td>
                <td className="px-4 py-3 font-mono text-xs">{v.barcode || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${v.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>{v.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => { setEditing(v); setShowForm(true); }} className="p-1.5 rounded hover:bg-muted transition-colors"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => remove(v.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {variants.length === 0 && <p className="text-center text-muted-foreground py-8">No variants yet — add your first SKU</p>}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">{editing ? 'Edit Variant' : 'Add Variant'}</h3>
              <button onClick={() => { setShowForm(false); setEditing(null); }}><X className="h-5 w-5" /></button>
            </div>
            <VariantForm productId={productId} initial={editing} onSave={save} />
          </div>
        </div>
      )}
    </div>
  );
};

const VariantForm = ({ productId, initial, onSave }: { productId: string; initial: ProductVariant | null; onSave: (d: any) => void }) => {
  const [sku, setSku] = useState(initial?.sku || '');
  const [name, setName] = useState(initial?.name || '');
  const [price, setPrice] = useState(initial?.price || 0);
  const [mrp, setMrp] = useState(initial?.mrp || 0);
  const [discountPrice, setDiscountPrice] = useState(initial?.discountPrice || '');
  const [barcode, setBarcode] = useState(initial?.barcode || '');
  const [status, setStatus] = useState(initial?.status || 'active');
  const [isDefault, setIsDefault] = useState(initial?.isDefault || false);

  return (
    <form onSubmit={e => {
      e.preventDefault();
      if (!sku || !price) { toast.error('SKU and price are required'); return; }
      onSave({ productId, sku, name, price: Number(price), mrp: Number(mrp) || Number(price), discountPrice: discountPrice ? Number(discountPrice) : null, barcode, status, isDefault });
    }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1.5">SKU *</label>
          <input value={sku} onChange={e => setSku(e.target.value)} placeholder="LKM-RED-MATTE"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Variant Name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Ruby Red"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1.5">MRP (₹)</label>
          <input type="number" value={mrp} onChange={e => setMrp(Number(e.target.value))} min={0}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Price (₹) *</label>
          <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} min={0}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Discount Price</label>
          <input type="number" value={discountPrice} onChange={e => setDiscountPrice(e.target.value)} min={0} placeholder="—"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1.5">Barcode</label>
          <input value={barcode} onChange={e => setBarcode(e.target.value)} placeholder="8901234567001"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Status</label>
          <select value={status} onChange={e => setStatus(e.target.value as any)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isDefault} onChange={e => setIsDefault(e.target.checked)} className="rounded" />
        Default variant
      </label>
      <button type="submit" className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors">
        {initial ? 'Update Variant' : 'Create Variant'}
      </button>
    </form>
  );
};

// ─── Attributes Tab ───
const AttributesTab = ({ productId, onUpdate }: { productId: string; onUpdate: () => void }) => {
  const pvs = getProductVariants(productId);
  const [, setTick] = useState(0);
  const refresh = () => { setTick(t => t + 1); onUpdate(); };

  const assignAttribute = (variantId: string, attributeId: string, value: string) => {
    const existing = store.variantAttributes.find(va => va.variantId === variantId && va.attributeId === attributeId);
    if (existing) {
      updateItem(store.variantAttributes, existing.id, { value });
    } else {
      addItem(store.variantAttributes, { variantId, attributeId, value } as any);
    }
    toast.success('Attribute assigned');
    refresh();
  };

  const removeAttribute = (id: string) => {
    deleteItem(store.variantAttributes, id);
    toast.success('Attribute removed');
    refresh();
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Step 6 — Assign attribute values (Color, Finish, etc.) to each variant</p>
      {pvs.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">Create variants first before assigning attributes</p>
      ) : (
        pvs.map(v => {
          const assigned = getVariantAttributes(v.id);
          return (
            <div key={v.id} className="rounded-xl border border-border bg-card p-4">
              <h4 className="font-semibold text-sm mb-3">
                {v.name} <span className="font-mono text-xs text-muted-foreground ml-2">{v.sku}</span>
              </h4>
              <div className="space-y-2 mb-3">
                {assigned.map(a => (
                  <div key={a.id} className="flex items-center gap-2 text-sm">
                    <span className="font-medium w-24">{a.attributeName}:</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">{a.value}</span>
                    <button onClick={() => removeAttribute(a.id)} className="text-destructive hover:underline text-xs">Remove</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                {store.attributes.map(attr => (
                  <select key={attr.id}
                    value=""
                    onChange={e => { if (e.target.value) assignAttribute(v.id, attr.id, e.target.value); }}
                    className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs">
                    <option value="">+ {attr.name}</option>
                    {attr.values.map(val => <option key={val} value={val}>{val}</option>)}
                  </select>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

// ─── Images Tab ───
const ImagesTab = ({ productId, onUpdate }: { productId: string; onUpdate: () => void }) => {
  const [images, setImages] = useState(getProductImages(productId));
  const [url, setUrl] = useState('');
  const [variantId, setVariantId] = useState('');
  const [isThumbnail, setIsThumbnail] = useState(false);
  const pvs = getProductVariants(productId);

  const refresh = () => { setImages(getProductImages(productId)); onUpdate(); };

  const addImage = () => {
    if (!url) { toast.error('Image URL is required'); return; }
    addItem(store.productImages, {
      productId, variantId: variantId || null, imageUrl: url,
      isThumbnail, position: images.length,
    } as any);
    toast.success('Image added');
    setUrl(''); setVariantId(''); setIsThumbnail(false);
    refresh();
  };

  const removeImage = (id: string) => {
    deleteItem(store.productImages, id);
    toast.success('Image removed');
    refresh();
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Step 7 — Upload thumbnail, gallery and variant-specific images</p>

      <div className="rounded-xl border border-border bg-card p-4">
        <h4 className="font-semibold text-sm mb-3">Add Image</h4>
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Image URL" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <select value={variantId} onChange={e => setVariantId(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
            <option value="">General (no variant)</option>
            {pvs.map(v => <option key={v.id} value={v.id}>{v.name} ({v.sku})</option>)}
          </select>
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isThumbnail} onChange={e => setIsThumbnail(e.target.checked)} className="rounded" />
            Thumbnail image
          </label>
          <button onClick={addImage} className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" /> Add Image
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map(img => (
          <div key={img.id} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="aspect-square bg-muted flex items-center justify-center">
              <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="p-2">
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {img.isThumbnail && <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">Thumb</span>}
                  {img.variantId && <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted">
                    {store.variants.find(v => v.id === img.variantId)?.sku || 'variant'}
                  </span>}
                </div>
                <button onClick={() => removeImage(img.id)} className="p-1 rounded hover:bg-destructive/10 text-destructive transition-colors">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {images.length === 0 && <p className="text-center text-muted-foreground py-8">No images yet</p>}
    </div>
  );
};

export default ProductManagement;
