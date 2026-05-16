import { useState, useMemo } from 'react';
import AdminPagination from '@/components/admin/AdminPagination';
import { Search, Eye, X, Pencil, Trash2 } from 'lucide-react';
import { getCustomers, updateItem, deleteItem } from '@/data/adminSharedData';
import { useAdminStore } from '@/hooks/useAdminStore';
import { toast } from 'sonner';
import type { CustomerData } from '@/data/adminMockData';

const CustomerManagement = () => {
  useAdminStore();
  const customers = getCustomers();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<CustomerData | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const filtered = useMemo(() =>
    customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())),
    [customers, search]
  );

  const openEdit = (c: CustomerData) => { setEditId(c.id); setEditForm({ ...c }); };
  const handleSave = () => {
    updateItem(customers, editId!, editForm);
    toast.success('Customer updated');
    setEditId(null);
  };
  const handleDelete = (id: string) => {
    deleteItem(customers, id);
    toast.success('Customer deleted');
  };
  const toggleStatus = (c: CustomerData) => {
    updateItem(customers, c.id, { status: c.status === 'Active' ? 'Blocked' : 'Active' } as any);
    toast.success(`Customer ${c.status === 'Active' ? 'blocked' : 'activated'}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Customers ({customers.length})</h2>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..."
          className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" />
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/50">
            <th className="text-left px-4 py-3 font-medium">Name</th>
            <th className="text-left px-4 py-3 font-medium">Email</th>
            <th className="text-left px-4 py-3 font-medium">Orders</th>
            <th className="text-left px-4 py-3 font-medium">Total Spent</th>
            <th className="text-left px-4 py-3 font-medium">Joined</th>
            <th className="text-left px-4 py-3 font-medium">Status</th>
            <th className="text-left px-4 py-3 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {(() => {
              const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
              const safePage = Math.min(page, totalPages);
              return filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE).map(c => (
              <tr key={c.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3">{c.email}</td>
                <td className="px-4 py-3">{c.totalOrders}</td>
                <td className="px-4 py-3">₹{c.totalSpent.toLocaleString()}</td>
                <td className="px-4 py-3">{new Date(c.joinDate).toLocaleDateString('en-IN')}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleStatus(c)} className={`px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer ${c.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>{c.status}</button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => setSelected(c)} className="p-1.5 rounded hover:bg-muted transition-colors"><Eye className="h-4 w-4" /></button>
                    <button onClick={() => openEdit(c)} className="p-1.5 rounded hover:bg-muted transition-colors"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ));})()}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No customers found</p>}
        <AdminPagination currentPage={page} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>

      {/* View modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Customer Profile</h3>
              <button onClick={() => setSelected(null)}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Name:</span> {selected.name}</p>
              <p><span className="text-muted-foreground">Email:</span> {selected.email}</p>
              <p><span className="text-muted-foreground">Phone:</span> {selected.phone}</p>
              <p><span className="text-muted-foreground">Total Orders:</span> {selected.totalOrders}</p>
              <p><span className="text-muted-foreground">Total Spent:</span> ₹{selected.totalSpent.toLocaleString()}</p>
              <p><span className="text-muted-foreground">Joined:</span> {new Date(selected.joinDate).toLocaleDateString('en-IN')}</p>
              <p><span className="text-muted-foreground">Status:</span> <span className={selected.status === 'Active' ? 'text-green-600' : 'text-destructive'}>{selected.status}</span></p>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Edit Customer</h3>
              <button onClick={() => setEditId(null)}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input value={editForm.email || ''} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input value={editForm.phone || ''} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleSave} className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">Update</button>
                <button onClick={() => setEditId(null)} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
