import { useState } from 'react';
import { ChevronRight, FolderTree, Plus, Pencil, Trash2, X } from 'lucide-react';
import { categories, subCategories, addItem, updateItem, deleteItem } from '@/data/adminSharedData';
import { useAdminStore } from '@/hooks/useAdminStore';
import { toast } from 'sonner';
import type { Category, SubCategory } from '@/types';

const emptyCategory: Omit<Category, 'id'> = { name: '', slug: '', image: '/placeholder.svg' };
const emptySubCategory: Omit<SubCategory, 'id'> = { name: '', slug: '', categoryId: '', image: '/placeholder.svg' };

const CategoryManagement = () => {
  useAdminStore();
  const [showForm, setShowForm] = useState<'category' | 'subcategory' | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});

  const openAdd = (type: 'category' | 'subcategory') => {
    setEditId(null);
    setForm(type === 'category' ? { ...emptyCategory } : { ...emptySubCategory });
    setShowForm(type);
  };
  const openEditCat = (c: Category) => { setEditId(c.id); setForm({ ...c }); setShowForm('category'); };
  const openEditSub = (s: SubCategory) => { setEditId(s.id); setForm({ ...s }); setShowForm('subcategory'); };

  const handleSave = () => {
    if (!form.name?.trim()) { toast.error('Name is required'); return; }
    if (!form.slug?.trim()) form.slug = form.name.toLowerCase().replace(/\s+/g, '-');
    if (showForm === 'category') {
      if (editId) { updateItem(categories, editId, form); toast.success('Category updated'); }
      else { addItem(categories, form, 'cat'); toast.success('Category added'); }
    } else {
      if (!form.categoryId) { toast.error('Select a parent category'); return; }
      if (editId) { updateItem(subCategories, editId, form); toast.success('Subcategory updated'); }
      else { addItem(subCategories, form, 'sub'); toast.success('Subcategory added'); }
    }
    setShowForm(null);
  };

  const deleteCat = (id: string) => { deleteItem(categories, id); toast.success('Category deleted'); };
  const deleteSub = (id: string) => { deleteItem(subCategories, id); toast.success('Subcategory deleted'); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Categories ({categories.length})</h2>
        <div className="flex gap-2">
          <button onClick={() => openAdd('category')} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"><Plus className="h-4 w-4" /> Add Category</button>
          <button onClick={() => openAdd('subcategory')} className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"><Plus className="h-4 w-4" /> Add Subcategory</button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <FolderTree className="h-5 w-5 text-primary" /> Parent Categories
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {categories.map(c => {
            const childCount = subCategories.filter(s => s.categoryId === c.id).length;
            return (
              <div key={c.id} className="rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-3">
                  <img src={c.image} alt={c.name} className="h-10 w-10 rounded-lg object-cover bg-muted" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{childCount} subcategories</p>
                    <p className="text-xs text-muted-foreground font-mono">/{c.slug}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEditCat(c)} className="p-1 rounded hover:bg-muted"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => deleteCat(c.id)} className="p-1 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Subcategories ({subCategories.length})</h3>
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Parent</th>
              <th className="text-left px-4 py-3 font-medium">Slug</th>
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {subCategories.map(s => (
                <tr key={s.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium"><div className="flex items-center gap-2"><ChevronRight className="h-3 w-3 text-muted-foreground" />{s.name}</div></td>
                  <td className="px-4 py-3">{categories.find(c => c.id === s.categoryId)?.name || '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">/{s.slug}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEditSub(s)} className="p-1.5 rounded hover:bg-muted"><Pencil className="h-3.5 w-3.5" /></button>
                      <button onClick={() => deleteSub(s.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {subCategories.length === 0 && <p className="text-center text-muted-foreground py-8">No subcategories yet</p>}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{editId ? 'Edit' : 'Add'} {showForm === 'category' ? 'Category' : 'Subcategory'}</h3>
              <button onClick={() => setShowForm(null)}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input value={form.slug || ''} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input value={form.image || ''} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              {showForm === 'subcategory' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Parent Category</label>
                  <select value={form.categoryId || ''} onChange={e => setForm({ ...form, categoryId: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">Select...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <button onClick={handleSave} className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">{editId ? 'Update' : 'Add'}</button>
                <button onClick={() => setShowForm(null)} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
