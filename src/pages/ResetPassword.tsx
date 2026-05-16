import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setDone(true);
    toast.success('Password updated');
    setTimeout(() => navigate('/login'), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-md">
        <div className="rounded-lg border border-border p-8">
          {done ? (
            <div className="text-center">
              <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-3" />
              <h1 className="text-xl font-bold">Password reset!</h1>
              <p className="text-sm text-muted-foreground mt-2">Redirecting to login…</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto mb-3">
                <Lock className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-bold text-center">Set new password</h1>
              <p className="text-sm text-muted-foreground text-center mt-1">
                Choose a strong password you haven't used before.
              </p>

              {error && <p className="text-sm text-destructive mt-3 text-center">{error}</p>}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium">New password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full mt-1 rounded-lg border border-border px-3 py-2 text-sm bg-background"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Confirm password</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    className="w-full mt-1 rounded-lg border border-border px-3 py-2 text-sm bg-background"
                    placeholder="••••••••"
                  />
                </div>
                <button type="submit" className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground">
                  Update Password
                </button>
              </form>

              <p className="text-sm text-center mt-4 text-muted-foreground">
                <Link to="/login" className="text-primary font-medium">Back to login</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
