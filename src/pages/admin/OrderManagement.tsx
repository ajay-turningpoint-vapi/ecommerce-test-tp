import { useState, useMemo } from 'react';
import { Eye, X, Search } from 'lucide-react';
import { store } from '@/data/adminStore';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  ORDER_PLACED: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  CONFIRMED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  PACKED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  SHIPPED: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  RETURN_REQUESTED: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
};

const allStatuses = ['ORDER_PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED'];

const OrderManagement = () => {
  const [orders, setOrders] = useState([...store.orders]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() =>
    orders.filter(o => {
      const matchSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || o.status === statusFilter;
      return matchSearch && matchStatus;
    }),
    [orders, search, statusFilter]
  );

  const updateStatus = (id: string, status: string) => {
    const order = store.orders.find(o => o.id === id);
    if (order) { order.status = status; setOrders([...store.orders]); toast.success(`Status updated to ${status.replace(/_/g, ' ')}`); }
    setSelectedId(null);
  };

  const detail = selectedId ? orders.find(o => o.id === selectedId) : null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Order Management</h2>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order # or customer..."
            className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" />
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
            {filtered.map(o => (
              <tr key={o.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium">{o.orderNumber}</td>
                <td className="px-4 py-3">{o.customerName}</td>
                <td className="px-4 py-3">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                <td className="px-4 py-3 font-medium">₹{o.totalAmount}</td>
                <td className="px-4 py-3">{o.paymentStatus}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[o.status] || 'bg-muted'}`}>{o.status.replace(/_/g, ' ')}</span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => setSelectedId(o.id)} className="p-1.5 rounded hover:bg-muted transition-colors"><Eye className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No orders found</p>}
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
                <div><span className="text-muted-foreground">Customer:</span> {detail.customerName}</div>
                <div><span className="text-muted-foreground">Email:</span> {detail.customerEmail}</div>
                <div><span className="text-muted-foreground">Phone:</span> {detail.phone}</div>
                <div><span className="text-muted-foreground">Payment:</span> {detail.paymentMethod} ({detail.paymentStatus})</div>
                <div><span className="text-muted-foreground">Address:</span> {detail.address}, {detail.city} - {detail.pincode}</div>
                <div><span className="text-muted-foreground">Total:</span> <strong>₹{detail.totalAmount}</strong></div>
              </div>
              <hr className="border-border" />
              <div>
                <p className="font-medium mb-1">Items</p>
                {detail.items.map((item, i) => (
                  <div key={i} className="flex justify-between py-1">
                    <span>{item.productName} ({item.variantSku}) × {item.qty}</span>
                    <span>₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>
              <hr className="border-border" />
              <div>
                <p className="font-medium mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {allStatuses.map(s => (
                    <button key={s} onClick={() => updateStatus(detail.id, s)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${detail.status === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}>
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
