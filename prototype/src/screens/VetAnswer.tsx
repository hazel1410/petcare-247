import { useState } from 'react';
import { useApp } from '../app';
import type { Urgency } from '../app';
import { BackHeader, Avatar } from '../ui';
import { VET_QUEUE, URGENCY_META, speciesEmoji } from '../mock';

const URGENCY_OPTIONS: { key: Urgency; label: string }[] = [
  { key: 'emergency', label: '🚨 Emergency now' },
  { key: 'soon', label: '⏱️ See a vet in 24h' },
  { key: 'monitor', label: '✅ Safe to monitor' },
];

export function VetAnswerScreen() {
  const a = useApp();
  const q = VET_QUEUE.find((x) => x.id === a.params?.queueId) ?? VET_QUEUE[0];

  const [urgency, setUrgency] = useState<Urgency | null>(q.urgencyHint ?? null);
  const [guidance, setGuidance] = useState('');
  const [vetQuestions, setVetQuestions] = useState('');
  const [sent, setSent] = useState(false);

  const canSend = urgency !== null && guidance.trim().length > 0;

  if (sent) {
    return (
      <div className="screen fade">
        <BackHeader title="Answer" />
        <div className="pad stack">
          <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
            <div style={{ fontSize: 48, lineHeight: 1, marginBottom: 16 }}>✅</div>
            <p className="h2" style={{ marginBottom: 6 }}>
              Sent to {q.ownerName}
            </p>
            <p className="body muted" style={{ marginBottom: 4 }}>
              {speciesEmoji(q.species)} {q.petName} · {q.species}
            </p>
            <div
              className="row"
              style={{
                justifyContent: 'center',
                marginTop: 20,
                gap: 8,
                padding: '12px 16px',
                background: 'var(--primary-soft)',
                borderRadius: 'var(--r-md)',
              }}
            >
              <span className="body strong" style={{ color: 'var(--primary)' }}>
                You earned
              </span>
              <span className="h2" style={{ color: 'var(--primary)' }}>
                {'$' + q.feeUsd.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            className="btn btn-ghost"
            style={{ marginTop: 8 }}
            onClick={() => a.go('vetHome')}
          >
            Back to queue
          </button>

          <div style={{ height: 40 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="screen fade">
      <BackHeader title="Answer" />
      <div className="pad stack">

        {/* Question card */}
        <div className="card">
          <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 36, lineHeight: 1, flexShrink: 0 }}>
              {speciesEmoji(q.species)}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="strong body">
                {q.petName} · {q.species}
              </p>
              <p className="small muted">
                {q.ownerName} &nbsp;·&nbsp; {q.region}
              </p>
            </div>
            <span
              className={`urgency ${URGENCY_META[q.urgencyHint].cls}`}
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--r-pill)',
                fontSize: 12,
                fontWeight: 600,
                flexShrink: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              {URGENCY_META[q.urgencyHint].emoji} {URGENCY_META[q.urgencyHint].label}
            </span>
          </div>
          <p className="body" style={{ marginTop: 14, lineHeight: 1.55 }}>
            {q.summary}
          </p>
          <p className="tiny muted" style={{ marginTop: 10 }}>
            Waited {q.waitedMin}m · Fee ${q.feeUsd.toFixed(2)}
          </p>
        </div>

        {/* Disclaimer */}
        <p className="disclaimer">
          Triage &amp; guidance only. Do not diagnose or prescribe — those require an in-person vet (VCPR).
        </p>

        {/* 1) Urgency verdict */}
        <div className="stack-sm">
          <label className="field-label">1 · Urgency verdict</label>
          <div className="chips" style={{ flexDirection: 'column', gap: 8 }}>
            {URGENCY_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                className={`chip${urgency === opt.key ? ' on' : ''}`}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  justifyContent: 'flex-start',
                  padding: '10px 14px',
                  borderRadius: 'var(--r-md)',
                  fontSize: 14,
                }}
                onClick={() => setUrgency(opt.key)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2) General guidance */}
        <div className="stack-sm">
          <label className="field-label">2 · General guidance</label>
          <textarea
            className="textarea"
            rows={4}
            placeholder="What should the owner do right now? (no diagnosis, no medication names)"
            value={guidance}
            onChange={(e) => setGuidance(e.target.value)}
          />
        </div>

        {/* 3) Questions to ask in-person vet */}
        <div className="stack-sm">
          <label className="field-label">3 · Questions to ask your own vet</label>
          <textarea
            className="textarea"
            rows={3}
            placeholder="What should they ask their in-person vet?"
            value={vetQuestions}
            onChange={(e) => setVetQuestions(e.target.value)}
          />
        </div>

        {/* Reviewer info */}
        <div
          className="card-flat row"
          style={{ alignItems: 'center', gap: 10, padding: '10px 14px' }}
        >
          <Avatar initials="AK" size={36} />
          <div style={{ flex: 1 }}>
            <p className="small strong">Dr. Aisha Khan</p>
            <p className="tiny muted">Responding as licensed vet · DVM</p>
          </div>
        </div>

        {/* Send button */}
        <button
          className="btn btn-primary"
          disabled={!canSend}
          onClick={() => setSent(true)}
        >
          Send answer
        </button>

        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}
