import { useState } from 'react';
import { useApp } from '../app';
import { VETS, ER_CLINICS, URGENCY_META } from '../mock';
import { BackHeader, Avatar, Stars, Icon } from '../ui';

/* ============================================================
   ConsultScreen — live chat view with the assigned vet
   ============================================================ */
export function ConsultScreen() {
  const a = useApp();
  const vet = VETS.find((v) => v.id === a.consult.vetId) || VETS[0];
  const urgency = a.consult.urgency || 'soon';
  const meta = URGENCY_META[urgency];
  const description = a.consult.description || "My pet isn't well";

  return (
    <div className="screen fade">
      <BackHeader title="Your Consultation" />

      <div className="pad stack">
        {/* Vet header card — tap to open full profile */}
        <div
          className="card card-tap"
          style={{ cursor: 'pointer' }}
          onClick={() => a.go('vetProfile', { vetId: vet.id })}
        >
          <div className="row">
            <Avatar initials={vet.initials} size={50} />
            <div className="grow stack-sm">
              <div className="row-between" style={{ alignItems: 'center' }}>
                <span className="h3">{vet.name}</span>
                <span className="pill pill-online">
                  <span className="dot" />
                  online
                </span>
              </div>
              <span className="small muted">
                {vet.city} {vet.flag} &nbsp;·&nbsp; ⭐ {vet.rating}
              </span>
            </div>
            <Icon name="chevron" size={18} color="var(--text-faint)" />
          </div>
        </div>

        {/* Chat column */}
        <div className="chatcol">
          {/* Pet parent's opening message */}
          <div className="bubble bubble-me">{description}</div>

          {/* Vet greeting */}
          <div className="bubble bubble-vet">
            Hi there — I'm {vet.name} and I've read your message carefully.
            Take a breath; you did the right thing reaching out. Let me share what I'd recommend right now.
          </div>

          {/* Structured vet answer */}
          <div className="card stack-sm" style={{ alignSelf: 'stretch' }}>
            {/* Urgency triage block */}
            <div className={`urgency ${meta.cls}`}>
              <span style={{ fontSize: 24, lineHeight: 1, flexShrink: 0 }}>{meta.emoji}</span>
              <div>
                <div className="strong small">{meta.label}</div>
                <div className="small muted">{meta.verdict}</div>
              </div>
            </div>

            {/* General guidance */}
            <div>
              <p className="small strong" style={{ margin: '0 0 8px' }}>General guidance</p>
              <ul style={{ margin: 0, paddingLeft: 18 }} className="stack-sm">
                <li className="body">
                  Keep your pet calm and still in a quiet, dimly lit space. Limit handling —
                  stress can worsen many symptoms.
                </li>
                <li className="body">
                  Make fresh water available but don't force food or drink. Note the time
                  symptoms started and any changes in behavior, breathing, or appetite.
                </li>
                <li className="body">
                  Avoid giving any human medications. If you need to take them to an ER, bring
                  the name of anything they may have eaten or touched.
                </li>
              </ul>
            </div>

            <div className="divider" />

            {/* Questions for their vet */}
            <div>
              <p className="small strong" style={{ margin: '0 0 8px' }}>Questions to ask your own vet</p>
              <ul style={{ margin: 0, paddingLeft: 18 }} className="stack-sm">
                <li className="body">
                  Should I bring them in today, or is home monitoring okay overnight given what you've heard?
                </li>
                <li className="body">
                  What specific warning signs should trigger an immediate ER visit?
                </li>
                <li className="body">
                  Could diet, a recent vaccination, or environmental change be contributing?
                </li>
              </ul>
            </div>
          </div>

          {/* Triage disclaimer */}
          <div className="disclaimer">
            🩺 This is triage guidance only — not a diagnosis or prescription. Always follow up with your regular vet, especially if symptoms worsen.
          </div>
        </div>

        <div style={{ height: 16 }} />

        <button className="btn btn-primary" onClick={() => a.go('rate')}>
          Mark resolved &amp; rate vet
        </button>

        <div style={{ height: 32 }} />
      </div>
    </div>
  );
}

/* ============================================================
   RateScreen — post-consult vet rating
   ============================================================ */
export function RateScreen() {
  const a = useApp();
  const vet = VETS.find((v) => v.id === a.consult.vetId) || VETS[0];
  const [stars, setStars] = useState(5);
  const [chips, setChips] = useState<string[]>([]);
  const [preferVet, setPreferVet] = useState(false);

  const FEEDBACK_CHIPS = ['Fast', 'Reassuring', 'Clear advice', 'Kind'];

  const toggleChip = (c: string) =>
    setChips((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );

  const starLabel =
    stars === 5 ? 'Excellent!' :
    stars === 4 ? 'Really good' :
    stars === 3 ? 'Okay' :
    stars === 2 ? 'Could improve' :
    'Not great';

  return (
    <div className="screen fade">
      <BackHeader title="Rate your session" />

      <div className="pad stack">
        {/* Vet hero + star rating */}
        <div className="card center stack-sm" style={{ paddingTop: 24, paddingBottom: 24 }}>
          <Avatar initials={vet.initials} size={68} />
          <h2 className="h2">How was {vet.name}?</h2>
          <p className="body muted" style={{ margin: 0 }}>
            Your honest feedback helps other pet parents find the right vet.
          </p>
          <div style={{ marginTop: 6 }}>
            <Stars value={stars} size={38} onChange={setStars} />
          </div>
          <span className="small muted">{starLabel}</span>
        </div>

        {/* Feedback chips */}
        <div>
          <p className="small strong" style={{ marginBottom: 10 }}>What stood out? (optional)</p>
          <div className="chips">
            {FEEDBACK_CHIPS.map((c) => (
              <button
                key={c}
                className={`chip${chips.includes(c) ? ' on' : ''}`}
                onClick={() => toggleChip(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Prefer-this-vet toggle */}
        <div className="card">
          <div className="row-between">
            <div>
              <span className="body strong">Request this vet next time</span>
              <p className="small muted" style={{ margin: '2px 0 0' }}>
                We'll try to match you with {vet.name.split(' ')[1]} first when you return.
              </p>
            </div>
            <button
              className={`switch${preferVet ? ' on' : ''}`}
              onClick={() => setPreferVet((v) => !v)}
              aria-label="Toggle vet preference"
            >
              <span />
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          className="btn btn-primary"
          onClick={() => {
            a.resetConsult();
            a.setTab('home');
          }}
        >
          Submit rating
        </button>

        <p className="tiny muted center">
          Saved to your pet's records. Thanks for taking a moment to share.
        </p>

        <div style={{ height: 32 }} />
      </div>
    </div>
  );
}

/* ============================================================
   ErFallbackScreen — emergency clinic finder
   ============================================================ */
export function ErFallbackScreen() {
  const a = useApp();

  return (
    <div className="screen fade">
      <BackHeader title="Emergency" />

      <div className="pad stack">
        {/* Emergency alert header */}
        <div
          className="card stack-sm"
          style={{
            background: 'var(--coral-soft)',
            border: '1.5px solid #f5b5b5',
          }}
        >
          <div className="row" style={{ gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 28, lineHeight: 1 }}>🚨</span>
            <h2 className="h2" style={{ margin: 0, color: 'var(--coral-dark)' }}>
              This may be an emergency
            </h2>
          </div>
          <p className="body" style={{ margin: 0 }}>
            Go to the nearest open ER now. We're also still trying to reach a vet — you're not alone in this.
          </p>
        </div>

        {/* Nearest ER clinics */}
        <div>
          <p className="small strong" style={{ marginBottom: 10 }}>Nearest emergency clinics</p>
          <div className="stack-sm">
            {ER_CLINICS.map((clinic) => (
              <div key={clinic.id} className="card stack-sm">
                <div className="row-between" style={{ alignItems: 'flex-start' }}>
                  <span className="h3" style={{ flex: 1, marginRight: 8 }}>{clinic.name}</span>
                  <span
                    className="badge"
                    style={{
                      background: clinic.open ? 'var(--leaf-soft)' : 'var(--surface-alt)',
                      color: clinic.open ? '#128a45' : 'var(--text-muted)',
                      flexShrink: 0,
                    }}
                  >
                    {clinic.open ? '● Open' : '● Closed'}
                  </span>
                </div>

                <div className="row" style={{ gap: 5 }}>
                  <Icon name="pin" size={13} color="var(--text-muted)" />
                  <span className="small muted">
                    {clinic.address} &nbsp;·&nbsp; {clinic.distanceMi} mi away
                  </span>
                </div>

                <div className="btn-row">
                  <button
                    className="btn btn-coral btn-sm"
                    onClick={() => {/* mock: would open dialer */}}
                  >
                    <Icon name="phone" size={15} color="#fff" />
                    Call
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {/* mock: would open maps */}}
                  >
                    <Icon name="pin" size={15} color="var(--text)" />
                    Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* First-aid tips while en route */}
        <div className="card stack-sm">
          <p className="small strong" style={{ margin: 0 }}>While you head there</p>
          <ul style={{ margin: 0, paddingLeft: 18 }} className="stack-sm">
            <li className="body">
              Keep your pet as still as possible — wrap them in a blanket if they're shivering or restless.
            </li>
            <li className="body">
              Don't offer food or water — the ER team may need to perform procedures quickly on arrival.
            </li>
            <li className="body">
              Call ahead so the team can prepare. Tell them the symptoms and how long they've been going on.
            </li>
          </ul>
        </div>

        {/* Fallback: still try to reach a vet */}
        <button
          className="btn btn-text"
          style={{ width: '100%', color: 'var(--primary)' }}
          onClick={() => a.go('matching')}
        >
          Still connect me to a vet
        </button>

        <div style={{ height: 32 }} />
      </div>
    </div>
  );
}

/* ============================================================
   VetProfileScreen — full vet bio + stats
   ============================================================ */
export function VetProfileScreen() {
  const a = useApp();
  const vet =
    VETS.find((v) => v.id === (a.params.vetId || a.consult.vetId)) || VETS[0];

  const vetLastName = vet.name.split(' ').slice(-1)[0];
  const MOCK_REVIEWS = [
    {
      initials: 'SR',
      name: 'Sarah R.',
      rating: 5,
      quote: `Dr. ${vetLastName} was so calm and thorough at 2am when Biscuit swallowed something. Incredibly reassuring — I could finally breathe again.`,
    },
    {
      initials: 'JM',
      name: 'Jamie M.',
      rating: 5,
      quote: `Fast, genuinely kind, and specific. I felt heard, my dog felt better by morning, and I actually understood what to watch for.`,
    },
  ];

  return (
    <div className="screen fade">
      <BackHeader title="Vet Profile" />

      <div className="pad stack">
        {/* Hero section */}
        <div className="center stack-sm" style={{ paddingTop: 8 }}>
          <Avatar initials={vet.initials} size={80} />
          <h1 className="h1">{vet.name}</h1>
          <p className="body muted" style={{ margin: 0 }}>{vet.specialty}</p>
          <p className="small muted" style={{ margin: 0 }}>
            {vet.city} {vet.flag} &nbsp;·&nbsp; {vet.country}
          </p>
          {vet.online && (
            <span className="pill pill-online">
              <span className="dot" />
              Available now
            </span>
          )}
        </div>

        {/* Stat tiles — 2×2 grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
          }}
        >
          <div
            className="card-flat card center stack-sm"
            style={{ padding: 14 }}
          >
            <Stars value={vet.rating} size={15} />
            <span className="h3">{vet.rating}</span>
            <span className="tiny muted">{vet.reviews.toLocaleString()} reviews</span>
          </div>
          <div
            className="card-flat card center stack-sm"
            style={{ padding: 14 }}
          >
            <span style={{ fontSize: 22 }}>🐾</span>
            <span className="h3">{vet.helped.toLocaleString()}</span>
            <span className="tiny muted">pets helped</span>
          </div>
          <div
            className="card-flat card center stack-sm"
            style={{ padding: 14 }}
          >
            <span style={{ fontSize: 22 }}>🏥</span>
            <span className="h3">{vet.years} yrs</span>
            <span className="tiny muted">experience</span>
          </div>
          <div
            className="card-flat card center stack-sm"
            style={{ padding: 14 }}
          >
            <span style={{ fontSize: 22 }}>⚡</span>
            <span className="h3">{vet.avgReplyMin} min</span>
            <span className="tiny muted">avg reply</span>
          </div>
        </div>

        {/* Languages */}
        <div>
          <p className="small strong" style={{ marginBottom: 10 }}>Languages</p>
          <div className="chips">
            {vet.langs.map((lang) => (
              <span key={lang} className="chip on">
                {lang}
              </span>
            ))}
          </div>
        </div>

        {/* Written reviews */}
        <div>
          <p className="small strong" style={{ marginBottom: 10 }}>Recent reviews</p>
          <div className="stack-sm">
            {MOCK_REVIEWS.map((r, i) => (
              <div key={i} className="card stack-sm">
                <div className="row">
                  <Avatar initials={r.initials} size={36} />
                  <div className="grow">
                    <div className="row-between" style={{ alignItems: 'center' }}>
                      <span className="small strong">{r.name}</span>
                      <Stars value={r.rating} size={13} />
                    </div>
                  </div>
                </div>
                <p className="body muted" style={{ margin: 0 }}>"{r.quote}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Request CTA */}
        <button className="btn btn-primary" onClick={() => a.back()}>
          Request this vet
        </button>

        <div style={{ height: 32 }} />
      </div>
    </div>
  );
}
