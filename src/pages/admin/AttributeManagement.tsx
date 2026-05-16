import { useState, useMemo } from 'react';
import { Tag, Plus, Pencil, Trash2, X } from 'lucide-react';
import { products } from '@/data/adminSharedData';
import { useAdminStore } from '@/hooks/useAdminStore';
import { toast } from 'sonner';

interface Attribute {
  name: string;
  type: string;
  values: string[];
}

const AttributeManagement = () => {
  useAdminStore();
  const [showForm, setShowForm] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [customAttrs, setCustomAttrs] = useState<Attribute[]>([]);
  const [form, setForm] = useState<Attribute>({ name: '', type: 'text', values: [] });
  const [valInput, setValInput] = useState('');

  const derived = useMemo(() => {
    const tagSet = new Set<string>();
    const weightSet = new Set<string>();
    products.forEach(p => {
      p.tags.forEach(t => tagSet.add(t));
      if (p.weight) weightSet.add(p.weight);
    });
    return [
      { name: 'Tags', type: 'text', values: Array.from(tagSet).sort() },
      { name: 'Weight/Size', type: 'text', values: Array.from(weightSet).sort() },
    ];
  }, [products.length]);

  const allAttrs = [...derived, ...customAttrs];

  const openAdd = () => { setEditIdx(null); setForm({ name: '', type: 'text', values: [] }); setValInput(''); setShowForm(true); };
  const openEdit = (idx: number) => {
    const a = customAttrs[idx];
    setEditIdx(idx); setForm({ ...a }); setValInput(a.values.join(', ')); setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    const attr = { ...form, values: valInput.split(',').map(v => v.trim()).filter(Boolean) };
    if (editIdx !== null) {
      const updated = [...customAttrs]; updated[editIdx] = attr; setCustomAttrs(updated);
      toast.success('Attribute updated');
    } else {
      setCustomAttrs([...customAttrs, attr]);
      toast.success('Attribute added');
    }
    setShowForm(false);
  };

  const handleDelete = (idx: number) => {
    setCustomAttrs(customAttrs.filter((_, i) => i !== idx));
    toast.success('Attribute deleted');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Attributes</h2>
          <p className="text-sm text-muted-foreground">Product attributes (derived + custom)</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"><Plus className="h-4 w-4" /> Add Attribute</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allAttrs.map((attr, i) => {
          const isCustom = i >= derived.length;
          const customIdx = i - derived.length;
          return (
            <div key={attr.name + i} className="rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Tag className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm">{attr.name}</h4>
                  <p className="text-xs text-muted-foreground">Type: {attr.type} · {attr.values.length} values {!isCustom && '(derived)'}</p>
                </div>
                {isCustom && (
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(customIdx)} className="p-1 rounded hover:bg-muted"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => handleDelete(customIdx)} className="p-1 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {attr.values.map(val => (
                  <span key={val} className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium">{val}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{editIdx !== null ? 'Edit Attribute' : 'Add Attribute'}</h3>
              <button onClick={() => setShowForm(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="text">Text</option>
                  <option value="color">Color</option>
                  <option value="number">Number</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Values (comma-separated)</label>
                <input value={valInput} onChange={e => setValInput(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleSave} className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">{editIdx !== null ? 'Update' : 'Add'}</button>
                <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttributeManagement;
