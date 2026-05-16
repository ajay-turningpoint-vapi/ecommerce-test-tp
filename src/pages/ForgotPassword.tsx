import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email');
      return;
    }
    // Demo: simulate send
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-md">
        <div className="rounded-lg border border-border p-8">
          <Link to="/login" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to login
          </Link>

          {submitted ? (
            <div className="text-center">
              <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-3" />
              <h1 className="text-xl font-bold">Check your email</h1>
              <p className="text-sm text-muted-foreground mt-2">
                We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>.
                The link will expire in 30 minutes.
              </p>
              <Link
                to="/login"
                className="mt-6 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto mb-3">
                <Mail className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-bold text-center">Forgot password?</h1>
              <p className="text-sm text-muted-foreground text-center mt-1">
                Enter your email and we'll send you a reset link.
              </p>

              {error && <p className="text-sm text-destructive mt-3 text-center">{error}</p>}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full mt-1 rounded-lg border border-border px-3 py-2 text-sm bg-background"
                    placeholder="you@email.com"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground"
                >
                  Send Reset Link
                </button>
              </form>

              <p className="text-sm text-center mt-4 text-muted-foreground">
                Remembered it?{' '}
                <Link to="/login" className="text-primary font-medium">Login</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
