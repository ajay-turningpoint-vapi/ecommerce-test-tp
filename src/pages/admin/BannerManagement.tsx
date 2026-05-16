import { useState } from 'react';
import { Plus, Edit2, Trash2, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { generateMockBanners, BannerData } from '@/data/adminMockData';
import { toast } from 'sonner';

const types = ['Homepage', 'Campaign', 'Sale', 'Category'];

const BannerManagement = () => {
  const [banners, setBanners] = useState<BannerData[]>(() => generateMockBanners());
  const [typeFilter, setTypeFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BannerData | null>(null);

  const filtered = typeFilter === 'All' ? banners : banners.filter(b => b.type === typeFilter);

  const toggleActive = (id: string) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b));
    toast.success('Banner status updated');
  };

  const deleteBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    toast.success('Banner deleted');
  };

  const saveBanner = (banner: BannerData) => {
    if (editing) setBanners(prev => prev.map(b => b.id === banner.id ? banner : b));
    else setBanners(prev => [...prev, { ...banner, id: `ban-${Date.now()}` }]);
    setShowForm(false); setEditing(null);
    toast.success(editing ? 'Banner updated' : 'Banner added');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Banners & Promotions</h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          <Plus className="h-4 w-4" /> Add Banner
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['All', ...types].map(t => (
          <button key={t} onClick={() => setTypeFilter(t)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${typeFilter === t ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}>{t}</button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(b => (
          <div key={b.id} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="aspect-[16/7] bg-muted flex items-center justify-center">
              <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-sm">{b.title}</h4>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${b.isActive ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'}`}>
                  {b.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{b.type}</p>
              <div className="flex gap-1">
                <button onClick={() => toggleActive(b.id)} className="p-1.5 rounded hover:bg-muted">
                  {b.isActive ? <ToggleRight className="h-4 w-4 text-green-600" /> : <ToggleLeft className="h-4 w-4" />}
                </button>
                <button onClick={() => { setEditing(b); setShowForm(true); }} className="p-1.5 rounded hover:bg-muted"><Edit2 className="h-4 w-4" /></button>
                <button onClick={() => deleteBanner(b.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

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

const BannerForm = ({ initial, onSave }: { initial: BannerData | null; onSave: (b: BannerData) => void }) => {
  const [title, setTitle] = useState(initial?.title || '');
  const [type, setType] = useState(initial?.type || 'Homepage');
  const [link, setLink] = useState(initial?.link || '/');
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);

  return (
    <form onSubmit={e => { e.preventDefault(); onSave({ id: initial?.id || '', title, type, image: initial?.image || '/placeholder.svg', link, isActive, startDate: new Date().toISOString(), endDate: new Date(Date.now() + 30 * 86400000).toISOString() }); }} className="space-y-3">
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Banner Title" className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
      <select value={type} onChange={e => setType(e.target.value)} className="w-full rounded-lg border border-border px-3 py-2 text-sm">
        {types.map(t => <option key={t}>{t}</option>)}
      </select>
      <input value={link} onChange={e => setLink(e.target.value)} placeholder="Link URL" className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} /> Active
      </label>
      <button type="submit" className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground">Save</button>
    </form>
  );
};

export default BannerManagement;
