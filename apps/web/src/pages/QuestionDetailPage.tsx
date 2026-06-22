import { Link, useParams } from 'react-router-dom';
import { trpc } from '../lib/trpc.js';

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
    case 'moderate': return '#E65100';
    default: return 'var(--color-success)';
  }
};

const statusMessage: Record<string, string> = {
  waiting: 'Being reviewed',
  ai_screening: 'Being reviewed',
  with_vet: 'A vet is reviewing your question',
};

export default function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: question, isLoading } = trpc.questions.get.useQuery(id!);

  if (isLoading) {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', paddingTop: 32 }}>
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  if (!question) {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', paddingTop: 32 }}>
        <p className="text-muted">Question not found.</p>
        <Link to="/dashboard" className="btn btn-ghost mt-md">&larr; Back to Dashboard</Link>
      </div>
    );
  }

  const emoji = question.petSpecies === 'cat' ? '🐱' : '🐕';

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', paddingTop: 32 }}>
      <Link to="/dashboard" className="text-muted" style={{ display: 'inline-block', marginBottom: 16, textDecoration: 'none' }}>
        &larr; Back to Dashboard
      </Link>

      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 40 }}>{emoji}</div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>{question.petName}</h2>
            <span className="text-muted" style={{ fontSize: 13 }}>{question.petSpecies}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className={`badge badge-${question.status}`}>{question.status}</span>
            {question.urgency && (
              <span
                className="badge"
                style={{
                  background: urgencyColor(question.urgency),
                  color: '#fff',
                  textTransform: 'capitalize',
                }}
              >
                {question.urgency}
              </span>
            )}
          </div>
        </div>

        <div className="card" style={{ padding: 16, background: 'var(--color-surface-alt, #f9f9f9)', marginBottom: 16 }}>
          <p style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{question.question}</p>
        </div>

        {question.symptoms && question.symptoms.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div className="text-muted" style={{ fontSize: 13, marginBottom: 6 }}>Reported symptoms</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {question.symptoms.map((s: string) => (
                <span key={s} className="badge" style={{ background: 'var(--color-border)', textTransform: 'none' }}>{s}</span>
              ))}
            </div>
          </div>
        )}

        <div className="text-muted" style={{ fontSize: 13 }}>
          Asked {timeAgo(question.createdAt)}
          {question.duration && <> &middot; Duration: {question.duration}</>}
        </div>
      </div>

      {question.status === 'answered' && question.response ? (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Vet Response</div>

          <div className="form-group mb-md">
            <div className="form-label">Urgency Assessment</div>
            <div className="card" style={{ padding: 12, background: 'var(--color-surface-alt, #f9f9f9)' }}>
              {question.response.urgencyAssessment}
            </div>
          </div>

          <div className="form-group mb-md">
            <div className="form-label">Guidance</div>
            <div className="card" style={{ padding: 12, background: 'var(--color-surface-alt, #f9f9f9)' }}>
              {question.response.guidance}
            </div>
          </div>

          {question.response.recommendation && (
            <div className="form-group mb-md">
              <div className="form-label">Recommendation</div>
              <span
                className="badge"
                style={{
                  background: urgencyColor(question.response.recommendation),
                  color: '#fff',
                  textTransform: 'capitalize',
                }}
              >
                {question.response.recommendation.replace(/_/g, ' ')}
              </span>
            </div>
          )}

          <div
            className="card"
            style={{
              padding: 16,
              fontSize: 13,
              background: 'var(--color-warning-light, #FFF8E1)',
              borderLeft: '4px solid var(--color-warning)',
            }}
          >
            This is triage guidance only, not a diagnosis. Always consult your veterinarian for medical decisions.
          </div>
        </div>
      ) : question.status === 'with_vet' ? (
        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🩺</div>
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>A vet is reviewing your question</h3>
          <p className="text-muted">You'll get a notification when the response is ready.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⏳</div>
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{statusMessage[question.status] || 'Being reviewed'}</h3>
          <p className="text-muted">Please check back shortly.</p>
        </div>
      )}
    </div>
  );
}
