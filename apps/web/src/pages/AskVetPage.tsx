import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trpc } from '../lib/trpc.js';

const SYMPTOMS = [
  'vomiting', 'diarrhea', 'lethargy', 'loss of appetite',
  'coughing', 'sneezing', 'limping', 'skin rash',
  'ear infection', 'eye discharge', 'excessive thirst', 'weight loss',
];

export default function AskVetPage() {
  const navigate = useNavigate();
  const { data: pets } = trpc.pets.list.useQuery();
  const ask = trpc.questions.ask.useMutation({
    onSuccess: (data) => {
      if (data && 'question' in data && data.question) {
        navigate(`/questions/${data.question.id}`);
      }
    },
  });

  const [petId, setPetId] = useState('');
  const [question, setQuestion] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState('');

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    ask.mutate({
      petId,
      question,
      symptoms: selectedSymptoms.length ? selectedSymptoms : undefined,
      duration: duration || undefined,
    });
  };

  const needsPayment = ask.data && 'needsPayment' in ask.data && ask.data.needsPayment;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', paddingTop: 32 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>Ask a Vet</h1>

      {needsPayment ? (
        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💳</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Payment required</h2>
          <p className="text-muted" style={{ marginBottom: 24 }}>
            A one-time consultation fee is needed to submit your question.
          </p>
          <div className="card" style={{ padding: 24, background: 'var(--color-surface-alt, #f5f5f5)' }}>
            <p style={{ marginBottom: 8 }}>Stripe Payment Element would render here.</p>
            <button className="btn btn-primary btn-block" onClick={() => ask.reset()}>
              Dismiss
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card" style={{ padding: 24 }}>
          <div className="form-group mb-md">
            <label className="form-label" htmlFor="pet">Select Pet</label>
            <select
              id="pet"
              className="form-input"
              value={petId}
              onChange={(e) => setPetId(e.target.value)}
              required
            >
              <option value="">-- Choose a pet --</option>
              {pets?.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name} ({pet.species})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group mb-md">
            <label className="form-label" htmlFor="question">Describe the problem</label>
            <textarea
              id="question"
              className="form-textarea"
              rows={5}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What's happening with your pet? When did it start? How severe is it?"
              required
            />
          </div>

          <div className="form-group mb-md">
            <label className="form-label">Symptoms (select all that apply)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SYMPTOMS.map((symptom) => (
                <button
                  key={symptom}
                  type="button"
                  className={`btn btn-small ${selectedSymptoms.includes(symptom) ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => toggleSymptom(symptom)}
                  style={{ cursor: 'pointer' }}
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group mb-md">
            <label className="form-label" htmlFor="duration">How long has this been going on?</label>
            <input
              id="duration"
              className="form-input"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 2 days, about a week, since this morning"
            />
          </div>

          {ask.error && (
            <p className="text-muted" style={{ color: 'var(--color-error)', marginBottom: 12 }}>
              {ask.error.message}
            </p>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={ask.isPending}>
            {ask.isPending ? 'Submitting...' : 'Ask a Vet'}
          </button>
        </form>
      )}
    </div>
  );
}
