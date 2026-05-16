import { useState } from 'react';
import AdminPagination, { usePagination } from '@/components/admin/AdminPagination';
import { CheckCircle, XCircle, Eye, X } from 'lucide-react';
import { store } from '@/data/adminStore';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  REQUESTED: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  APPROVED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  PICKED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  REFUNDED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
};

const ReturnsManagement = () => {
  const [returns, setReturns] = useState([...store.returns]);
  const [selected, setSelected] = useState<any>(null);

  const updateStatus = (id: string, status: string) => {
    const r = store.returns.find(r => r.id === id);
    if (r) { r.status = status; setReturns([...store.returns]); toast.success(`Return ${status.toLowerCase()}`); }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Returns & Refunds</h2>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/50">
            <th className="text-left px-4 py-3 font-medium">Order #</th>
            <th className="text-left px-4 py-3 font-medium">Product</th>
            <th className="text-left px-4 py-3 font-medium">Reason</th>
            <th className="text-left px-4 py-3 font-medium">Refund</th>
            <th className="text-left px-4 py-3 font-medium">Status</th>
            <th className="text-left px-4 py-3 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {returns.map(r => (
              <tr key={r.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium">{r.orderNumber}</td>
                <td className="px-4 py-3 max-w-[150px] truncate">{r.productName}</td>
                <td className="px-4 py-3">{r.reason}</td>
                <td className="px-4 py-3">₹{r.refundAmount}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status] || 'bg-muted'}`}>{r.status}</span></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => setSelected(r)} className="p-1.5 rounded hover:bg-muted transition-colors"><Eye className="h-4 w-4" /></button>
                    {r.status === 'REQUESTED' && (
                      <>
                        <button onClick={() => updateStatus(r.id, 'APPROVED')} className="p-1.5 rounded hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"><CheckCircle className="h-4 w-4 text-green-600" /></button>
                        <button onClick={() => updateStatus(r.id, 'REFUNDED')} className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"><XCircle className="h-4 w-4 text-destructive" /></button>
                      </>
                    )}
                    {r.status === 'APPROVED' && (
                      <button onClick={() => updateStatus(r.id, 'REFUNDED')} className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-medium">Refund</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {returns.length === 0 && <p className="text-center text-muted-foreground py-8">No return requests</p>}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Return Details</h3>
              <button onClick={() => setSelected(null)}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Order:</span> {selected.orderNumber}</p>
              <p><span className="text-muted-foreground">Product:</span> {selected.productName}</p>
              <p><span className="text-muted-foreground">Reason:</span> {selected.reason}</p>
              <p><span className="text-muted-foreground">Refund Amount:</span> ₹{selected.refundAmount}</p>
              <p><span className="text-muted-foreground">Request Date:</span> {new Date(selected.requestDate).toLocaleDateString('en-IN')}</p>
              <p><span className="text-muted-foreground">Status:</span> <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[selected.status]}`}>{selected.status}</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnsManagement;
