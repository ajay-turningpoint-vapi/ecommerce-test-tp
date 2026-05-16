import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { adminLogin, isAdminLoggedIn } = useAdminAuth();
  const navigate = useNavigate();

  if (isAdminLoggedIn) { navigate('/admin', { replace: true }); return null; }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (adminLogin(email, password)) navigate('/admin');
    else setError('Invalid credentials');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-center text-primary">Super Beauty</h1>
        <p className="text-sm text-muted-foreground text-center mt-1">Admin Panel</p>
        {error && <p className="text-sm text-destructive text-center mt-3">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="admin@superbeauty.com" />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
