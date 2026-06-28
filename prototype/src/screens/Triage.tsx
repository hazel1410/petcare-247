import { useState, useEffect } from 'react';
import { useApp } from '../app';
import type { Urgency } from '../app';
import { BackHeader, Typing, PawPulse, Avatar } from '../ui';
import { SYMPTOM_CHIPS, PRESCREEN, URGENCY_META, onlineVets } from '../mock';
import type { PreScreenQuestion } from '../mock';

// ─── AskVetScreen ──────────────────────────────────────────────────────────────

export function AskVetScreen() {
  const a = useApp();

  const [step, setStep] = useState(0);
  const [petId, setPetId] = useState<string>(
    a.consult?.petId ?? a.pets[0]?.id ?? ''
  );
  const [desc, setDesc] = useState(a.consult?.description ?? '');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(
    a.consult?.symptoms ?? []
  );
  const [prescreenIndex, setPrescreenIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showTyping, setShowTyping] = useState(true);

  const selectedPet = a.pets.find(p => p.id === petId) ?? a.pets[0];
  const petName = selectedPet?.name ?? 'your pet';

  // Show a typing pause before each pre-screen question
  useEffect(() => {
    if (step !== 1) return;
    setShowTyping(true);
    const t = setTimeout(() => setShowTyping(false), 1300);
    return () => clearTimeout(t);
  }, [step, prescreenIndex]);

  const toggleSymptom = (s: string) =>
    setSelectedSymptoms(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );

  const handleContinueStep0 = () => {
    a.patchConsult({ petId, description: desc, symptoms: selectedSymptoms });
    setAnswers({});
    setPrescreenIndex(0);
    setStep(1);
  };

  const handleOptionSelect = (
    q: PreScreenQuestion,
    optLabel: string,
    redAlert?: boolean
  ) => {
    const newAnswers = { ...answers, [q.id]: optLabel };
    setAnswers(newAnswers);

    if (redAlert) {
      a.patchConsult({ urgency: 'emergency' as Urgency, urgencyScore: 5, answers: newAnswers });
      a.go('erFallback');
      return;
    }

    if (prescreenIndex < PRESCREEN.length - 1) {
      // Show typing before the next question
      setShowTyping(true);
      setPrescreenIndex(i => i + 1);
    } else {
      // All questions answered — compute urgency from answer text
      const isSoon = Object.values(newAnswers).some(ans => {
        const l = ans.toLowerCase();
        return l.includes('fast') || l.includes('few hours') || l.includes('quiet');
      });
      const urgency: Urgency = isSoon ? 'soon' : 'monitor';
      a.patchConsult({ urgency, urgencyScore: isSoon ? 3 : 2, answers: newAnswers });
      setStep(2);
    }
  };

  const currentQ = PRESCREEN[prescreenIndex];
  const urgency = (a.consult?.urgency ?? 'monitor') as Urgency;
  const meta = URGENCY_META[urgency];

  const guidanceMap: Record<string, string> = {
    monitor: `${petName} looks stable for now. A vet can confirm everything's okay and give you genuine peace of mind — you're absolutely right to check.`,
    soon: `${petName} needs to be seen within a few hours. Connect now so a vet can guide you through what to watch and what to do if things change.`,
    emergency: `Please act right now for ${petName}'s safety. Head to the nearest emergency clinic or speak to a vet immediately.`,
  };

  return (
    <div className="screen fade">
      <BackHeader title="Ask a Vet" />
      <div className="pad stack">

        {/* Persistent header — always visible */}
        <div className="row" style={{ gap: 8 }}>
          <span className="badge pill-amber">First question free</span>
        </div>
        <p className="disclaimer">
          Guidance &amp; urgency only — not a diagnosis or prescription.
        </p>

        {/* ── Step 0: Describe ─────────────────────────────────────────── */}
        {step === 0 && (
          <>
            {a.pets.length > 1 && (
              <div className="stack-sm">
                <label className="field-label">Which pet needs help?</label>
                <div className="chips wrap">
                  {a.pets.map(p => (
                    <button
                      key={p.id}
                      className={`chip${petId === p.id ? ' on' : ''}`}
                      onClick={() => setPetId(p.id)}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="field stack-sm">
              <label className="field-label">
                What's going on with {petName}?
              </label>
              <textarea
                className="textarea"
                rows={4}
                placeholder={`Describe what you've noticed — even small details help. We're here no matter the hour.`}
                value={desc}
                onChange={e => setDesc(e.target.value)}
              />
              <span className="field-hint">
                Include when it started, how often, and anything unusual you noticed.
              </span>
            </div>

            <div className="stack-sm">
              <label className="field-label">
                Any of these symptoms?{' '}
                <span className="faint">(tap all that apply)</span>
              </label>
              <div className="chips wrap">
                {SYMPTOM_CHIPS.map(s => (
                  <button
                    key={s}
                    className={`chip${selectedSymptoms.includes(s) ? ' on' : ''}`}
                    onClick={() => toggleSymptom(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="btn btn-primary"
              disabled={!desc.trim()}
              onClick={handleContinueStep0}
            >
              Continue
            </button>

            <div style={{ height: 96 }} />
          </>
        )}

        {/* ── Step 1: AI pre-screen questions ──────────────────────────── */}
        {step === 1 && (
          <>
            <div
              className="row row-between"
              style={{ alignItems: 'center' }}
            >
              <span className="small strong">AI Pre-Screen</span>
              <span className="pill pill-teal">
                {prescreenIndex + 1} / {PRESCREEN.length}
              </span>
            </div>

            <div className="card stack-sm">
              {showTyping ? (
                <div>
                  <p className="small muted" style={{ marginBottom: 10 }}>
                    Reviewing what you shared…
                  </p>
                  <Typing />
                </div>
              ) : (
                <>
                  <p className="h2" style={{ lineHeight: 1.4 }}>
                    {currentQ.q}
                  </p>
                  <div className="stack-sm" style={{ marginTop: 12 }}>
                    {currentQ.options.map(opt => (
                      <button
                        key={opt.label}
                        className="btn btn-ghost"
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          justifyContent: 'flex-start',
                        }}
                        onClick={() =>
                          handleOptionSelect(currentQ, opt.label, opt.redAlert)
                        }
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <p className="tiny muted center">
              Take a breath — you're doing the right thing by checking.
            </p>
          </>
        )}

        {/* ── Step 2: Urgency result ────────────────────────────────────── */}
        {step === 2 && (
          <>
            <div className={`urgency ${meta.cls}`}>
              <span style={{ fontSize: 36, lineHeight: 1 }}>{meta.emoji}</span>
              <div>
                <p className="h2">{meta.label}</p>
                <p className="body">{meta.verdict}</p>
              </div>
            </div>

            <div className="card stack-sm">
              <p className="small strong">What to do now</p>
              <p className="body muted">{guidanceMap[urgency]}</p>
              <p className="disclaimer" style={{ marginTop: 4 }}>
                AI-assisted screening only — a licensed vet provides the actual diagnosis.
              </p>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => a.go('matching')}
            >
              Connect me to a vet
            </button>
            <button
              className="btn btn-text"
              onClick={() => a.setTab('home')}
            >
              Back to home
            </button>

            <div style={{ height: 96 }} />
          </>
        )}

      </div>
    </div>
  );
}

// ─── MatchingScreen ────────────────────────────────────────────────────────────

export function MatchingScreen() {
  const a = useApp();
  const vets = onlineVets();

  useEffect(() => {
    const t = setTimeout(() => {
      const vet = vets[0];
      if (vet) {
        a.patchConsult({ vetId: vet.id });
        a.go('consult');
      } else {
        a.go('erFallback');
      }
    }, 2600);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="screen fade">
      <style>{`
        @keyframes pp-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.12); opacity: 0.78; }
        }
        .paw-pulse-anim { animation: pp-pulse 1.7s ease-in-out infinite; display: inline-block; }
      `}</style>

      <BackHeader title="Finding a Vet" />

      <div className="pad stack">
        {/* Hero pulse + copy */}
        <div className="center" style={{ textAlign: 'center', paddingTop: 28 }}>
          <div className="paw-pulse-anim">
            <PawPulse size={72} />
          </div>
          <h2 className="h2" style={{ marginTop: 20 }}>
            Finding an online vet…
          </h2>
          <p className="body muted" style={{ marginTop: 4 }}>
            {vets.length} vets available now
          </p>
          <p className="small" style={{ marginTop: 6, color: 'var(--text-muted)' }}>
            Usually matched in under a minute
          </p>
        </div>

        {/* Live vet list */}
        {vets.length > 0 && (
          <div className="stack-sm" style={{ marginTop: 12 }}>
            <p className="small muted">Online now</p>
            {vets.slice(0, 4).map((vet, i) => (
              <div
                key={vet.id}
                className="card-flat"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  opacity: Math.max(0.45, 1 - i * 0.18),
                }}
              >
                <Avatar initials={vet.initials} />
                <div style={{ flex: 1 }}>
                  <p className="body strong">{vet.name}</p>
                  <p className="small muted">
                    {vet.specialty} · {vet.flag} {vet.city}
                  </p>
                </div>
                <span className="pill pill-online">Online</span>
              </div>
            ))}
          </div>
        )}

        {/* Safety-net fallback demo */}
        <div className="center" style={{ textAlign: 'center', marginTop: 8 }}>
          <button
            className="btn btn-text"
            style={{ fontSize: 13, color: 'var(--text-muted)' }}
            onClick={() => a.go('erFallback')}
          >
            Simulate: no vet available right now
          </button>
        </div>

        <div style={{ height: 96 }} />
      </div>
    </div>
  );
}
