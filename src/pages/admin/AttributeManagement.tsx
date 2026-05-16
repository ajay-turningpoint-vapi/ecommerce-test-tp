import { useMemo } from 'react';
import { Tag } from 'lucide-react';
import { products } from '@/data/adminSharedData';

const AttributeManagement = () => {
  const attributes = useMemo(() => {
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
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Attributes</h2>
      <p className="text-sm text-muted-foreground">Attributes extracted from user panel products</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {attributes.map(attr => (
          <div key={attr.name} className="rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Tag className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">{attr.name}</h4>
                <p className="text-xs text-muted-foreground">Type: {attr.type} · {attr.values.length} values</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {attr.values.map((val) => (
                <span key={val} className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium">{val}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttributeManagement;
