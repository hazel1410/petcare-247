import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import { useAuthStore } from '../lib/store.js';

export function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const role = data.user.user_metadata?.role ?? null;
      setAuth(data.user, role, data.session?.access_token ?? null);
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', paddingTop: 64 }}>
      <div className="card">
        <div className="text-center mb-lg">
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
            Welcome back
          </h1>
          <p className="text-muted">Sign in to PetCare 24/7</p>
        </div>

        {error && (
          <div
            style={{
              background: 'var(--color-error-light)',
              color: 'var(--color-error)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: 16,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-md">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-md">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-md text-muted" style={{ fontSize: 14 }}>
          Don't have an account?{' '}
          <Link to="/sign-up" style={{ fontWeight: 700 }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
