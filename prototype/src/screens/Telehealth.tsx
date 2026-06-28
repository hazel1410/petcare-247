import { useState } from 'react';
import { useApp } from '../app';
import { BackHeader, Avatar, Stars } from '../ui';
import { VETS, TELEHEALTH_SLOTS } from '../mock';

type VisitType = 'Video' | 'Text';

export function TelehealthScreen() {
  const a = useApp();

  const [selectedVetId, setSelectedVetId] = useState<string>(VETS[0].id);
  const [visitType, setVisitType] = useState<VisitType>('Video');
  const [dayIndex, setDayIndex] = useState<number>(0);
  const [time, setTime] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  const selectedVet = VETS.find((v) => v.id === selectedVetId) ?? VETS[0];
  const selectedDay = TELEHEALTH_SLOTS[dayIndex];
  const price = visitType === 'Video' ? '$19' : '$9';

  function handleConfirm() {
    if (!time) return;
    setBooked(true);
  }

  if (booked) {
    return (
      <div className="screen fade">
        <BackHeader title="Book a vet visit" />
        <div className="pad stack">
          <div className="card" style={{ textAlign: 'center', padding: '28px 20px', gap: 12, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 48 }}>✅</span>
            <p className="h2">Booked!</p>
            <p className="body" style={{ color: 'var(--text-muted)' }}>
              {selectedVet.name} · {selectedDay.label} {time} · {visitType}
            </p>
            <p className="small muted" style={{ marginTop: 4 }}>
              A confirmation will be sent to your registered email. You'll get a link to join the {visitType.toLowerCase()} consult 10 minutes before your appointment.
            </p>
            <button
              className="btn btn-ghost"
              style={{ marginTop: 12, width: '100%' }}
              onClick={() => a.setTab('home')}
            >
              Done
            </button>
          </div>
        </div>
        <div style={{ height: 40 }} />
      </div>
    );
  }

  return (
    <div className="screen fade">
      <BackHeader title="Book a vet visit" />

      <div className="pad stack">

        {/* Intro */}
        <p className="body muted">
          Not urgent? Schedule a video or text consult with a vet you choose.
        </p>

        {/* Disclaimer */}
        <div className="disclaimer">
          <span>⚠️</span>
          <span>
            For emergencies — collapse, seizure, difficulty breathing — use{' '}
            <strong>Ask a Vet Now</strong> or head straight to an ER. Don't wait.
          </span>
        </div>

        {/* ── Step 1: Choose a vet ── */}
        <div className="stack-sm">
          <p className="small strong" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            1 · Choose a vet
          </p>
          {VETS.map((vet) => {
            const isSelected = vet.id === selectedVetId;
            return (
              <div
                key={vet.id}
                className={`card card-tap${isSelected ? ' on' : ''}`}
                style={{
                  borderColor: isSelected ? 'var(--primary)' : 'transparent',
                  borderWidth: 2,
                  borderStyle: 'solid',
                  cursor: 'pointer',
                  background: isSelected ? 'var(--primary-soft)' : undefined,
                  transition: 'all 0.15s ease',
                }}
                onClick={() => setSelectedVetId(vet.id)}
              >
                <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <Avatar initials={vet.initials} size={48} />
                    {vet.online && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: 1,
                          right: 1,
                          width: 11,
                          height: 11,
                          borderRadius: '50%',
                          background: '#22c55e',
                          border: '2px solid #fff',
                        }}
                      />
                    )}
                  </div>
                  <div className="grow stack-sm" style={{ gap: 3 }}>
                    <div className="row row-between" style={{ alignItems: 'center' }}>
                      <span className="body strong">{vet.name}</span>
                      {isSelected && (
                        <span style={{ color: 'var(--primary)', fontSize: 18, lineHeight: 1 }}>✓</span>
                      )}
                    </div>
                    <p className="small muted" style={{ margin: 0 }}>
                      {vet.city} {vet.flag} · {vet.specialty}
                    </p>
                    <div className="row" style={{ gap: 6, alignItems: 'center', marginTop: 2 }}>
                      <Stars value={vet.rating} size={13} />
                      <span className="tiny muted">{vet.rating} ({vet.reviews.toLocaleString()} reviews)</span>
                    </div>
                    <div className="row" style={{ gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
                      {vet.online && (
                        <span className="pill pill-online" style={{ fontSize: 11 }}>Online now</span>
                      )}
                      <span className="pill pill-teal" style={{ fontSize: 11 }}>
                        ⚡ {vet.avgReplyMin} min avg reply
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="divider" />

        {/* ── Step 2: Visit type ── */}
        <div className="stack-sm">
          <p className="small strong" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            2 · Visit type
          </p>
          <div className="seg" style={{ display: 'flex' }}>
            {(['Video', 'Text'] as VisitType[]).map((vt) => (
              <button
                key={vt}
                className={visitType === vt ? 'on' : ''}
                style={{ flex: 1 }}
                onClick={() => setVisitType(vt)}
              >
                {vt === 'Video' ? '📹 Video' : '💬 Text'}
              </button>
            ))}
          </div>
          <p className="small muted" style={{ marginTop: 2 }}>
            {visitType === 'Video'
              ? 'Face-to-face call — best for visual symptoms like rashes or limping.'
              : 'Chat-based — great for follow-ups, medication questions, or peace of mind.'}
          </p>
        </div>

        <div className="divider" />

        {/* ── Step 3: Pick a time ── */}
        <div className="stack-sm">
          <p className="small strong" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            3 · Pick a time
          </p>

          {/* Day selector */}
          <div className="chips">
            {TELEHEALTH_SLOTS.map((slot, idx) => (
              <button
                key={slot.label}
                className={`chip${dayIndex === idx ? ' on' : ''}`}
                onClick={() => {
                  setDayIndex(idx);
                  setTime(null);
                }}
              >
                {slot.label}
              </button>
            ))}
          </div>

          {/* Time slots */}
          <div className="chips" style={{ marginTop: 6 }}>
            {selectedDay.times.map((t) => (
              <button
                key={t}
                className={`chip${time === t ? ' on' : ''}`}
                onClick={() => setTime(t)}
              >
                {t}
              </button>
            ))}
          </div>

          {!time && (
            <p className="tiny muted" style={{ marginTop: 4 }}>
              Tap a time slot to select it.
            </p>
          )}
        </div>

        <div className="divider" />

        {/* ── Summary + Confirm ── */}
        <div className="card-flat stack-sm" style={{ padding: '14px 16px', borderRadius: 14 }}>
          <div className="row row-between" style={{ alignItems: 'center' }}>
            <span className="body strong">
              {visitType === 'Video' ? '📹 Video consult' : '💬 Text consult'}
            </span>
            <span className="h3" style={{ color: 'var(--primary)' }}>{price}</span>
          </div>
          {time ? (
            <p className="small muted">
              {selectedVet.name} · {selectedDay.label} at {time}
            </p>
          ) : (
            <p className="small muted">Select a time to continue.</p>
          )}
          <p className="tiny faint" style={{ marginTop: 2 }}>
            Video $19 · Text $9 · Billed once at booking. Cancel up to 1 hr before.
          </p>
        </div>

        <button
          className="btn btn-primary"
          disabled={!time}
          style={{
            opacity: !time ? 0.45 : 1,
            cursor: !time ? 'not-allowed' : 'pointer',
          }}
          onClick={handleConfirm}
        >
          Confirm booking{time ? ` · ${price}` : ''}
        </button>

      </div>
      <div style={{ height: 40 }} />
    </div>
  );
}
