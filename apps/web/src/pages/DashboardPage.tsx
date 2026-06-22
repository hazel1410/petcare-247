import { Link } from 'react-router-dom';
import { trpc } from '../lib/trpc.js';
import { useAuthStore } from '../lib/store.js';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data: questions } = trpc.questions.list.useQuery();

  const name = user?.user_metadata?.name ?? user?.email ?? 'Pet Parent';

  const timeAgo = (date: Date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const urgencyColor = (u: string) => {
    switch (u) {
      case 'emergency': return 'var(--color-error)';
      case 'urgent': return 'var(--color-warning)';
      default: return 'var(--color-success)';
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', paddingTop: 32 }}>
      <div className="flex items-center justify-between mb-lg">
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
            Welcome back, {name}
          </h1>
          <p className="text-muted">Here's a summary of your pet care</p>
        </div>
      </div>

      <div className="grid-3 mb-lg">
        <Link to="/ask" className="card card-interactive" style={{ textAlign: 'center', padding: 24, textDecoration: 'none' }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🩺</div>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Ask a Vet</div>
          <div className="text-muted" style={{ fontSize: 13 }}>Get answers in minutes</div>
        </Link>
        <Link to="/symptom-checker" className="card card-interactive" style={{ textAlign: 'center', padding: 24, textDecoration: 'none' }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🔍</div>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Symptom Checker</div>
          <div className="text-muted" style={{ fontSize: 13 }}>Check symptoms now</div>
        </Link>
        <Link to="/emergency-finder" className="card card-interactive" style={{ textAlign: 'center', padding: 24, textDecoration: 'none' }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>📍</div>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Emergency Finder</div>
          <div className="text-muted" style={{ fontSize: 13 }}>Find vets near you</div>
        </Link>
      </div>

      <div className="card">
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Recent Questions</h2>
        {!questions ? (
          <p className="text-muted">Loading...</p>
        ) : questions.length === 0 ? (
          <p className="text-muted">No questions yet. Ask a vet to get started!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {questions.map((q) => (
              <Link
                key={q.id}
                to={`/questions/${q.id}`}
                className="card"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, textDecoration: 'none' }}
              >
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{q.petName}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span className={`badge badge-${q.status}`}>{q.status}</span>
                    <span className="text-muted" style={{ fontSize: 13 }}>{timeAgo(q.createdAt)}</span>
                  </div>
                </div>
                {q.urgency && (
                  <span
                    className="badge"
                    style={{
                      background: urgencyColor(q.urgency),
                      color: '#fff',
                      textTransform: 'capitalize',
                    }}
                  >
                    {q.urgency}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
