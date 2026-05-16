import { useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, X, Tag } from 'lucide-react';
import { store, addItem, updateItem, deleteItem, type Attribute } from '@/data/adminStore';
import { toast } from 'sonner';

const AttributeManagement = () => {
  const [attrs, setAttrs] = useState<Attribute[]>([...store.attributes]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Attribute | null>(null);

  const refresh = useCallback(() => setAttrs([...store.attributes]), []);

  const save = (data: Omit<Attribute, 'id'>) => {
    if (editing) {
      updateItem(store.attributes, editing.id, data);
      toast.success('Attribute updated');
    } else {
      addItem(store.attributes, data);
      toast.success('Attribute created');
    }
    refresh(); setShowForm(false); setEditing(null);
  };

  const remove = (id: string) => {
    const inUse = store.variantAttributes.some(va => va.attributeId === id);
    if (inUse) { toast.error('Attribute is assigned to variants — remove assignments first'); return; }
    deleteItem(store.attributes, id);
    toast.success('Attribute deleted');
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Attributes</h2>
          <p className="text-sm text-muted-foreground mt-1">Step 3 — Define variant attributes (Color, Size, Finish, etc.)</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Add Attribute
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {attrs.map(attr => {
          const usageCount = store.variantAttributes.filter(va => va.attributeId === attr.id).length;
          return (
            <div key={attr.id} className="rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Tag className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{attr.name}</h4>
                    <p className="text-xs text-muted-foreground">Type: {attr.type} · Used in {usageCount} variants</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(attr); setShowForm(true); }}
                    className="p-1.5 rounded hover:bg-muted transition-colors"><Edit2 className="h-3.5 w-3.5" /></button>
                  <button onClick={() => remove(attr.id)}
                    className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {attr.values.map((val, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium">{val}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {attrs.length === 0 && <p className="text-center text-muted-foreground py-8">No attributes defined yet</p>}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">{editing ? 'Edit Attribute' : 'Add Attribute'}</h3>
              <button onClick={() => { setShowForm(false); setEditing(null); }}
                className="p-1 rounded hover:bg-muted transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <AttributeForm initial={editing} onSave={save} />
          </div>
        </div>
      )}
    </div>
  );
};

const AttributeForm = ({ initial, onSave }: { initial: Attribute | null; onSave: (d: Omit<Attribute, 'id'>) => void }) => {
  const [name, setName] = useState(initial?.name || '');
  const [type, setType] = useState(initial?.type || 'text');
  const [valuesStr, setValuesStr] = useState(initial?.values.join(', ') || '');

  return (
    <form onSubmit={e => {
      e.preventDefault();
      if (!name) { toast.error('Attribute name is required'); return; }
      const values = valuesStr.split(',').map(v => v.trim()).filter(Boolean);
      if (values.length === 0) { toast.error('Add at least one value'); return; }
      onSave({ name, type, values });
    }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5">Attribute Name *</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Color"
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Type</label>
        <select value={type} onChange={e => setType(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors">
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="color">Color</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Values (comma-separated) *</label>
        <textarea value={valuesStr} onChange={e => setValuesStr(e.target.value)}
          placeholder="Red, Pink, Nude, Berry" rows={3}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors resize-none" />
        <p className="text-xs text-muted-foreground mt-1">Separate values with commas</p>
      </div>
      <button type="submit"
        className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors mt-2">
        {initial ? 'Update Attribute' : 'Create Attribute'}
      </button>
    </form>
  );
};

export default AttributeManagement;
