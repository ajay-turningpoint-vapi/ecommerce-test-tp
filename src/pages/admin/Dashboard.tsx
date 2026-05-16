import { useMemo } from 'react';
import { ShoppingCart, IndianRupee, Users, Clock, Truck, RotateCcw, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { generateMockOrders, generateMockStock, generateMockCustomers } from '@/data/adminMockData';
import { categories } from '@/data/products';

const COLORS = ['hsl(346,77%,50%)', 'hsl(142,71%,45%)', 'hsl(200,80%,50%)', 'hsl(40,90%,50%)', 'hsl(280,60%,50%)', 'hsl(20,80%,50%)'];

const Dashboard = () => {
  const orders = useMemo(() => generateMockOrders(50), []);
  const stock = useMemo(() => generateMockStock(), []);
  const customers = useMemo(() => generateMockCustomers(20), []);

  const today = new Date().toDateString();
  const todayOrders = orders.filter(o => new Date(o.date).toDateString() === today);
  const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const shippedToday = todayOrders.filter(o => o.status === 'Shipped').length;
  const returnRequests = orders.filter(o => o.status === 'Return Requested').length;
  const lowStock = stock.filter(s => s.currentStock <= s.lowStockThreshold).length;

  const stats = [
    { label: 'Orders Today', value: todayOrders.length, icon: ShoppingCart, color: 'text-primary' },
    { label: 'Revenue Today', value: `₹${todayRevenue.toLocaleString()}`, icon: IndianRupee, color: 'text-green-600' },
    { label: 'Total Customers', value: customers.length, icon: Users, color: 'text-blue-500' },
    { label: 'Pending Orders', value: pendingOrders, icon: Clock, color: 'text-yellow-500' },
    { label: 'Shipped Today', value: shippedToday, icon: Truck, color: 'text-purple-500' },
    { label: 'Return Requests', value: returnRequests, icon: RotateCcw, color: 'text-orange-500' },
    { label: 'Low Stock Alerts', value: lowStock, icon: AlertTriangle, color: 'text-destructive' },
  ];

  // Daily sales (last 7 days)
  const dailySales = useMemo(() => {
    const days: { name: string; sales: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const ds = d.toDateString();
      const daySales = orders.filter(o => new Date(o.date).toDateString() === ds).reduce((s, o) => s + o.total, 0);
      days.push({ name: d.toLocaleDateString('en-IN', { weekday: 'short' }), sales: daySales });
    }
    return days;
  }, [orders]);

  // Top selling products
  const topProducts = useMemo(() => {
    const map: Record<string, { name: string; count: number }> = {};
    orders.forEach(o => o.items.forEach(item => {
      const k = item.product.id;
      if (!map[k]) map[k] = { name: item.product.name, count: 0 };
      map[k].count += item.quantity;
    }));
    return Object.values(map).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [orders]);

  // Orders by category
  const ordersByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach(o => o.items.forEach(item => {
      const cat = categories.find(c => c.id === item.product.categoryId)?.name || 'Other';
      map[cat] = (map[cat] || 0) + item.quantity;
    }));
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [orders]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {stats.map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={`h-4 w-4 ${s.color}`} />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily Sales */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-4">Daily Sales (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Sales']} />
              <Bar dataKey="sales" fill="hsl(346,77%,50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Category */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-4">Orders by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={ordersByCategory} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} fontSize={11}>
                {ordersByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Selling Products */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-4">Top Selling Products</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" fontSize={12} />
              <YAxis type="category" dataKey="name" width={120} fontSize={11} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(142,71%,45%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-4">Low Stock Alerts</h3>
          <div className="space-y-2 max-h-[250px] overflow-y-auto">
            {stock.filter(s => s.currentStock <= s.lowStockThreshold).slice(0, 10).map(s => (
              <div key={s.variantId} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                <div>
                  <p className="font-medium">{s.productName}</p>
                  <p className="text-xs text-muted-foreground">{s.variantName}</p>
                </div>
                <span className="text-destructive font-bold">{s.currentStock} left</span>
              </div>
            ))}
            {lowStock === 0 && <p className="text-sm text-muted-foreground">All stock levels are healthy!</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
