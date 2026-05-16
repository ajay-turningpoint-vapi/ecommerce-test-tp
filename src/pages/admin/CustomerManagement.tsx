import { useState, useMemo } from 'react';
import AdminPagination, { usePagination } from '@/components/admin/AdminPagination';
import { Search, Ban, CheckCircle, Eye, X } from 'lucide-react';
import { store } from '@/data/adminStore';
import { toast } from 'sonner';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([...store.customers]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any>(null);

  const filtered = useMemo(() =>
    customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())),
    [customers, search]
  );

  const toggleBlock = (id: string) => {
    const c = store.customers.find(c => c.id === id);
    if (c) { c.status = c.status === 'active' ? 'blocked' : 'active'; setCustomers([...store.customers]); toast.success('Customer status updated'); }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Customers</h2>
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
            {filtered.map(c => (
              <tr key={c.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3">{c.email}</td>
                <td className="px-4 py-3">{c.totalOrders}</td>
                <td className="px-4 py-3">₹{c.totalSpent.toLocaleString()}</td>
                <td className="px-4 py-3">{new Date(c.joinDate).toLocaleDateString('en-IN')}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>{c.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => setSelected(c)} className="p-1.5 rounded hover:bg-muted transition-colors"><Eye className="h-4 w-4" /></button>
                    <button onClick={() => toggleBlock(c.id)} className="p-1.5 rounded hover:bg-muted transition-colors">
                      {c.status === 'active' ? <Ban className="h-4 w-4 text-destructive" /> : <CheckCircle className="h-4 w-4 text-green-600" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No customers found</p>}
      </div>

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
              <p><span className="text-muted-foreground">Status:</span> <span className={selected.status === 'active' ? 'text-green-600' : 'text-destructive'}>{selected.status}</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
