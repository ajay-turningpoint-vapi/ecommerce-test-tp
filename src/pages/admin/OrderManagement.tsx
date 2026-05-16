import { useState, useMemo } from 'react';
import { Eye, X, Search } from 'lucide-react';
import { useAdminOrders, useAdminMutation } from '@/hooks/useAdminData';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const statusColors: Record<string, string> = {
  ORDER_PLACED: 'bg-yellow-100 text-yellow-800', CONFIRMED: 'bg-blue-100 text-blue-800',
  PACKED: 'bg-purple-100 text-purple-800', SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800', CANCELLED: 'bg-red-100 text-red-800',
  RETURN_REQUESTED: 'bg-orange-100 text-orange-800',
};

const allStatuses = ['ORDER_PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED'];

const OrderManagement = () => {
  const { data: orders = [], isLoading } = useAdminOrders();
  const { update } = useAdminMutation('orders');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const filtered = useMemo(() =>
    orders.filter((o: any) => {
      const matchSearch = o.order_number.toLowerCase().includes(search.toLowerCase()) ||
        (o.user_addresses?.name || '').toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || o.status === statusFilter;
      return matchSearch && matchStatus;
    }),
    [orders, search, statusFilter]
  );

  const updateStatus = (id: string, status: string) => {
    update.mutate({ id, status }, {
      onSuccess: () => { toast.success(`Order status updated to ${status}`); setSelectedOrder(null); },
      onError: (e) => toast.error(e.message),
    });
  };

  const detail = selectedOrder ? orders.find((o: any) => o.id === selectedOrder) : null;

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full" /></div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Order Management</h2>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order # or name..."
            className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
          <option>All</option>
          {allStatuses.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
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
            {filtered.map((o: any) => (
              <tr key={o.id} className="border-b border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{o.order_number}</td>
                <td className="px-4 py-3">{o.users?.name || o.user_addresses?.name || '—'}</td>
                <td className="px-4 py-3">{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                <td className="px-4 py-3 font-medium">₹{o.total_amount}</td>
                <td className="px-4 py-3">{o.payment_status}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[o.status] || 'bg-muted'}`}>{o.status.replace(/_/g, ' ')}</span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => setSelectedOrder(o.id)} className="p-1.5 rounded hover:bg-muted"><Eye className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No orders found</p>}
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-lg max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Order {detail.order_number}</h3>
              <button onClick={() => setSelectedOrder(null)}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-muted-foreground">Date:</span> {new Date(detail.created_at).toLocaleString('en-IN')}</div>
                <div><span className="text-muted-foreground">Payment:</span> {detail.payment_status}</div>
                <div><span className="text-muted-foreground">Status:</span> <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[detail.status]}`}>{detail.status.replace(/_/g, ' ')}</span></div>
                <div><span className="text-muted-foreground">Total:</span> <strong>₹{detail.total_amount}</strong></div>
              </div>
              <hr className="border-border" />
              <div>
                <p className="font-medium mb-1">Items</p>
                {(detail.order_items || []).map((item: any) => (
                  <div key={item.id} className="flex justify-between py-1">
                    <span>{item.product_name} × {item.quantity}</span>
                    <span>₹{Number(item.price) * item.quantity}</span>
                  </div>
                ))}
              </div>
              {detail.user_addresses && (
                <>
                  <hr className="border-border" />
                  <div>
                    <p className="font-medium mb-1">Shipping Address</p>
                    <p>{detail.user_addresses.name}, {detail.user_addresses.address_line1}</p>
                    <p className="text-muted-foreground">{detail.user_addresses.city} - {detail.user_addresses.pincode}</p>
                    {detail.user_addresses.phone && <p className="text-muted-foreground">{detail.user_addresses.phone}</p>}
                  </div>
                </>
              )}
              <hr className="border-border" />
              <div>
                <p className="font-medium mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {allStatuses.map(s => (
                    <button key={s} onClick={() => updateStatus(detail.id, s)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border ${detail.status === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}>
                      {s.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
