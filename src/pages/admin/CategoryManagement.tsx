import { ChevronRight, FolderTree } from 'lucide-react';
import { categories, subCategories } from '@/data/adminSharedData';

const CategoryManagement = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Categories ({categories.length})</h2>

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
                  <div>
                    <p className="font-semibold text-sm">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{childCount} subcategories</p>
                    <p className="text-xs text-muted-foreground font-mono">/{c.slug}</p>
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
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Parent Category</th>
                <th className="text-left px-4 py-3 font-medium">Slug</th>
              </tr>
            </thead>
            <tbody>
              {subCategories.map(s => (
                <tr key={s.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">
                    <div className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                      {s.name}
                    </div>
                  </td>
                  <td className="px-4 py-3">{categories.find(c => c.id === s.categoryId)?.name || '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">/{s.slug}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {subCategories.length === 0 && <p className="text-center text-muted-foreground py-8">No subcategories yet</p>}
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;
