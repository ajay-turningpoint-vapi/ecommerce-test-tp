import { useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { store, addItem, updateItem, deleteItem, type Banner } from '@/data/adminStore';
import { toast } from 'sonner';

const BannerManagement = () => {
  const [banners, setBanners] = useState([...store.banners]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);

  const refresh = useCallback(() => setBanners([...store.banners]), []);

  const toggleActive = (b: Banner) => {
    updateItem(store.banners, b.id, { status: b.status === 'active' ? 'inactive' : 'active' });
    toast.success('Status updated'); refresh();
  };

  const remove = (id: string) => { deleteItem(store.banners, id); toast.success('Banner deleted'); refresh(); };

  const save = (data: Omit<Banner, 'id'>) => {
    if (editing) { updateItem(store.banners, editing.id, data); toast.success('Banner updated'); }
    else { addItem(store.banners, data); toast.success('Banner added'); }
    refresh(); setShowForm(false); setEditing(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Banners & Promotions</h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Add Banner
        </button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {banners.map(b => (
          <div key={b.id} className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-sm transition-shadow">
            <div className="aspect-[16/7] bg-muted flex items-center justify-center">
              <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-sm">{b.title}</h4>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${b.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>{b.status}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Position: {b.position}</p>
              <div className="flex gap-1">
                <button onClick={() => toggleActive(b)} className="p-1.5 rounded hover:bg-muted transition-colors">
                  {b.status === 'active' ? <ToggleRight className="h-4 w-4 text-green-600" /> : <ToggleLeft className="h-4 w-4" />}
                </button>
                <button onClick={() => { setEditing(b); setShowForm(true); }} className="p-1.5 rounded hover:bg-muted transition-colors"><Edit2 className="h-4 w-4" /></button>
                <button onClick={() => remove(b.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {banners.length === 0 && <p className="text-center text-muted-foreground py-8">No banners yet</p>}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">{editing ? 'Edit Banner' : 'Add Banner'}</h3>
              <button onClick={() => { setShowForm(false); setEditing(null); }}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={e => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              save({ title: fd.get('title') as string, imageUrl: (fd.get('imageUrl') as string) || '/placeholder.svg', link: fd.get('link') as string, position: Number(fd.get('position')), status: fd.get('status') as any });
            }} className="space-y-4">
              <div><label className="block text-sm font-medium mb-1.5">Title *</label><input name="title" defaultValue={editing?.title} required className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1.5">Image URL</label><input name="imageUrl" defaultValue={editing?.imageUrl} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1.5">Link URL</label><input name="link" defaultValue={editing?.link} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium mb-1.5">Position</label><input name="position" type="number" defaultValue={editing?.position ?? 0} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm" /></div>
                <div><label className="block text-sm font-medium mb-1.5">Status</label>
                  <select name="status" defaultValue={editing?.status || 'active'} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm">
                    <option value="active">Active</option><option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors">Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManagement;
