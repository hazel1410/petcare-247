import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="text-center" style={{ paddingTop: 64 }}>
      <h1 style={{
        fontSize: 48, fontWeight: 800, color: 'var(--color-primary)',
        marginBottom: 16, lineHeight: 1.2,
      }}>
        Your pet's health,<br />24 hours a day
      </h1>
      <p style={{ fontSize: 18, color: 'var(--color-text-secondary)', maxWidth: 500, margin: '0 auto 32px' }}>
        Worried about your pet at 3am? Get an answer from a qualified vet — right now.
        First question is free.
      </p>
      <div className="flex items-center justify-center gap-md" style={{ marginBottom: 64 }}>
        <Link to="/sign-up" className="btn btn-primary btn-large">
          Ask a Vet Now — Free
        </Link>
        <Link to="/emergency-finder" className="btn btn-outline btn-large">
          Find Emergency Vet
        </Link>
      </div>

      <div className="grid-3" style={{ maxWidth: 900, margin: '0 auto' }}>
        {[
          { emoji: '🩺', title: '24/7 Vet Triage', desc: 'AI pre-screens while a real vet reviews. Answer in minutes, not hours.' },
          { emoji: '📋', title: 'Pet Health Hub', desc: 'Profiles, vaccine records, meds, reminders — all in one place.' },
          { emoji: '⭐', title: 'Trusted Vets', desc: 'Every vet is licensed and reviewed. See ratings and choose who you trust.' },
        ].map((item) => (
          <div key={item.title} className="card card-interactive" style={{ textAlign: 'center', padding: 32 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{item.emoji}</div>
            <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700 }}>{item.title}</h3>
            <p className="text-muted">{item.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 80, padding: '48px 24px', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-xl)' }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>How it works</h2>
        <div className="grid-3" style={{ maxWidth: 900, margin: '0 auto', textAlign: 'left' }}>
          {[
            { num: '1', title: 'Describe', desc: 'Tell us what\'s happening with your pet. Our AI asks structured follow-ups.' },
            { num: '2', title: 'Get matched', desc: 'We route you to an online, qualified vet in seconds.' },
            { num: '3', title: 'Get answers', desc: 'Receive urgency assessment and guidance. Know exactly what to do.' },
          ].map((item) => (
            <div key={item.num} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 'var(--radius-full)',
                background: 'var(--color-primary)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 18, flexShrink: 0,
              }}>{item.num}</div>
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: 4 }}>{item.title}</h4>
                <p className="text-muted" style={{ fontSize: 14 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
