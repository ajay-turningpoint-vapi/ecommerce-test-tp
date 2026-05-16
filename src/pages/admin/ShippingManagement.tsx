import { useState, useMemo } from 'react';
import { Search, Printer, MapPin } from 'lucide-react';
import { generateMockOrders, generateMockShipments, ShipmentData } from '@/data/adminMockData';
import { toast } from 'sonner';

const ShippingManagement = () => {
  const orders = useMemo(() => generateMockOrders(50), []);
  const [shipments, setShipments] = useState<ShipmentData[]>(() => generateMockShipments(orders));
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => shipments.filter(s =>
    s.orderNumber.toLowerCase().includes(search.toLowerCase()) || s.trackingNumber.toLowerCase().includes(search.toLowerCase())
  ), [shipments, search]);

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
            <th className="text-left px-4 py-3 font-medium">Carrier</th>
            <th className="text-left px-4 py-3 font-medium">Tracking #</th>
            <th className="text-left px-4 py-3 font-medium">Status</th>
            <th className="text-left px-4 py-3 font-medium">Pickup</th>
            <th className="text-left px-4 py-3 font-medium">Charge</th>
            <th className="text-left px-4 py-3 font-medium">Type</th>
            <th className="text-left px-4 py-3 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className="border-b border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{s.orderNumber}</td>
                <td className="px-4 py-3">{s.carrier}</td>
                <td className="px-4 py-3 font-mono text-xs">{s.trackingNumber}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    s.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    s.status === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                  }`}>{s.status}</span>
                </td>
                <td className="px-4 py-3 text-xs">{new Date(s.scheduledPickup).toLocaleDateString('en-IN')}</td>
                <td className="px-4 py-3">₹{s.shippingCharge}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${s.isReverse ? 'bg-orange-100 text-orange-800' : 'bg-muted'}`}>
                    {s.isReverse ? 'Reverse' : 'Forward'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => toast.success('Label printed!')} className="p-1.5 rounded hover:bg-muted" title="Print Label"><Printer className="h-4 w-4" /></button>
                    <button onClick={() => toast.info(`Tracking: ${s.trackingNumber}`)} className="p-1.5 rounded hover:bg-muted" title="Track"><MapPin className="h-4 w-4" /></button>
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
