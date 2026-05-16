import { useMemo, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { generateMockOrders, generateMockCustomers } from '@/data/adminMockData';
import { categories } from '@/data/products';

const COLORS = ['hsl(346,77%,50%)', 'hsl(142,71%,45%)', 'hsl(200,80%,50%)', 'hsl(40,90%,50%)', 'hsl(280,60%,50%)'];
const tabs = ['Sales', 'Orders', 'Products', 'Customers', 'Returns', 'Revenue'];

const Reports = () => {
  const [tab, setTab] = useState('Sales');
  const orders = useMemo(() => generateMockOrders(100), []);
  const customers = useMemo(() => generateMockCustomers(30), []);

  const dailyRevenue = useMemo(() => {
    const map: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const key = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      map[key] = 0;
    }
    orders.forEach(o => {
      const key = new Date(o.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      if (key in map) map[key] += o.total;
    });
    return Object.entries(map).map(([name, revenue]) => ({ name, revenue }));
  }, [orders]);

  const ordersByStatus = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach(o => { map[o.status] = (map[o.status] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const productPerformance = useMemo(() => {
    const map: Record<string, { name: string; sold: number; revenue: number }> = {};
    orders.forEach(o => o.items.forEach(item => {
      const k = item.product.id;
      if (!map[k]) map[k] = { name: item.product.name, sold: 0, revenue: 0 };
      const price = item.product.variants.find(v => v.id === item.variantId)?.price || 0;
      map[k].sold += item.quantity;
      map[k].revenue += price * item.quantity;
    }));
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
  }, [orders]);

  const customerGrowth = useMemo(() => {
    const map: Record<string, number> = {};
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      map[d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })] = 0;
    }
    customers.forEach(c => {
      const key = new Date(c.joinDate).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
      if (key in map) map[key]++;
    });
    let cumulative = 0;
    return Object.entries(map).map(([name, count]) => { cumulative += count; return { name, customers: cumulative }; });
  }, [customers]);

  const returnRate = useMemo(() => {
    const total = orders.length;
    const returned = orders.filter(o => o.status === 'Return Requested' || o.status === 'Cancelled').length;
    return [{ name: 'Returned/Cancelled', value: returned }, { name: 'Completed', value: total - returned }];
  }, [orders]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Reports</h2>
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${tab === t ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}>{t}</button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        {tab === 'Sales' && (
          <>
            <h3 className="font-semibold mb-4">Daily Sales (Last 30 Days)</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" fontSize={10} angle={-45} textAnchor="end" height={60} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="hsl(346,77%,50%)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
        {tab === 'Orders' && (
          <>
            <h3 className="font-semibold mb-4">Orders by Status</h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie data={ordersByStatus} cx="50%" cy="50%" outerRadius={120} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} fontSize={11}>
                  {ordersByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </>
        )}
        {tab === 'Products' && (
          <>
            <h3 className="font-semibold mb-4">Top Products by Revenue</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={productPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" fontSize={12} />
                <YAxis type="category" dataKey="name" width={140} fontSize={10} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="hsl(142,71%,45%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
        {tab === 'Customers' && (
          <>
            <h3 className="font-semibold mb-4">Customer Growth</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={customerGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="customers" stroke="hsl(200,80%,50%)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}
        {tab === 'Returns' && (
          <>
            <h3 className="font-semibold mb-4">Return Rate</h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie data={returnRate} cx="50%" cy="50%" outerRadius={120} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} fontSize={11}>
                  <Cell fill="hsl(0,84%,60%)" />
                  <Cell fill="hsl(142,71%,45%)" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </>
        )}
        {tab === 'Revenue' && (
          <>
            <h3 className="font-semibold mb-4">Revenue Trend (Last 30 Days)</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" fontSize={10} angle={-45} textAnchor="end" height={60} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(346,77%,50%)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;
