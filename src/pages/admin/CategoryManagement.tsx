import { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { categories as initialCategories, subCategories as initialSubCategories } from '@/data/products';
import type { Category, SubCategory } from '@/types';
import { toast } from 'sonner';

const CategoryManagement = () => {
  const [cats, setCats] = useState<Category[]>([...initialCategories]);
  const [subs, setSubs] = useState<SubCategory[]>([...initialSubCategories]);
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [showSubForm, setShowSubForm] = useState(false);
  const [editSub, setEditSub] = useState<SubCategory | null>(null);

  const saveCat = (cat: Category) => {
    if (editCat) setCats(prev => prev.map(c => c.id === cat.id ? cat : c));
    else setCats(prev => [...prev, { ...cat, id: Date.now().toString() }]);
    setShowForm(false); setEditCat(null);
    toast.success(editCat ? 'Category updated' : 'Category added');
  };

  const deleteCat = (id: string) => {
    setCats(prev => prev.filter(c => c.id !== id));
    toast.success('Category deleted');
  };

  const saveSub = (sub: SubCategory) => {
    if (editSub) setSubs(prev => prev.map(s => s.id === sub.id ? sub : s));
    else setSubs(prev => [...prev, { ...sub, id: Date.now().toString() }]);
    setShowSubForm(false); setEditSub(null);
    toast.success(editSub ? 'Subcategory updated' : 'Subcategory added');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Categories</h2>
        <button onClick={() => { setEditCat(null); setShowForm(true); }} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cats.map(c => (
          <div key={c.id} className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={c.image} alt={c.name} className="w-10 h-10 rounded object-cover" />
              <div>
                <p className="font-medium text-sm">{c.name}</p>
                <p className="text-xs text-muted-foreground">{subs.filter(s => s.categoryId === c.id).length} subcategories</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setEditCat(c); setShowForm(true); }} className="p-1.5 rounded hover:bg-muted"><Edit2 className="h-4 w-4" /></button>
              <button onClick={() => deleteCat(c.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Subcategories</h3>
        <button onClick={() => { setEditSub(null); setShowSubForm(true); }} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          <Plus className="h-4 w-4" /> Add Subcategory
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/50">
            <th className="text-left px-4 py-3 font-medium">Name</th>
            <th className="text-left px-4 py-3 font-medium">Category</th>
            <th className="text-left px-4 py-3 font-medium">Slug</th>
            <th className="text-left px-4 py-3 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {subs.map(s => (
              <tr key={s.id} className="border-b border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3">{cats.find(c => c.id === s.categoryId)?.name || s.categoryId}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.slug}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => { setEditSub(s); setShowSubForm(true); }} className="p-1.5 rounded hover:bg-muted"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => { setSubs(prev => prev.filter(x => x.id !== s.id)); toast.success('Deleted'); }} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <Modal title={editCat ? 'Edit Category' : 'Add Category'} onClose={() => { setShowForm(false); setEditCat(null); }}>
          <CatForm initial={editCat} onSave={saveCat} />
        </Modal>
      )}
      {showSubForm && (
        <Modal title={editSub ? 'Edit Subcategory' : 'Add Subcategory'} onClose={() => { setShowSubForm(false); setEditSub(null); }}>
          <SubForm initial={editSub} categories={cats} onSave={saveSub} />
        </Modal>
      )}
    </div>
  );
};

const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="bg-card rounded-xl border border-border w-full max-w-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <button onClick={onClose}><X className="h-5 w-5" /></button>
      </div>
      {children}
    </div>
  </div>
);

const CatForm = ({ initial, onSave }: { initial: Category | null; onSave: (c: Category) => void }) => {
  const [name, setName] = useState(initial?.name || '');
  const [slug, setSlug] = useState(initial?.slug || '');
  return (
    <form onSubmit={e => { e.preventDefault(); onSave({ id: initial?.id || '', name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'), image: initial?.image || '/placeholder.svg' }); }} className="space-y-3">
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Category Name" className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
      <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="Slug" className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
      <button type="submit" className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground">Save</button>
    </form>
  );
};

const SubForm = ({ initial, categories, onSave }: { initial: SubCategory | null; categories: Category[]; onSave: (s: SubCategory) => void }) => {
  const [name, setName] = useState(initial?.name || '');
  const [slug, setSlug] = useState(initial?.slug || '');
  const [catId, setCatId] = useState(initial?.categoryId || '');
  return (
    <form onSubmit={e => { e.preventDefault(); onSave({ id: initial?.id || '', name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'), categoryId: catId, image: initial?.image || '/placeholder.svg' }); }} className="space-y-3">
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Subcategory Name" className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
      <select value={catId} onChange={e => setCatId(e.target.value)} className="w-full rounded-lg border border-border px-3 py-2 text-sm">
        <option value="">Select Category</option>
        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="Slug" className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
      <button type="submit" className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground">Save</button>
    </form>
  );
};

export default CategoryManagement;
