import { useState } from 'react';
import { store, addItem, updateItem, deleteItem, Discount } from '@/data/adminStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Percent } from 'lucide-react';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const empty: Omit<Discount, 'id'> = {
  name: '', applyTo: 'product', targetId: '', variantId: null,
  discountType: 'percentage', value: 0,
  minOrderValue: null, maxDiscount: null, usageLimit: null,
  startDate: '', endDate: '', status: 'active',
};

const DiscountManagement = () => {
  const [, setTick] = useState(0);
  const rerender = () => setTick(t => t + 1);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Discount, 'id'>>(empty);

  const openAdd = () => { setEditId(null); setForm(empty); setOpen(true); };
  const openEdit = (d: Discount) => {
    setEditId(d.id);
    const { id, ...rest } = d;
    setForm(rest);
    setOpen(true);
  };

  const save = () => {
    if (!form.name || !form.targetId || !form.value || !form.startDate || !form.endDate) {
      toast.error('Please fill all required fields'); return;
    }
    if (editId) { updateItem(store.discounts, editId, form); toast.success('Discount updated'); }
    else { addItem(store.discounts, form); toast.success('Discount created'); }
    setOpen(false); rerender();
  };

  const remove = (id: string) => { deleteItem(store.discounts, id); toast.success('Deleted'); rerender(); };

  const getTargetLabel = (d: Discount) => {
    if (d.applyTo === 'product') {
      const p = store.products.find(x => x.id === d.targetId);
      const v = d.variantId ? store.variants.find(x => x.id === d.variantId) : null;
      return p ? `${p.title}${v ? ` (${v.sku})` : ''}` : '—';
    }
    if (d.applyTo === 'category') return store.categories.find(x => x.id === d.targetId)?.name || '—';
    if (d.applyTo === 'brand') return store.brands.find(x => x.id === d.targetId)?.name || '—';
    return '—';
  };

  const productVariants = form.applyTo === 'product' ? store.variants.filter(v => v.productId === form.targetId) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Discounts</h1>
          <p className="text-muted-foreground text-sm">Manage product, category & brand discounts</p>
        </div>
        <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" /> Add Discount</Button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Apply To</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {store.discounts.map(d => (
              <TableRow key={d.id}>
                <TableCell className="font-medium">{d.name}</TableCell>
                <TableCell><Badge variant="outline" className="capitalize">{d.applyTo}</Badge></TableCell>
                <TableCell className="max-w-[200px] truncate">{getTargetLabel(d)}</TableCell>
                <TableCell>{d.discountType === 'percentage' ? `${d.value}%` : `₹${d.value}`}</TableCell>
                <TableCell className="text-xs">{d.startDate} → {d.endDate}</TableCell>
                <TableCell>
                  <Badge variant={d.status === 'active' ? 'default' : 'secondary'}>{d.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(d)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(d.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {store.discounts.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">No discounts yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Discount' : 'Add Discount'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="space-y-2">
              <Label>Discount Name *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Lipstick Mega Sale" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm({ ...form, status: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Discount Type *</Label>
                <Select value={form.discountType} onValueChange={v => setForm({ ...form, discountType: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="flat">Flat Amount (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Discount Value *</Label>
              <Input type="number" value={form.value || ''} onChange={e => setForm({ ...form, value: Number(e.target.value) })}
                placeholder={form.discountType === 'percentage' ? 'e.g. 20' : 'e.g. 100'} />
            </div>

            {/* Date range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !form.startDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.startDate ? format(new Date(form.startDate), 'PPP') : 'Pick date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={form.startDate ? new Date(form.startDate) : undefined}
                      onSelect={d => d && setForm({ ...form, startDate: format(d, 'yyyy-MM-dd') })}
                      className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>End Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !form.endDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.endDate ? format(new Date(form.endDate), 'PPP') : 'Pick date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={form.endDate ? new Date(form.endDate) : undefined}
                      onSelect={d => d && setForm({ ...form, endDate: format(d, 'yyyy-MM-dd') })}
                      className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Scope */}
            <div className="space-y-2">
              <Label>Apply To *</Label>
              <Select value={form.applyTo} onValueChange={v => setForm({ ...form, applyTo: v as any, targetId: '', variantId: null })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="brand">Brand</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {form.applyTo === 'product' && (
              <>
                <div className="space-y-2">
                  <Label>Select Product *</Label>
                  <Select value={form.targetId} onValueChange={v => setForm({ ...form, targetId: v, variantId: null })}>
                    <SelectTrigger><SelectValue placeholder="Choose product" /></SelectTrigger>
                    <SelectContent>
                      {store.products.map(p => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {productVariants.length > 0 && (
                  <div className="space-y-2">
                    <Label>Select Variant (optional)</Label>
                    <Select value={form.variantId || 'all'} onValueChange={v => setForm({ ...form, variantId: v === 'all' ? null : v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Variants</SelectItem>
                        {productVariants.map(v => <SelectItem key={v.id} value={v.id}>{v.sku} — {v.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}

            {form.applyTo === 'category' && (
              <div className="space-y-2">
                <Label>Select Category *</Label>
                <Select value={form.targetId} onValueChange={v => setForm({ ...form, targetId: v })}>
                  <SelectTrigger><SelectValue placeholder="Choose category" /></SelectTrigger>
                  <SelectContent>
                    {store.categories.map(c => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.parentId ? `  └ ${c.name}` : c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {form.applyTo === 'brand' && (
              <div className="space-y-2">
                <Label>Select Brand *</Label>
                <Select value={form.targetId} onValueChange={v => setForm({ ...form, targetId: v })}>
                  <SelectTrigger><SelectValue placeholder="Choose brand" /></SelectTrigger>
                  <SelectContent>
                    {store.brands.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Conditions */}
            <div className="border-t border-border pt-4 space-y-4">
              <p className="text-sm font-medium text-muted-foreground">Conditions (optional)</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Min Order (₹)</Label>
                  <Input type="number" value={form.minOrderValue ?? ''} onChange={e => setForm({ ...form, minOrderValue: e.target.value ? Number(e.target.value) : null })} placeholder="500" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Max Discount (₹)</Label>
                  <Input type="number" value={form.maxDiscount ?? ''} onChange={e => setForm({ ...form, maxDiscount: e.target.value ? Number(e.target.value) : null })} placeholder="200" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Usage Limit</Label>
                  <Input type="number" value={form.usageLimit ?? ''} onChange={e => setForm({ ...form, usageLimit: e.target.value ? Number(e.target.value) : null })} placeholder="1000" />
                </div>
              </div>
            </div>

            <Button onClick={save} className="w-full">{editId ? 'Update Discount' : 'Create Discount'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DiscountManagement;
