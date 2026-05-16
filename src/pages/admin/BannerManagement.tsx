import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { getBanners, addItem, updateItem, deleteItem } from '@/data/adminSharedData';
import type { BannerData } from '@/data/adminMockData';
import { useAdminStore } from '@/hooks/useAdminStore';
import { toast } from 'sonner';

const defaultBanner: Omit<BannerData, 'id'> = {
  title: '', type: 'Homepage', image: '/placeholder.svg', link: '/',
  isActive: true, startDate: new Date().toISOString(), endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
};

const BannerManagement = () => {
  useAdminStore();
  const banners = getBanners();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});

  const openAdd = () => { setEditId(null); setForm({ ...defaultBanner }); setShowForm(true); };
  const openEdit = (b: BannerData) => { setEditId(b.id); setForm({ ...b }); setShowForm(true); };

  const handleSave = () => {
    if (!form.title?.trim()) { toast.error('Title is required'); return; }
    if (editId) {
      updateItem(banners, editId, form);
      toast.success('Banner updated');
    } else {
      addItem(banners, form, 'ban');
      toast.success('Banner added');
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    deleteItem(banners, id);
    toast.success('Banner deleted');
  };

  const toggleActive = (b: BannerData) => {
    updateItem(banners, b.id, { isActive: !b.isActive } as any);
    toast.success(b.isActive ? 'Banner deactivated' : 'Banner activated');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Banners & Promotions ({banners.length})</h2>
        <button onClick={openAdd} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"><Plus className="h-4 w-4" /> Add Banner</button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {banners.map(b => (
          <div key={b.id} className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-sm transition-shadow">
            <div className="aspect-[16/7] bg-muted flex items-center justify-center">
              <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-sm">{b.title}</h4>
                <button onClick={() => toggleActive(b)} className={`px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer ${b.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>
                  {b.isActive ? 'active' : 'inactive'}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{b.type}</p>
              <div className="flex gap-1">
                <button onClick={() => openEdit(b)} className="p-1.5 rounded hover:bg-muted"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => handleDelete(b.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {banners.length === 0 && <p className="text-center text-muted-foreground py-8">No banners yet</p>}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{editId ? 'Edit Banner' : 'Add Banner'}</h3>
              <button onClick={() => setShowForm(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select value={form.type || 'Homepage'} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20">
                  <option>Homepage</option><option>Campaign</option><option>Sale</option><option>Category</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input value={form.image || ''} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Link</label>
                <input value={form.link || ''} onChange={e => setForm({ ...form, link: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.isActive ?? true} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="rounded" />
                <label className="text-sm">Active</label>
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

export default BannerManagement;
