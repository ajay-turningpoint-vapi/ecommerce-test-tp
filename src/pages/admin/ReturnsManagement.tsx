import { useState, useMemo } from 'react';
import AdminPagination from '@/components/admin/AdminPagination';
import { Eye, X, Pencil, Trash2 } from 'lucide-react';
import { getReturns, updateItem, deleteItem } from '@/data/adminSharedData';
import { useAdminStore } from '@/hooks/useAdminStore';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  Approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  Refunded: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
};

const allStatuses = ['Pending', 'Approved', 'Rejected', 'Refunded'];

const ReturnsManagement = () => {
  useAdminStore();
  const returns = getReturns();
  const [selected, setSelected] = useState<any>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const handleStatusChange = (id: string) => {
    updateItem(returns, id, { status: editStatus });
    toast.success('Return status updated');
    setEditId(null);
  };

  const handleDelete = (id: string) => {
    deleteItem(returns, id);
    toast.success('Return request deleted');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Returns & Refunds ({returns.length})</h2>
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
            {(() => {
              const totalPages = Math.max(1, Math.ceil(returns.length / PAGE_SIZE));
              const safePage = Math.min(page, totalPages);
              return returns.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE).map(r => (
              <tr key={r.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium">{r.orderNumber}</td>
                <td className="px-4 py-3 max-w-[150px] truncate">{r.productName}</td>
                <td className="px-4 py-3">{r.reason}</td>
                <td className="px-4 py-3">₹{r.refundAmount}</td>
                <td className="px-4 py-3">
                  {editId === r.id ? (
                    <div className="flex gap-1 items-center">
                      <select value={editStatus} onChange={e => setEditStatus(e.target.value)} className="rounded border border-border bg-background px-1 py-0.5 text-xs">
                        {allStatuses.map(s => <option key={s}>{s}</option>)}
                      </select>
                      <button onClick={() => handleStatusChange(r.id)} className="text-xs text-primary font-medium">Save</button>
                      <button onClick={() => setEditId(null)} className="text-xs text-muted-foreground">✕</button>
                    </div>
                  ) : (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status] || 'bg-muted'}`}>{r.status}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => setSelected(r)} className="p-1.5 rounded hover:bg-muted transition-colors"><Eye className="h-4 w-4" /></button>
                    <button onClick={() => { setEditId(r.id); setEditStatus(r.status); }} className="p-1.5 rounded hover:bg-muted transition-colors"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ));})()}
          </tbody>
        </table>
        {returns.length === 0 && <p className="text-center text-muted-foreground py-8">No return requests</p>}
        <AdminPagination currentPage={page} totalItems={returns.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
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
