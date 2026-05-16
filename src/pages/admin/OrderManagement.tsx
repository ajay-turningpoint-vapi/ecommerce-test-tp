import { useState, useMemo } from 'react';
import { Eye, X, FileText, Search } from 'lucide-react';
import { generateMockOrders } from '@/data/adminMockData';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800', Confirmed: 'bg-blue-100 text-blue-800',
  Packed: 'bg-purple-100 text-purple-800', Shipped: 'bg-indigo-100 text-indigo-800',
  Delivered: 'bg-green-100 text-green-800', Cancelled: 'bg-red-100 text-red-800',
  'Return Requested': 'bg-orange-100 text-orange-800',
};

const allStatuses = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Return Requested'];

const OrderManagement = () => {
  const [orders, setOrders] = useState(() => generateMockOrders(50));
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return orders.filter(o => {
      const matchSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) || o.address.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  const updateStatus = (id: string, status: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    toast.success(`Order status updated to ${status}`);
  };

  const cancelOrder = (id: string) => {
    updateStatus(id, 'Cancelled');
  };

  const approveReturn = (id: string) => {
    updateStatus(id, 'Cancelled');
    toast.success('Return approved and order cancelled');
  };

  const detail = selectedOrder ? orders.find(o => o.id === selectedOrder) : null;

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
          {allStatuses.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium">Order #</th>
              <th className="text-left px-4 py-3 font-medium">Customer</th>
              <th className="text-left px-4 py-3 font-medium">Date</th>
              <th className="text-left px-4 py-3 font-medium">Total</th>
              <th className="text-left px-4 py-3 font-medium">Payment</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id} className="border-b border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{o.orderNumber}</td>
                <td className="px-4 py-3">{o.address.name}</td>
                <td className="px-4 py-3">{new Date(o.date).toLocaleDateString('en-IN')}</td>
                <td className="px-4 py-3 font-medium">₹{o.total}</td>
                <td className="px-4 py-3">{o.paymentMethod}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[o.status] || 'bg-muted'}`}>{o.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setSelectedOrder(o.id)} className="p-1.5 rounded hover:bg-muted" title="View"><Eye className="h-4 w-4" /></button>
                    {o.status !== 'Cancelled' && o.status !== 'Delivered' && (
                      <button onClick={() => cancelOrder(o.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive" title="Cancel"><X className="h-4 w-4" /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No orders found</p>}
      </div>

      {/* Order Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-lg max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Order {detail.orderNumber}</h3>
              <button onClick={() => setSelectedOrder(null)}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-muted-foreground">Date:</span> {new Date(detail.date).toLocaleString('en-IN')}</div>
                <div><span className="text-muted-foreground">Payment:</span> {detail.paymentMethod}</div>
                <div><span className="text-muted-foreground">Status:</span> <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[detail.status]}`}>{detail.status}</span></div>
                <div><span className="text-muted-foreground">Total:</span> <strong>₹{detail.total}</strong></div>
              </div>
              <hr className="border-border" />
              <div>
                <p className="font-medium mb-1">Items</p>
                {detail.items.map(item => (
                  <div key={item.variantId} className="flex justify-between py-1">
                    <span>{item.product.name} × {item.quantity}</span>
                    <span>₹{(item.product.variants.find(v => v.id === item.variantId)?.price || 0) * item.quantity}</span>
                  </div>
                ))}
              </div>
              <hr className="border-border" />
              <div>
                <p className="font-medium mb-1">Shipping Address</p>
                <p>{detail.address.name}, {detail.address.house}, {detail.address.road} - {detail.address.pincode}</p>
                <p className="text-muted-foreground">{detail.address.phone} | {detail.address.email}</p>
              </div>
              <hr className="border-border" />
              <div>
                <p className="font-medium mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {allStatuses.map(s => (
                    <button key={s} onClick={() => { updateStatus(detail.id, s); setSelectedOrder(null); }}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border ${detail.status === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              {detail.status === 'Return Requested' && (
                <button onClick={() => { approveReturn(detail.id); setSelectedOrder(null); }}
                  className="w-full mt-2 rounded-lg bg-green-600 py-2 text-sm font-bold text-white">
                  Approve Return
                </button>
              )}
              <button onClick={() => { toast.success('Invoice generated!'); }}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-border py-2 text-sm font-medium hover:bg-muted">
                <FileText className="h-4 w-4" /> Generate Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
