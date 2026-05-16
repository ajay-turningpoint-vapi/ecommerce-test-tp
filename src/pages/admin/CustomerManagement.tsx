import { useState, useMemo } from 'react';
import { Search, Ban, CheckCircle, Eye, X } from 'lucide-react';
import { useAdminCustomers, useAdminMutation } from '@/hooks/useAdminData';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const CustomerManagement = () => {
  const { data: customers = [], isLoading } = useAdminCustomers();
  const { update } = useAdminMutation('customers');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any>(null);

  const filtered = useMemo(() =>
    customers.filter((c: any) =>
      c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
    ),
    [customers, search]
  );

  const toggleBlock = (customer: any) => {
    const newStatus = customer.status === 'active' ? 'blocked' : 'active';
    update.mutate({ id: customer.id, status: newStatus }, {
      onSuccess: () => toast.success('Customer status updated'),
      onError: (e) => toast.error(e.message),
    });
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full" /></div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Customers</h2>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..."
          className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm" />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/50">
            <th className="text-left px-4 py-3 font-medium">Name</th>
            <th className="text-left px-4 py-3 font-medium">Email</th>
            <th className="text-left px-4 py-3 font-medium">Phone</th>
            <th className="text-left px-4 py-3 font-medium">Joined</th>
            <th className="text-left px-4 py-3 font-medium">Status</th>
            <th className="text-left px-4 py-3 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map((c: any) => (
              <tr key={c.id} className="border-b border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3">{c.email}</td>
                <td className="px-4 py-3">{c.phone || '—'}</td>
                <td className="px-4 py-3">{new Date(c.created_at).toLocaleDateString('en-IN')}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{c.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => setSelected(c)} className="p-1.5 rounded hover:bg-muted"><Eye className="h-4 w-4" /></button>
                    <button onClick={() => toggleBlock(c)} className="p-1.5 rounded hover:bg-muted" title={c.status === 'active' ? 'Block' : 'Unblock'}>
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
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Customer Profile</h3>
              <button onClick={() => setSelected(null)}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Name:</span> {selected.name}</p>
              <p><span className="text-muted-foreground">Email:</span> {selected.email}</p>
              <p><span className="text-muted-foreground">Phone:</span> {selected.phone || '—'}</p>
              <p><span className="text-muted-foreground">Joined:</span> {new Date(selected.created_at).toLocaleDateString('en-IN')}</p>
              <p><span className="text-muted-foreground">Status:</span> <span className={selected.status === 'active' ? 'text-green-600' : 'text-destructive'}>{selected.status}</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
