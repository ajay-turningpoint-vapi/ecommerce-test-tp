import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (isSignup) {
      if (!name || !email || !password) { setError('Please fill all fields'); return; }
      signup(name, email, phone, password);
      navigate(redirect);
    } else {
      if (!email || !password) { setError('Please fill all fields'); return; }
      const success = login(email, password);
      if (success) navigate(redirect);
      else setError('Account not found. Please sign up first.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-md">
        <div className="rounded-lg border border-border p-8">
          <h1 className="text-2xl font-bold text-center">{isSignup ? 'Create Account' : 'Login'}</h1>
          <p className="text-sm text-muted-foreground text-center mt-1">
            {isSignup ? 'Join Super Beauty today' : 'Welcome back to Super Beauty'}
          </p>

          {error && <p className="text-sm text-destructive mt-3 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {isSignup && (
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  className="w-full mt-1 rounded-lg border border-border px-3 py-2 text-sm" placeholder="Your name" />
              </div>
            )}
            <div>
              <label className="text-sm font-medium">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full mt-1 rounded-lg border border-border px-3 py-2 text-sm" placeholder="you@email.com" />
            </div>
            {isSignup && (
              <div>
                <label className="text-sm font-medium">Phone</label>
                <input value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full mt-1 rounded-lg border border-border px-3 py-2 text-sm" placeholder="+91 9876543210" />
              </div>
            )}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Password</label>
                {!isSignup && (
                  <Link to="/forgot-password" className="text-xs text-primary font-medium hover:underline">
                    Forgot password?
                  </Link>
                )}
              </div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full mt-1 rounded-lg border border-border px-3 py-2 text-sm" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground">
              {isSignup ? 'Sign Up' : 'Login'}
            </button>
          </form>

          <p className="text-sm text-center mt-4 text-muted-foreground">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={() => setIsSignup(!isSignup)} className="text-primary font-medium">
              {isSignup ? 'Login' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
