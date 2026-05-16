import { useState, useMemo } from 'react';
import { Search, Printer, MapPin } from 'lucide-react';
import { store } from '@/data/adminStore';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  IN_TRANSIT: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  RETURN_PICKUP: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
};

const ShippingManagement = () => {
  const shipments = store.shipments;
  const [search, setSearch] = useState('');

  const filtered = useMemo(() =>
    shipments.filter(s => s.orderNumber.toLowerCase().includes(search.toLowerCase()) || s.trackingNumber.toLowerCase().includes(search.toLowerCase())),
    [shipments, search]
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Shipping Management</h2>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order # or tracking #..."
          className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" />
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/50">
            <th className="text-left px-4 py-3 font-medium">Order #</th>
            <th className="text-left px-4 py-3 font-medium">Courier</th>
            <th className="text-left px-4 py-3 font-medium">Tracking #</th>
            <th className="text-left px-4 py-3 font-medium">Status</th>
            <th className="text-left px-4 py-3 font-medium">Shipped</th>
            <th className="text-left px-4 py-3 font-medium">Est. Delivery</th>
            <th className="text-left px-4 py-3 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium">{s.orderNumber}</td>
                <td className="px-4 py-3">{s.courier}</td>
                <td className="px-4 py-3 font-mono text-xs">{s.trackingNumber}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[s.status] || 'bg-muted'}`}>{s.status.replace(/_/g, ' ')}</span></td>
                <td className="px-4 py-3 text-xs">{s.shippedAt ? new Date(s.shippedAt).toLocaleDateString('en-IN') : '—'}</td>
                <td className="px-4 py-3 text-xs">{s.estimatedDelivery ? new Date(s.estimatedDelivery).toLocaleDateString('en-IN') : '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => toast.success('Label printed!')} className="p-1.5 rounded hover:bg-muted transition-colors"><Printer className="h-4 w-4" /></button>
                    <button onClick={() => toast.info(`Tracking: ${s.trackingNumber}`)} className="p-1.5 rounded hover:bg-muted transition-colors"><MapPin className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No shipments found</p>}
      </div>
    </div>
  );
};

export default ShippingManagement;
