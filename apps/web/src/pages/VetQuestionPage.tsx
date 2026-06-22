import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { trpc } from '../lib/trpc.js';

const RECOMMENDATIONS = [
  { value: 'emergency_now', label: 'Emergency – go now' },
  { value: 'vet_today', label: 'See a vet today' },
  { value: 'vet_soon', label: 'See a vet soon' },
  { value: 'monitor', label: 'Monitor at home' },
  { value: 'resolved', label: 'Resolved / no action needed' },
];

export default function VetQuestionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: question, isLoading } = trpc.questions.get.useQuery(id!);
  const respond = trpc.vet.respond.useMutation({
    onSuccess: () => navigate('/vet'),
  });

  const [urgencyAssessment, setUrgencyAssessment] = useState('');
  const [guidance, setGuidance] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [disclaimer, setDisclaimer] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    respond.mutate({
      questionId: id!,
      urgencyAssessment,
      guidance,
      recommendation: recommendation || undefined,
      followUp: followUp || undefined,
    });
  };

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
      </div>
    );
  }

  const emoji = question.petSpecies === 'cat' ? '🐱' : '🐕';

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', paddingTop: 32 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>Respond to Question</h1>

      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 40 }}>{emoji}</div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>{question.petName}</h2>
            <span className="text-muted" style={{ fontSize: 13 }}>{question.petSpecies}</span>
          </div>
        </div>

        <div className="card" style={{ padding: 16, background: 'var(--color-surface-alt, #f9f9f9)' }}>
          <div className="text-muted" style={{ fontSize: 13, marginBottom: 8 }}>Owner's question</div>
          <p style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{question.question}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ padding: 24 }}>
        <div className="form-group mb-md">
          <label className="form-label" htmlFor="urgencyAssessment">Urgency Assessment</label>
          <textarea
            id="urgencyAssessment"
            className="form-textarea"
            rows={3}
            value={urgencyAssessment}
            onChange={(e) => setUrgencyAssessment(e.target.value)}
            placeholder="Assess the urgency of this situation..."
            required
          />
        </div>

        <div className="form-group mb-md">
          <label className="form-label" htmlFor="guidance">Guidance</label>
          <textarea
            id="guidance"
            className="form-textarea"
            rows={5}
            value={guidance}
            onChange={(e) => setGuidance(e.target.value)}
            placeholder="Provide detailed guidance to the pet owner..."
            required
          />
        </div>

        <div className="form-group mb-md">
          <label className="form-label" htmlFor="recommendation">Recommendation</label>
          <select
            id="recommendation"
            className="form-input"
            value={recommendation}
            onChange={(e) => setRecommendation(e.target.value)}
          >
            <option value="">-- Select recommendation --</option>
            {RECOMMENDATIONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group mb-md">
          <label className="form-label" htmlFor="followUp">Follow-up questions for the owner</label>
          <textarea
            id="followUp"
            className="form-textarea"
            rows={3}
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
            placeholder="Any additional info you need from the owner..."
          />
        </div>

        <div className="form-group mb-md">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={disclaimer}
              onChange={(e) => setDisclaimer(e.target.checked)}
              style={{ width: 18, height: 18 }}
            />
            <span>I confirm this is triage guidance, not a diagnosis or prescription</span>
          </label>
        </div>

        {respond.error && (
          <p className="text-muted" style={{ color: 'var(--color-error)', marginBottom: 12 }}>
            {respond.error.message}
          </p>
        )}

        <button type="submit" className="btn btn-primary btn-block" disabled={respond.isPending || !disclaimer}>
          {respond.isPending ? 'Submitting...' : 'Submit Response'}
        </button>
      </form>
    </div>
  );
}
