import { useApp } from '../app';
import { BackHeader } from '../ui';
import { VACCINES, VISITS, speciesEmoji } from '../mock';

const STATUS_STYLE: Record<
  'up-to-date' | 'due-soon' | 'overdue',
  { background: string; color: string; label: string }
> = {
  'up-to-date': { background: 'var(--leaf)',  color: '#fff', label: 'Up to date' },
  'due-soon':   { background: 'var(--amber)', color: '#fff', label: 'Due soon'   },
  'overdue':    { background: 'var(--coral)', color: '#fff', label: 'Overdue'    },
};

const DOCS = [
  { emoji: '📄', name: 'Adoption certificate.pdf',      size: '182 KB' },
  { emoji: '📋', name: 'Microchip registration.pdf',    size: '94 KB'  },
];

export function RecordsScreen() {
  const a = useApp();
  const pet = a.pets.find((p) => p.id === a.params?.petId) ?? a.pets[0];

  /* Guard: no pet in store yet */
  if (!pet) {
    return (
      <div className="screen fade">
        <BackHeader title="Health records" />
        <div className="pad stack">
          <div className="card center" style={{ padding: '36px 24px' }}>
            <span style={{ fontSize: 40 }}>🐾</span>
            <p className="body muted" style={{ marginTop: 12, textAlign: 'center' }}>
              Add a pet first to see their health records.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen fade">
      <BackHeader title="Health records" />

      <div className="pad stack">

        {/* ── Pet header ── */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 52, lineHeight: 1 }}>{speciesEmoji(pet.species)}</span>
          <div className="stack-sm grow">
            <span className="h2">{pet.name}</span>
            <span className="small muted">
              {[pet.breed, pet.age].filter(Boolean).join(' · ')}
            </span>
          </div>
        </div>

        {/* ── Share CTA ── */}
        <button
          className="btn btn-primary"
          onClick={() => a.go('askVet')}
        >
          Share records with a vet
        </button>

        <div className="divider" />

        {/* ── Vaccinations ── */}
        <span className="h3">Vaccinations</span>

        <div className="stack-sm">
          {VACCINES.map((v) => {
            const s = STATUS_STYLE[v.status];
            return (
              <div key={v.name} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="grow stack-sm">
                  <span className="strong">{v.name}</span>
                  <span className="small muted">
                    Last: {v.date} &nbsp;·&nbsp; due {v.due}
                  </span>
                </div>
                <span
                  className="badge"
                  style={{
                    background: s.background,
                    color: s.color,
                    flexShrink: 0,
                  }}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="divider" />

        {/* ── Visit history ── */}
        <span className="h3">Visit history</span>

        <div className="stack-sm">
          {VISITS.map((v, i) => (
            <div
              key={i}
              className="card"
              style={{
                borderLeft: '3px solid var(--primary)',
                borderRadius: '0 12px 12px 0',
              }}
            >
              <div className="row row-between" style={{ marginBottom: 4 }}>
                <span className="small strong" style={{ color: 'var(--primary)' }}>{v.date}</span>
                <span className="strong">{v.type}</span>
              </div>
              <span className="small muted">{v.vet}</span>
              <p className="body" style={{ marginTop: 6 }}>{v.note}</p>
            </div>
          ))}
        </div>

        <div className="divider" />

        {/* ── Documents ── */}
        <span className="h3">Documents</span>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {DOCS.map((doc, i) => (
            <div
              key={doc.name}
              className="lrow"
              style={{
                borderBottom: i < DOCS.length - 1 ? '1px solid var(--primary-soft)' : 'none',
              }}
            >
              <span style={{ fontSize: 22, marginRight: 12 }}>{doc.emoji}</span>
              <div className="grow stack-sm">
                <span className="strong">{doc.name}</span>
                <span className="tiny muted">{doc.size}</span>
              </div>
              <span className="small muted">↓</span>
            </div>
          ))}
        </div>

        <button className="btn btn-ghost" style={{ width: '100%' }}>
          ＋ Upload document
        </button>

        {/* ── Privacy disclaimer ── */}
        <p className="disclaimer">
          Records are private and encrypted. You choose when to share them.
        </p>

        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}
