import { useState, useMemo } from 'react';
import AdminPagination from '@/components/admin/AdminPagination';
import { Search, MapPin } from 'lucide-react';
import { getShipments } from '@/data/adminSharedData';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  'In Transit': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  'Return Pickup Pending': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
};

const ShippingManagement = () => {
  const shipments = useMemo(() => getShipments(), []);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const filtered = useMemo(() =>
    shipments.filter(s => s.orderNumber.toLowerCase().includes(search.toLowerCase()) || s.trackingNumber.toLowerCase().includes(search.toLowerCase())),
    [shipments, search]
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Shipping Management ({shipments.length})</h2>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order # or tracking #..."
          className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" />
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/50">
            <th className="text-left px-4 py-3 font-medium">Order #</th>
            <th className="text-left px-4 py-3 font-medium">Carrier</th>
            <th className="text-left px-4 py-3 font-medium">Tracking #</th>
            <th className="text-left px-4 py-3 font-medium">Status</th>
            <th className="text-left px-4 py-3 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {(() => {
              const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
              const safePage = Math.min(page, totalPages);
              return filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE).map(s => (
              <tr key={s.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium">{s.orderNumber}</td>
                <td className="px-4 py-3">{s.carrier}</td>
                <td className="px-4 py-3 font-mono text-xs">{s.trackingNumber}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[s.status] || 'bg-muted'}`}>{s.status}</span></td>
                <td className="px-4 py-3">
                  <button onClick={() => toast.info(`Tracking: ${s.trackingNumber}`)} className="p-1.5 rounded hover:bg-muted transition-colors"><MapPin className="h-4 w-4" /></button>
                </td>
              </tr>
            ));})()}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No shipments found</p>}
        <AdminPagination currentPage={page} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default ShippingManagement;
