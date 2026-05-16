import { useState, useMemo } from 'react';
import { Search, Printer, MapPin } from 'lucide-react';
import { useAdminShipments } from '@/hooks/useAdminData';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_TRANSIT: 'bg-blue-100 text-blue-800',
  OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
};

const ShippingManagement = () => {
  const { data: shipments = [], isLoading } = useAdminShipments();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() =>
    shipments.filter((s: any) =>
      (s.orders?.order_number || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.tracking_number || '').toLowerCase().includes(search.toLowerCase())
    ),
    [shipments, search]
  );

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full" /></div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Shipping Management</h2>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order # or tracking #..."
          className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm" />
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
            {filtered.map((s: any) => (
              <tr key={s.id} className="border-b border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{s.orders?.order_number || '—'}</td>
                <td className="px-4 py-3">{s.courier_name || '—'}</td>
                <td className="px-4 py-3 font-mono text-xs">{s.tracking_number || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[s.status] || 'bg-muted'}`}>{s.status.replace(/_/g, ' ')}</span>
                </td>
                <td className="px-4 py-3 text-xs">{s.shipped_at ? new Date(s.shipped_at).toLocaleDateString('en-IN') : '—'}</td>
                <td className="px-4 py-3 text-xs">{s.estimated_delivery ? new Date(s.estimated_delivery).toLocaleDateString('en-IN') : '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => toast.success('Label printed!')} className="p-1.5 rounded hover:bg-muted" title="Print Label"><Printer className="h-4 w-4" /></button>
                    <button onClick={() => toast.info(`Tracking: ${s.tracking_number}`)} className="p-1.5 rounded hover:bg-muted" title="Track"><MapPin className="h-4 w-4" /></button>
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
