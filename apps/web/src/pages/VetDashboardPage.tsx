import { Link } from 'react-router-dom';
import { trpc } from '../lib/trpc.js';

const timeAgo = (date: Date) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export default function VetDashboardPage() {
  const { data: dashboard } = trpc.vet.dashboard.useQuery();
  const { data: available, refetch: refetchAvailable } = trpc.vet.availableQuestions.useQuery();
  const { data: myQuestions } = trpc.vet.myQuestions.useQuery();
  const accept = trpc.vet.acceptQuestion.useMutation({
    onSuccess: () => refetchAvailable(),
  });

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', paddingTop: 32 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>Vet Dashboard</h1>

      <div className="grid-3 mb-lg">
        <div className="card" style={{ textAlign: 'center', padding: 24 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📝</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{dashboard?.questionsAnswered ?? '-'}</div>
          <div className="text-muted" style={{ fontSize: 13 }}>Questions answered</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 24 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⭐</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{dashboard?.averageRating ?? '-'}</div>
          <div className="text-muted" style={{ fontSize: 13 }}>Average rating</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 24 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>💰</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{dashboard?.earnings != null ? `$${dashboard.earnings}` : '-'}</div>
          <div className="text-muted" style={{ fontSize: 13 }}>Earnings</div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Available Questions</h2>
          {!available ? (
            <p className="text-muted">Loading...</p>
          ) : available.length === 0 ? (
            <p className="text-muted">No questions available right now.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {available.map((q) => (
                <div key={q.id} className="card" style={{ padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{q.petName}</div>
                      <div className="text-muted" style={{ fontSize: 13 }}>
                        {q.petSpecies} &middot; {timeAgo(q.createdAt)}
                      </div>
                    </div>
                    <button
                      className="btn btn-primary btn-small"
                      disabled={accept.isPending}
                      onClick={() => accept.mutate({ questionId: q.id })}
                    >
                      {accept.isPending ? '...' : 'Accept'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>My Questions</h2>
          {!myQuestions ? (
            <p className="text-muted">Loading...</p>
          ) : myQuestions.length === 0 ? (
            <p className="text-muted">You haven't accepted any questions yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {myQuestions.map((q) => (
                <Link
                  key={q.id}
                  to={`/vet/questions/${q.id}`}
                  className="card card-interactive"
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, textDecoration: 'none' }}
                >
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{q.petName}</div>
                    <span className={`badge badge-${q.status}`}>{q.status}</span>
                  </div>
                  <span className="text-muted">&rarr;</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
