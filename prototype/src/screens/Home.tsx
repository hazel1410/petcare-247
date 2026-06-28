import { useApp } from '../app';
import { Avatar, Icon } from '../ui';
import { speciesEmoji } from '../mock';

export function HomeScreen() {
  const a = useApp();
  const firstName = a.owner?.name?.split(' ')[0] || 'there';

  const quickActions: {
    icon: string;
    emoji?: string;
    label: string;
    action: () => void;
  }[] = [
    { icon: 'paw', label: 'Symptom checker', action: () => a.go('askVet') },
    { icon: 'pin', label: 'Find ER vet', action: () => a.go('erFallback') },
    { emoji: '📋', icon: 'shield', label: 'Health records', action: () => a.go('records') },
    { emoji: '⏰', icon: 'bell', label: 'Reminders', action: () => a.go('reminders') },
  ];

  return (
    <div className="screen fade">
      <div className="pad stack">

        {/* Greeting row */}
        <div className="row-between" style={{ alignItems: 'center' }}>
          <div>
            <h1 className="h1" style={{ margin: 0 }}>Hi {firstName} 👋</h1>
            <p className="small muted" style={{ margin: '2px 0 0' }}>
              How can we help today?
            </p>
          </div>
          <Avatar
            initials={
              a.owner?.name
                ? a.owner.name
                    .split(' ')
                    .map((w: string) => w[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                : '?'
            }
            size={44}
          />
        </div>

        {/* Vets online pill */}
        <div>
          <span className="pill pill-online">
            <span className="dot" />
            {a.vetsOnline} vets online now
          </span>
        </div>

        {/* Reassurance card */}
        <div
          className="card stack-sm"
          style={{ background: 'var(--primary-soft)', border: '1px solid var(--primary)' }}
        >
          <div className="row" style={{ gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 28 }}>🐾</span>
            <h2 className="h2" style={{ margin: 0 }}>Worried about your pet?</h2>
          </div>
          <p className="body" style={{ margin: 0 }}>
            Tell us what's happening and we'll connect you to a vet in minutes.
            Available 24 / 7, no appointment needed.
          </p>
          <button
            className="btn btn-amber"
            style={{ width: '100%' }}
            onClick={() => a.go('askVet')}
          >
            Ask a Vet Now
          </button>
          <p className="tiny muted disclaimer" style={{ margin: 0 }}>
            For life-threatening emergencies always call your nearest ER clinic first.
          </p>
        </div>

        {/* Quick-action 2×2 grid */}
        <div>
          <p className="small strong" style={{ marginBottom: 10 }}>Quick actions</p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
            }}
          >
            {quickActions.map((qa) => (
              <button
                key={qa.label}
                className="card card-tap"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 8,
                  cursor: 'pointer',
                  border: 'none',
                  textAlign: 'left',
                  padding: '14px 14px',
                }}
                onClick={qa.action}
              >
                <span style={{ fontSize: 22 }}>
                  {qa.emoji ?? <Icon name={qa.icon as any} size={22} color="var(--primary)" />}
                </span>
                <span className="small strong">{qa.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="divider" />

        {/* Your pets section */}
        <div>
          <div className="row-between" style={{ alignItems: 'center', marginBottom: 12 }}>
            <p className="small strong" style={{ margin: 0 }}>Your pets</p>
            <button
              className="btn-text small"
              style={{ color: 'var(--primary)', fontWeight: 600 }}
              onClick={() => a.setTab('pets')}
            >
              See all
            </button>
          </div>

          {a.pets.length === 0 ? (
            /* Empty state */
            <button
              className="card card-tap"
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                padding: '24px 16px',
                border: '2px dashed var(--primary)',
                background: 'var(--primary-soft)',
                cursor: 'pointer',
              }}
              onClick={() => a.go('addPet')}
            >
              <span style={{ fontSize: 32 }}>🐶</span>
              <span className="h3" style={{ margin: 0 }}>Add your first pet</span>
              <span className="small muted">
                Keep their records in one place for faster vet chats.
              </span>
              <span className="btn btn-primary btn-sm" style={{ pointerEvents: 'none' }}>
                + Add Pet
              </span>
            </button>
          ) : (
            /* Horizontal scroll of pet cards */
            <div
              style={{
                display: 'flex',
                gap: 10,
                overflowX: 'auto',
                paddingBottom: 4,
                scrollbarWidth: 'none',
              }}
            >
              {a.pets.map((p) => (
                <button
                  key={p.id}
                  className="card card-tap"
                  style={{
                    minWidth: 120,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    padding: '14px 12px',
                    cursor: 'pointer',
                    border: 'none',
                    flexShrink: 0,
                  }}
                  onClick={() => {
                    a.selectPet(p.id);
                    a.go('petDetail', { petId: p.id });
                  }}
                >
                  <span style={{ fontSize: 30 }}>{speciesEmoji(p.species)}</span>
                  <span className="small strong" style={{ textAlign: 'center' }}>
                    {p.name}
                  </span>
                  <span className="tiny muted" style={{ textAlign: 'center' }}>
                    {p.breed || p.species}
                  </span>
                </button>
              ))}

              {/* Add pet card inline */}
              <button
                className="card card-tap"
                style={{
                  minWidth: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '14px 12px',
                  cursor: 'pointer',
                  border: '2px dashed var(--primary)',
                  background: 'var(--primary-soft)',
                  flexShrink: 0,
                }}
                onClick={() => a.go('addPet')}
              >
                <span style={{ fontSize: 24, color: 'var(--primary)', fontWeight: 700 }}>+</span>
                <span className="tiny" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  Add pet
                </span>
              </button>
            </div>
          )}
        </div>

        <div style={{ height: 96 }} />
      </div>
    </div>
  );
}
