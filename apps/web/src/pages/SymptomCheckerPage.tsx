import { useState } from 'react';
import { generateSymptomCheckResult, SPECIES } from '@petcare/shared';

export default function SymptomCheckerPage() {
  const [species, setSpecies] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [description, setDescription] = useState('');
  const [result, setResult] = useState<ReturnType<typeof generateSymptomCheckResult> | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const symptomList = symptoms.split(',').map((s) => s.trim()).filter(Boolean);
    const res = generateSymptomCheckResult(species, symptomList, description);
    setResult(res);
  };

  const urgencyBadgeClass = (u: string) => {
    switch (u) {
      case 'critical': return 'badge-critical';
      case 'urgent': return 'badge-urgent';
      case 'moderate': return 'badge-moderate';
      default: return 'badge-low';
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', paddingTop: 32 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Symptom Checker</h1>
      <p className="text-muted mb-md">Describe your pet's symptoms for an instant urgency assessment.</p>

      <form onSubmit={handleSubmit} className="card" style={{ padding: 24 }}>
        <div className="form-group mb-md">
          <label className="form-label" htmlFor="species">Species</label>
          <select
            id="species"
            className="form-input"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            required
          >
            <option value="">-- Select species --</option>
            {SPECIES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="form-group mb-md">
          <label className="form-label" htmlFor="symptoms">Symptoms (comma-separated)</label>
          <textarea
            id="symptoms"
            className="form-textarea"
            rows={3}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="e.g. vomiting, diarrhea, lethargy"
          />
        </div>

        <div className="form-group mb-md">
          <label className="form-label" htmlFor="description">Description</label>
          <textarea
            id="description"
            className="form-textarea"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what's happening with your pet..."
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          Check Symptoms
        </button>
      </form>

      {result && (
        <div className="card mt-lg" style={{ padding: 24 }}>
          <div className="flex items-center justify-between mb-md">
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>Assessment Result</h2>
            <span className={`badge ${urgencyBadgeClass(result.urgency)}`}>
              {result.urgency}
            </span>
          </div>

          <div className="card" style={{ padding: 16, marginBottom: 16, background: 'var(--color-surface-alt)' }}>
            <strong>Immediate Action:</strong>
            <p className="mt-sm">{result.immediateAction}</p>
          </div>

          <p className="mb-md"><strong>Guidance:</strong> {result.guidance}</p>

          {result.redFlags.length > 0 && (
            <div>
              <strong>Red Flags:</strong>
              <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                {result.redFlags.map((flag, i) => (
                  <li key={i} className="text-muted" style={{ marginBottom: 4 }}>{flag}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
