import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Package, MapPin, LogOut } from 'lucide-react';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import type { Order } from '@/types';

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  if (!user) {
    navigate('/login');
    return null;
  }

  const orders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');

  const handleSave = () => {
    updateProfile({ name, phone });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="rounded-lg border border-border p-4">
            <div className="mb-4">
              <p className="font-bold">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <nav className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id ? 'text-primary bg-primary/5' : 'hover:bg-accent'
                  }`}
                >
                  <tab.icon className="h-4 w-4" /> {tab.label}
                </button>
              ))}
              <button onClick={handleLogout}
                className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/5">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            {activeTab === 'profile' && (
              <div className="rounded-lg border border-border p-6 max-w-lg">
                <h2 className="text-lg font-bold">My Profile</h2>
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <input value={name} onChange={e => setName(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-border px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <input value={email} disabled className="w-full mt-1 rounded-lg border border-border px-3 py-2 text-sm bg-muted" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-border px-3 py-2 text-sm" />
                  </div>
                  <button onClick={handleSave} className="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-primary-foreground">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-lg font-bold">My Orders</h2>
                {orders.length === 0 ? (
                  <p className="text-muted-foreground mt-4">No orders yet.</p>
                ) : (
                  <div className="space-y-4 mt-4">
                    {orders.map(order => (
                      <Link key={order.id} to={`/order/${order.id}`}
                        className="block rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-bold text-sm">Order #{order.orderNumber}</p>
                            <p className="text-xs text-muted-foreground">{order.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm">₹{order.total}</p>
                            <span className="text-xs rounded-full border border-border px-2 py-0.5">{order.status}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {order.items.map(i => i.product.name).join(', ')}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <h2 className="text-lg font-bold">My Addresses</h2>
                <p className="text-muted-foreground mt-4 text-sm">Manage your delivery addresses during checkout.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
