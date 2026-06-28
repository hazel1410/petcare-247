import { useState } from 'react';
import { useApp } from '../app';
import { BackHeader } from '../ui';
import { speciesEmoji } from '../mock';

/* ---- Deterministic faux-QR cell fill ---- */
function cellFilled(row: number, col: number): boolean {
  // Corner finder squares (top-left, top-right, bottom-left)
  const inTL = row < 3 && col < 3;
  const inTR = row < 3 && col > 5;
  const inBL = row > 5 && col < 3;

  if (inTL || inTR || inBL) {
    // Local coordinates within the 3×3 finder block
    const lr = inBL ? row - 6 : row;
    const lc = inTR ? col - 6 : col;
    // Outer border filled, centre empty → looks like a finder square
    return lr === 0 || lr === 2 || lc === 0 || lc === 2;
  }

  // Data modules: deterministic by index, looks random but reproducible
  const idx = row * 9 + col;
  return (idx * 7 + 3) % 13 < 6;
}

/* ---- Faux QR code: 9×9 grid of filled/empty squares ---- */
function FauxQR() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(9, 18px)',
        gridTemplateRows: 'repeat(9, 18px)',
        gap: 2,
        margin: '0 auto',
        padding: 10,
        background: '#ffffff',
        borderRadius: 10,
        boxShadow: '0 1px 6px rgba(0,0,0,0.10)',
        width: 'fit-content',
      }}
    >
      {Array.from({ length: 81 }, (_, i) => {
        const row = Math.floor(i / 9);
        const col = i % 9;
        const filled = cellFilled(row, col);
        return (
          <div
            key={i}
            style={{
              width: 18,
              height: 18,
              borderRadius: 2,
              background: filled ? '#1F2937' : 'transparent',
            }}
          />
        );
      })}
    </div>
  );
}

export function LostPetScreen() {
  const a = useApp();
  const pet = a.pets.find((p) => p.id === a.params?.petId) ?? a.pets[0];

  const [isLost, setIsLost] = useState(false);
  const [shared, setShared] = useState(false);

  /* Guard: no pets yet */
  if (!pet) {
    return (
      <div className="screen fade">
        <BackHeader title="Lost-pet QR tag" />
        <div className="pad stack">
          <div className="card center" style={{ padding: 32 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🐾</div>
            <p className="body muted">No pet found. Add a pet first to generate a QR tag.</p>
          </div>
        </div>
      </div>
    );
  }

  const emoji = speciesEmoji(pet.species);

  return (
    <div className="screen fade">
      <BackHeader title="Lost-pet QR tag" />

      <div className="pad stack">

        {/* ---- QR Tag Card ---- */}
        <div className="card center" style={{ padding: '24px 20px 20px' }}>
          <FauxQR />
          <div style={{ fontSize: 34, marginTop: 16, marginBottom: 2, lineHeight: 1 }}>{emoji}</div>
          <div className="h2" style={{ marginBottom: 4 }}>{pet.name}</div>
          <div className="small muted">Scan to contact {pet.name}'s family</div>
        </div>

        {/* ---- Lost toggle ---- */}
        <div
          className="card-flat"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 4px',
          }}
        >
          <span className="body">Mark {pet.name} as lost</span>
          <button
            className={'switch' + (isLost ? ' on' : '')}
            onClick={() => setIsLost((v) => !v)}
            aria-label={isLost ? 'Mark as found' : 'Mark as lost'}
          >
            <span />
          </button>
        </div>

        {/* ---- Coral alert (visible when lost) ---- */}
        {isLost && (
          <div
            className="card"
            style={{
              background: 'rgba(239,68,68,0.07)',
              border: '1.5px solid var(--coral)',
              padding: '14px 16px',
            }}
          >
            <div className="row" style={{ gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>🚨</span>
              <p className="body" style={{ color: 'var(--coral)', margin: 0, lineHeight: 1.5 }}>
                <span className="strong">{pet.name} is marked as lost</span> — anyone who
                scans the tag now sees your contact info and last-seen location.
              </p>
            </div>
          </div>
        )}

        {/* ---- "What a finder sees" preview ---- */}
        <div>
          <div
            className="tiny"
            style={{
              marginBottom: 8,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-muted)',
            }}
          >
            What a finder sees
          </div>
          <div
            className="card"
            style={{
              background: 'var(--primary-soft)',
              border: '1.5px dashed var(--primary)',
              padding: '22px 18px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 44, marginBottom: 8, lineHeight: 1 }}>{emoji}</div>
            <div className="h2" style={{ marginBottom: 6 }}>{pet.name}</div>
            <div className="body muted" style={{ marginBottom: 18 }}>
              please help me get home 🏠
            </div>
            <div
              className="body strong"
              style={{
                marginBottom: 18,
                fontSize: 17,
                letterSpacing: '0.04em',
                color: '#1F2937',
              }}
            >
              +1 (•••) •••-0142
            </div>
            <button className="btn btn-coral" style={{ width: '100%' }} onClick={() => {}}>
              📞 Call family
            </button>
          </div>
        </div>

        {/* ---- Action buttons ---- */}
        <button
          className="btn btn-primary"
          style={{ width: '100%' }}
          onClick={() => setShared(true)}
        >
          {shared ? '✓ QR tag shared!' : 'Share QR tag'}
        </button>

        <button className="btn btn-ghost" style={{ width: '100%' }}>
          Order a physical tag&nbsp;
          <span className="pill pill-amber" style={{ fontSize: 11, marginLeft: 4 }}>
            coming soon
          </span>
        </button>

        {/* ---- Disclaimer ---- */}
        <p className="disclaimer">
          Your contact details are only revealed when you mark a pet lost.
        </p>

        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}
