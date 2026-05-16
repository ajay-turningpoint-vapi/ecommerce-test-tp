import { useMemo } from 'react';
import { products } from '@/data/adminSharedData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Percent } from 'lucide-react';

const DiscountManagement = () => {
  const discountedProducts = useMemo(() =>
    products.filter(p => p.discount > 0).sort((a, b) => b.discount - a.discount),
    []
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Discounts</h1>
        <p className="text-muted-foreground text-sm">Products with active discounts from the catalog</p>
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
                </TableRow>
              );
            })}
            {discountedProducts.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No discounted products</TableCell></TableRow>
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
    </div>
  );
};

export default DiscountManagement;
