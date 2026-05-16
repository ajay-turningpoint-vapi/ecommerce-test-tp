import { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useAdminCategories, useAdminMutation } from '@/hooks/useAdminData';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const CategoryManagement = () => {
  const { data: categories = [], isLoading } = useAdminCategories();
  const { create, update, remove } = useAdminMutation('categories');
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState<any>(null);

  const parentCats = categories.filter((c: any) => c.level === 0);
  const subCats = categories.filter((c: any) => c.level === 1);

  const saveCat = (data: any) => {
    if (editCat) {
      update.mutate({ id: editCat.id, ...data }, {
        onSuccess: () => { toast.success('Category updated'); setShowForm(false); setEditCat(null); },
        onError: (e) => toast.error(e.message),
      });
    } else {
      create.mutate(data, {
        onSuccess: () => { toast.success('Category added'); setShowForm(false); },
        onError: (e) => toast.error(e.message),
      });
    }
  };

  const deleteCat = (id: string) => {
    remove.mutate(id, {
      onSuccess: () => toast.success('Category deleted'),
      onError: (e) => toast.error(e.message),
    });
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-40 w-full" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Categories</h2>
        <button onClick={() => { setEditCat(null); setShowForm(true); }} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {parentCats.map((c: any) => (
          <div key={c.id} className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">{c.name}</p>
              <p className="text-xs text-muted-foreground">{subCats.filter((s: any) => s.parent_id === c.id).length} subcategories</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setEditCat(c); setShowForm(true); }} className="p-1.5 rounded hover:bg-muted"><Edit2 className="h-4 w-4" /></button>
              <button onClick={() => deleteCat(c.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-bold">Subcategories</h3>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/50">
            <th className="text-left px-4 py-3 font-medium">Name</th>
            <th className="text-left px-4 py-3 font-medium">Parent Category</th>
            <th className="text-left px-4 py-3 font-medium">Slug</th>
            <th className="text-left px-4 py-3 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {subCats.map((s: any) => (
              <tr key={s.id} className="border-b border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3">{parentCats.find((c: any) => c.id === s.parent_id)?.name || '—'}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.slug}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => { setEditCat(s); setShowForm(true); }} className="p-1.5 rounded hover:bg-muted"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => deleteCat(s.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{editCat ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => { setShowForm(false); setEditCat(null); }}><X className="h-5 w-5" /></button>
            </div>
            <CatForm initial={editCat} parentCats={parentCats} onSave={saveCat} />
          </div>
        </div>
      )}
    </div>
  );
};

const CatForm = ({ initial, parentCats, onSave }: { initial: any; parentCats: any[]; onSave: (d: any) => void }) => {
  const [name, setName] = useState(initial?.name || '');
  const [slug, setSlug] = useState(initial?.slug || '');
  const [parentId, setParentId] = useState(initial?.parent_id || '');
  const [level, setLevel] = useState(initial?.level ?? 0);

  return (
    <form onSubmit={e => { e.preventDefault(); onSave({ name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'), level, parent_id: level === 1 ? parentId : null }); }} className="space-y-3">
      <select value={level} onChange={e => setLevel(Number(e.target.value))} className="w-full rounded-lg border border-border px-3 py-2 text-sm">
        <option value={0}>Parent Category</option>
        <option value={1}>Subcategory</option>
      </select>
      {level === 1 && (
        <select value={parentId} onChange={e => setParentId(e.target.value)} className="w-full rounded-lg border border-border px-3 py-2 text-sm">
          <option value="">Select Parent</option>
          {parentCats.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      )}
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Category Name" className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
      <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="Slug" className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
      <button type="submit" className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground">Save</button>
    </form>
  );
};

export default CategoryManagement;
