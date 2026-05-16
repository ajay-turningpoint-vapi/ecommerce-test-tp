import { useMemo } from 'react';
import { ShoppingCart, IndianRupee, Users, Clock, RotateCcw, AlertTriangle, Package, Layers } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { products, categories, getOrders, getStock, getCustomers } from '@/data/adminSharedData';

const LOW_STOCK_THRESHOLD = 10;

const Dashboard = () => {
  const orders = useMemo(() => getOrders(), []);
  const stock = useMemo(() => getStock(), []);
  const customers = useMemo(() => getCustomers(), []);

  const today = new Date().toDateString();
  const todayOrders = orders.filter(o => new Date(o.date).toDateString() === today);
  const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const returnRequests = orders.filter(o => o.status === 'Return Requested').length;
  const lowStock = stock.filter(s => s.currentStock <= LOW_STOCK_THRESHOLD).length;

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'text-primary' },
    { label: 'Revenue Today', value: `₹${todayRevenue.toLocaleString()}`, icon: IndianRupee, color: 'text-green-600' },
    { label: 'Total Customers', value: customers.length, icon: Users, color: 'text-blue-500' },
    { label: 'Products', value: products.length, icon: Package, color: 'text-purple-500' },
    { label: 'Categories', value: categories.length, icon: Layers, color: 'text-indigo-500' },
    { label: 'Pending Orders', value: pendingOrders, icon: Clock, color: 'text-yellow-500' },
    { label: 'Return Requests', value: returnRequests, icon: RotateCcw, color: 'text-orange-500' },
    { label: 'Low Stock Alerts', value: lowStock, icon: AlertTriangle, color: 'text-destructive' },
  ];

  const dailySales = useMemo(() => {
    const days: { name: string; sales: number; orders: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const ds = d.toDateString();
      const dayOrders = orders.filter(o => new Date(o.date).toDateString() === ds);
      days.push({
        name: d.toLocaleDateString('en-IN', { weekday: 'short' }),
        sales: dayOrders.reduce((s, o) => s + o.total, 0),
        orders: dayOrders.length,
      });
    }
    return days;
  }, [orders]);

  const topProducts = useMemo(() => {
    const map: Record<string, { name: string; count: number }> = {};
    orders.forEach(o => o.items.forEach(item => {
      const name = item.product.name;
      if (!map[name]) map[name] = { name, count: 0 };
      map[name].count += item.quantity;
    }));
    return Object.values(map).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [orders]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={`h-4 w-4 ${s.color}`} />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-4">Daily Sales (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Sales']} />
              <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-4">Top Selling Products</h3>
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" fontSize={12} />
                <YAxis type="category" dataKey="name" width={140} fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(142,71%,45%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">No order data yet</p>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-4">Low Stock Alerts</h3>
          <div className="space-y-2 max-h-[250px] overflow-y-auto">
            {stock.filter(s => s.currentStock <= LOW_STOCK_THRESHOLD).slice(0, 10).map(s => (
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

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-2 max-h-[250px] overflow-y-auto">
            {orders.slice(0, 8).map(o => (
              <div key={o.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                <div>
                  <p className="font-medium">{o.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">{o.address.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{o.total}</p>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted font-medium">{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
