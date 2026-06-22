import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/store.js';
import { supabase } from '../lib/supabase.js';

export function Layout() {
  const { user, role, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    clearAuth();
    navigate('/');
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-inner">
          <Link to="/" className="logo">
            <span className="logo-icon">🐾</span>
            PetCare 24/7
          </Link>
          <nav>
            {user ? (
              <>
                {role === 'owner' && (
                  <>
                    <Link to="/dashboard" className="btn btn-ghost btn-small">Dashboard</Link>
                    <Link to="/ask" className="btn btn-primary btn-small">Ask a Vet</Link>
                  </>
                )}
                {role === 'vet' && (
                  <Link to="/vet" className="btn btn-ghost btn-small">Vet Dashboard</Link>
                )}
                {role === 'admin' && (
                  <Link to="/admin" className="btn btn-ghost btn-small">Admin</Link>
                )}
                <span className="text-muted">{user.email}</span>
                <button onClick={handleSignOut} className="btn btn-ghost btn-small">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/sign-in" className="btn btn-ghost btn-small">Sign In</Link>
                <Link to="/sign-up" className="btn btn-primary btn-small">Get Started</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
