import { useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, X, ChevronRight, FolderTree } from 'lucide-react';
import { store, addItem, updateItem, deleteItem, type Category } from '@/data/adminStore';
import { toast } from 'sonner';

const CategoryManagement = () => {
  const [cats, setCats] = useState<Category[]>([...store.categories]);
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);

  const refresh = useCallback(() => setCats([...store.categories]), []);

  const parentCats = cats.filter(c => c.level === 0);
  const subCats = cats.filter(c => c.level === 1);

  const saveCat = (data: Omit<Category, 'id'>) => {
    if (editCat) {
      updateItem(store.categories, editCat.id, data);
      toast.success('Category updated');
    } else {
      addItem(store.categories, data);
      toast.success('Category created');
    }
    refresh(); setShowForm(false); setEditCat(null);
  };

  const deleteCat = (id: string) => {
    const hasChildren = cats.some(c => c.parentId === id);
    if (hasChildren) { toast.error('Delete subcategories first'); return; }
    deleteItem(store.categories, id);
    toast.success('Category deleted');
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Categories</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Step 1 — Products cannot exist without a category
          </p>
        </div>
        <button onClick={() => { setEditCat(null); setShowForm(true); }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {/* Parent Categories */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <FolderTree className="h-5 w-5 text-primary" /> Parent Categories
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {parentCats.map(c => {
            const childCount = subCats.filter(s => s.parentId === c.id).length;
            return (
              <div key={c.id} className="rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{c.icon || '📁'}</span>
                    <div>
                      <p className="font-semibold text-sm">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{childCount} subcategories</p>
                      <p className="text-xs text-muted-foreground font-mono">/{c.slug}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>
                    {c.status}
                  </span>
                </div>
                <div className="flex gap-1 mt-3 pt-3 border-t border-border">
                  <button onClick={() => { setEditCat(c); setShowForm(true); }}
                    className="flex items-center gap-1 px-2 py-1 rounded text-xs hover:bg-muted transition-colors">
                    <Edit2 className="h-3 w-3" /> Edit
                  </button>
                  <button onClick={() => deleteCat(c.id)}
                    className="flex items-center gap-1 px-2 py-1 rounded text-xs hover:bg-destructive/10 text-destructive transition-colors">
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subcategories */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Subcategories</h3>
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Parent Category</th>
                <th className="text-left px-4 py-3 font-medium">Slug</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subCats.map(s => (
                <tr key={s.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">
                    <div className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                      {s.name}
                    </div>
                  </td>
                  <td className="px-4 py-3">{parentCats.find(c => c.id === s.parentId)?.name || '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">/{s.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => { setEditCat(s); setShowForm(true); }}
                        className="p-1.5 rounded hover:bg-muted transition-colors"><Edit2 className="h-4 w-4" /></button>
                      <button onClick={() => deleteCat(s.id)}
                        className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {subCats.length === 0 && <p className="text-center text-muted-foreground py-8">No subcategories yet</p>}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">{editCat ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => { setShowForm(false); setEditCat(null); }}
                className="p-1 rounded hover:bg-muted transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <CategoryForm initial={editCat} parentCats={parentCats} onSave={saveCat} />
          </div>
        </div>
      )}
    </div>
  );
};

const CategoryForm = ({ initial, parentCats, onSave }: {
  initial: Category | null; parentCats: Category[]; onSave: (d: Omit<Category, 'id'>) => void;
}) => {
  const [name, setName] = useState(initial?.name || '');
  const [slug, setSlug] = useState(initial?.slug || '');
  const [level, setLevel] = useState(initial?.level ?? 0);
  const [parentId, setParentId] = useState(initial?.parentId || '');
  const [icon, setIcon] = useState(initial?.icon || '');
  const [bannerImage, setBannerImage] = useState(initial?.bannerImage || '');
  const [status, setStatus] = useState<'active' | 'inactive'>(initial?.status || 'active');

  const autoSlug = (val: string) => val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return (
    <form onSubmit={e => {
      e.preventDefault();
      if (!name) { toast.error('Category name is required'); return; }
      onSave({ name, slug: slug || autoSlug(name), level, parentId: level === 1 ? parentId || null : null, icon, bannerImage, status });
    }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5">Category Type</label>
        <select value={level} onChange={e => setLevel(Number(e.target.value))}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors">
          <option value={0}>Parent Category</option>
          <option value={1}>Subcategory</option>
        </select>
      </div>

      {level === 1 && (
        <div>
          <label className="block text-sm font-medium mb-1.5">Parent Category *</label>
          <select value={parentId} onChange={e => setParentId(e.target.value)} required
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors">
            <option value="">Select Parent Category</option>
            {parentCats.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1.5">Category Name *</label>
        <input value={name} onChange={e => { setName(e.target.value); if (!initial) setSlug(autoSlug(e.target.value)); }}
          placeholder="e.g. Lipstick" className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Slug</label>
        <input value={slug} onChange={e => setSlug(e.target.value)}
          placeholder="auto-generated" className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1.5">Icon (emoji)</label>
          <input value={icon} onChange={e => setIcon(e.target.value)} placeholder="💄"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Status</label>
          <select value={status} onChange={e => setStatus(e.target.value as 'active' | 'inactive')}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Banner Image URL</label>
        <input value={bannerImage} onChange={e => setBannerImage(e.target.value)} placeholder="/placeholder.svg"
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" />
      </div>

      <button type="submit"
        className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors mt-2">
        {initial ? 'Update Category' : 'Create Category'}
      </button>
    </form>
  );
};

export default CategoryManagement;
