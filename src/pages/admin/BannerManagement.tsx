import { useState } from 'react';
import { Plus, Edit2, Trash2, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAdminBanners, useAdminMutation } from '@/hooks/useAdminData';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const BannerManagement = () => {
  const { data: banners = [], isLoading } = useAdminBanners();
  const { create, update, remove } = useAdminMutation('banners');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const toggleActive = (banner: any) => {
    const newStatus = banner.status === 'active' ? 'inactive' : 'active';
    update.mutate({ id: banner.id, status: newStatus }, {
      onSuccess: () => toast.success('Banner status updated'),
    });
  };

  const deleteBanner = (id: string) => {
    remove.mutate(id, { onSuccess: () => toast.success('Banner deleted') });
  };

  const saveBanner = (data: any) => {
    if (editing) {
      update.mutate({ id: editing.id, ...data }, {
        onSuccess: () => { toast.success('Banner updated'); setShowForm(false); setEditing(null); },
      });
    } else {
      create.mutate(data, {
        onSuccess: () => { toast.success('Banner added'); setShowForm(false); },
      });
    }
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-40 w-full" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Banners & Promotions</h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          <Plus className="h-4 w-4" /> Add Banner
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {banners.map((b: any) => (
          <div key={b.id} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="aspect-[16/7] bg-muted flex items-center justify-center">
              <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-sm">{b.title}</h4>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${b.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'}`}>
                  {b.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Position: {b.position}</p>
              <div className="flex gap-1">
                <button onClick={() => toggleActive(b)} className="p-1.5 rounded hover:bg-muted">
                  {b.status === 'active' ? <ToggleRight className="h-4 w-4 text-green-600" /> : <ToggleLeft className="h-4 w-4" />}
                </button>
                <button onClick={() => { setEditing(b); setShowForm(true); }} className="p-1.5 rounded hover:bg-muted"><Edit2 className="h-4 w-4" /></button>
                <button onClick={() => deleteBanner(b.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {banners.length === 0 && <p className="text-center text-muted-foreground py-8">No banners yet</p>}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{editing ? 'Edit Banner' : 'Add Banner'}</h3>
              <button onClick={() => { setShowForm(false); setEditing(null); }}><X className="h-5 w-5" /></button>
            </div>
            <BannerForm initial={editing} onSave={saveBanner} />
          </div>
        </div>
      )}
    </div>
  );
};

const BannerForm = ({ initial, onSave }: { initial: any; onSave: (d: any) => void }) => {
  const [title, setTitle] = useState(initial?.title || '');
  const [imageUrl, setImageUrl] = useState(initial?.image_url || '');
  const [link, setLink] = useState(initial?.link || '');
  const [position, setPosition] = useState(initial?.position ?? 0);
  const [status, setStatus] = useState(initial?.status || 'active');

  return (
    <form onSubmit={e => { e.preventDefault(); onSave({ title, image_url: imageUrl || '/placeholder.svg', link: link || null, position: Number(position), status }); }} className="space-y-3">
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Banner Title" className="w-full rounded-lg border border-border px-3 py-2 text-sm" required />
      <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Image URL" className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
      <input value={link} onChange={e => setLink(e.target.value)} placeholder="Link URL" className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
      <input type="number" value={position} onChange={e => setPosition(e.target.value)} placeholder="Position" className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
      <select value={status} onChange={e => setStatus(e.target.value)} className="w-full rounded-lg border border-border px-3 py-2 text-sm">
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      <button type="submit" className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground">Save</button>
    </form>
  );
};

export default BannerManagement;
