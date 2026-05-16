import { useState, useMemo } from 'react';
import AdminPagination from '@/components/admin/AdminPagination';
import { Search, Eye, X, Pencil, Trash2 } from 'lucide-react';
import { getOrders, updateItem, deleteItem } from '@/data/adminSharedData';
import { useAdminStore } from '@/hooks/useAdminStore';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  Confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  Packed: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  Shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  Delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  'Return Requested': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
};

const allStatuses = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Return Requested'];

const OrderManagement = () => {
  useAdminStore();
  const orders = getOrders();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const filtered = useMemo(() =>
    orders.filter(o => {
      const matchSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.address.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || o.status === statusFilter;
      return matchSearch && matchStatus;
    }),
    [orders, search, statusFilter]
  );

  const detail = selectedId ? orders.find(o => o.id === selectedId) : null;

  const handleStatusChange = (id: string) => {
    updateItem(orders, id, { status: editStatus });
    toast.success('Order status updated');
    setEditId(null);
  };

  const handleDelete = (id: string) => {
    deleteItem(orders, id);
    toast.success('Order deleted');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Order Management ({orders.length})</h2>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order # or customer..."
            className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
          <option>All</option>
          {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/50">
            <th className="text-left px-4 py-3 font-medium">Order #</th>
            <th className="text-left px-4 py-3 font-medium">Customer</th>
            <th className="text-left px-4 py-3 font-medium">Date</th>
            <th className="text-left px-4 py-3 font-medium">Total</th>
            <th className="text-left px-4 py-3 font-medium">Payment</th>
            <th className="text-left px-4 py-3 font-medium">Status</th>
            <th className="text-left px-4 py-3 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {(() => {
              const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
              const safePage = Math.min(page, totalPages);
              return filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE).map(o => (
              <tr key={o.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium">{o.orderNumber}</td>
                <td className="px-4 py-3">{o.address.name}</td>
                <td className="px-4 py-3">{new Date(o.date).toLocaleDateString('en-IN')}</td>
                <td className="px-4 py-3 font-medium">₹{o.total}</td>
                <td className="px-4 py-3">{o.paymentMethod}</td>
                <td className="px-4 py-3">
                  {editId === o.id ? (
                    <div className="flex gap-1 items-center">
                      <select value={editStatus} onChange={e => setEditStatus(e.target.value)} className="rounded border border-border bg-background px-1 py-0.5 text-xs">
                        {allStatuses.map(s => <option key={s}>{s}</option>)}
                      </select>
                      <button onClick={() => handleStatusChange(o.id)} className="text-xs text-primary font-medium">Save</button>
                      <button onClick={() => setEditId(null)} className="text-xs text-muted-foreground">✕</button>
                    </div>
                  ) : (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[o.status] || 'bg-muted'}`}>{o.status}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => setSelectedId(o.id)} className="p-1.5 rounded hover:bg-muted transition-colors"><Eye className="h-4 w-4" /></button>
                    <button onClick={() => { setEditId(o.id); setEditStatus(o.status); }} className="p-1.5 rounded hover:bg-muted transition-colors"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(o.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ));})()}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No orders found</p>}
        <AdminPagination currentPage={page} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-lg max-h-[80vh] overflow-y-auto p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Order {detail.orderNumber}</h3>
              <button onClick={() => setSelectedId(null)}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-muted-foreground">Customer:</span> {detail.address.name}</div>
                <div><span className="text-muted-foreground">Email:</span> {detail.address.email}</div>
                <div><span className="text-muted-foreground">Phone:</span> {detail.address.phone}</div>
                <div><span className="text-muted-foreground">Payment:</span> {detail.paymentMethod}</div>
                <div><span className="text-muted-foreground">Address:</span> {detail.address.house}, {detail.address.road}, {detail.address.city} - {detail.address.pincode}</div>
                <div><span className="text-muted-foreground">Total:</span> <strong>₹{detail.total}</strong></div>
              </div>
              <hr className="border-border" />
              <div>
                <p className="font-medium mb-1">Items</p>
                {detail.items.map((item, i) => {
                  const variant = item.product.variants.find(v => v.id === item.variantId);
                  return (
                    <div key={i} className="flex justify-between py-1">
                      <span>{item.product.name} ({variant?.name || item.variantId}) × {item.quantity}</span>
                      <span>₹{(variant?.price || 0) * item.quantity}</span>
                    </div>
                  );
                })}
              </div>
              <hr className="border-border" />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>Subtotal: ₹{detail.subtotal}</div>
                <div>Delivery: ₹{detail.delivery}</div>
                <div>Savings: ₹{detail.savings}</div>
                <div className="font-bold">Total: ₹{detail.total}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
