import { useState, useMemo } from 'react';
import { products, updateItem } from '@/data/adminSharedData';
import { useAdminStore } from '@/hooks/useAdminStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Percent, Pencil, X } from 'lucide-react';
import { toast } from 'sonner';

const DiscountManagement = () => {
  useAdminStore();
  const [editId, setEditId] = useState<string | null>(null);
  const [editDiscount, setEditDiscount] = useState(0);

  const discountedProducts = useMemo(() =>
    products.filter(p => p.discount > 0).sort((a, b) => b.discount - a.discount),
    [products.length]
  );

  const handleSave = () => {
    updateItem(products, editId!, { discount: editDiscount });
    toast.success('Discount updated');
    setEditId(null);
  };

  const handleSetDiscount = (id: string) => {
    const p = products.find(x => x.id === id);
    if (p) { setEditId(id); setEditDiscount(p.discount); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Discounts</h1>
        <p className="text-muted-foreground text-sm">Products with active discounts — click edit to change</p>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Variants</TableHead>
              <TableHead>Price Range</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {discountedProducts.map(p => {
              const prices = p.variants.map(v => v.price);
              return (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <img src={p.image} alt={p.name} className="h-8 w-8 rounded object-cover" />
                      <span className="max-w-[200px] truncate">{p.name}</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{p.categoryId}</Badge></TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1 text-green-600 font-bold">
                      <Percent className="h-3 w-3" /> {p.discount}%
                    </span>
                  </TableCell>
                  <TableCell>{p.variants.length}</TableCell>
                  <TableCell>₹{Math.min(...prices)} – ₹{Math.max(...prices)}</TableCell>
                  <TableCell>
                    <button onClick={() => handleSetDiscount(p.id)} className="p-1.5 rounded hover:bg-muted transition-colors"><Pencil className="h-4 w-4" /></button>
                  </TableCell>
                </TableRow>
              );
            })}
            {discountedProducts.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No discounted products</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">
          <strong>{discountedProducts.length}</strong> of {products.length} products have active discounts.
          Average discount: <strong>{discountedProducts.length > 0 ? (discountedProducts.reduce((s, p) => s + p.discount, 0) / discountedProducts.length).toFixed(1) : 0}%</strong>
        </p>
      </div>

      {editId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-sm p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Edit Discount</h3>
              <button onClick={() => setEditId(null)}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Discount %</label>
                <input type="number" min={0} max={100} value={editDiscount} onChange={e => setEditDiscount(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleSave} className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">Update</button>
                <button onClick={() => setEditId(null)} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountManagement;
