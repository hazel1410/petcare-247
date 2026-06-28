import { useState } from 'react';
import { useApp } from '../app';
import { BackHeader, Avatar, Stars } from '../ui';
import { VET_QUEUE, VET_STATS, URGENCY_META, speciesEmoji } from '../mock';

export function VetHomeScreen() {
  const a = useApp();
  const [online, setOnline] = useState(true);

  const urgencyBadgeStyle = (hint: 'emergency' | 'soon' | 'monitor'): React.CSSProperties => {
    if (hint === 'emergency') return { background: 'var(--coral-soft)', color: '#b91c1c', border: '1px solid #f5b5b5' };
    if (hint === 'soon') return { background: 'var(--amber-soft)', color: '#92400e', border: '1px solid #f3d79a' };
    return { background: 'var(--leaf-soft)', color: '#166534', border: '1px solid #bce8cd' };
  };

  return (
    <div className="screen fade">
      <BackHeader title="Vet dashboard" onBack={() => a.setTab('account')} />

      <div className="pad stack">

        {/* Header: avatar + greeting + online toggle */}
        <div className="card row" style={{ gap: 14, alignItems: 'center' }}>
          <Avatar initials={VET_STATS.initials} size={52} />
          <div className="stack-sm grow">
            <span className="small muted">Good to see you,</span>
            <span className="h2" style={{ lineHeight: 1.2 }}>{VET_STATS.name}</span>
          </div>
          <div className="stack-sm" style={{ alignItems: 'flex-end', flexShrink: 0 }}>
            <span className="tiny muted" style={{ textAlign: 'right' }}>
              {online ? 'Online' : 'Offline'}
            </span>
            <button
              className={`switch${online ? ' on' : ''}`}
              onClick={() => setOnline((v) => !v)}
              aria-pressed={online}
              aria-label={online ? 'Go offline' : 'Go online'}
            >
              <span />
            </button>
          </div>
        </div>

        {/* Offline notice */}
        {!online && (
          <div className="card-flat" style={{ padding: '10px 14px', borderRadius: 10 }}>
            <span className="small muted">
              You won't receive new questions while offline.
            </span>
          </div>
        )}

        {/* Stats tiles */}
        <div className="row" style={{ gap: 10 }}>
          <div className="card-flat" style={{ flex: 1, borderRadius: 12, padding: '12px 14px', textAlign: 'center' }}>
            <div className="h2" style={{ color: 'var(--primary)' }}>{VET_STATS.answeredToday}</div>
            <div className="tiny muted" style={{ marginTop: 2 }}>Answered today</div>
          </div>
          <div className="card-flat" style={{ flex: 1, borderRadius: 12, padding: '12px 14px', textAlign: 'center' }}>
            <div className="h2" style={{ color: 'var(--primary)' }}>
              {'$' + VET_STATS.earningsTodayUsd.toFixed(2)}
            </div>
            <div className="tiny muted" style={{ marginTop: 2 }}>Earned today</div>
          </div>
          <div className="card-flat" style={{ flex: 1, borderRadius: 12, padding: '12px 14px', textAlign: 'center' }}>
            <div className="h2" style={{ color: 'var(--primary)' }}>{VET_STATS.rating}</div>
            <div style={{ marginTop: 2 }}>
              <Stars value={VET_STATS.rating} size={12} />
            </div>
            <div className="tiny muted" style={{ marginTop: 1 }}>Rating</div>
          </div>
        </div>

        {/* Performance pill */}
        <div style={{ display: 'flex' }}>
          <span className="pill pill-teal">
            Avg reply {VET_STATS.avgReplyMin} min · {VET_STATS.helped} helped
          </span>
        </div>

        {/* Incoming questions section */}
        <div className="stack-sm">
          <div className="row-between">
            <span className="h2">Incoming questions</span>
            <span className="badge" style={{ background: 'var(--primary-soft)', color: 'var(--primary-dark)' }}>
              {VET_QUEUE.length}
            </span>
          </div>

          {VET_QUEUE.map((item) => {
            const meta = URGENCY_META[item.urgencyHint];
            return (
              <div
                key={item.id}
                className="card"
                style={{ opacity: online ? 1 : 0.48, transition: 'opacity 0.2s' }}
              >
                {/* Top row: pet name + urgency badge */}
                <div className="row-between" style={{ marginBottom: 6 }}>
                  <span className="strong" style={{ fontSize: 15 }}>
                    {speciesEmoji(item.species)}&nbsp;{item.petName} · {item.species}
                  </span>
                  <span
                    className="badge"
                    style={urgencyBadgeStyle(item.urgencyHint)}
                  >
                    {meta.emoji}&nbsp;{meta.label}
                  </span>
                </div>

                {/* Owner + region */}
                <div className="small muted" style={{ marginBottom: 6 }}>
                  {item.ownerName} &nbsp;·&nbsp; {item.region}
                </div>

                {/* Summary */}
                <div className="body" style={{ marginBottom: 12 }}>
                  {item.summary}
                </div>

                {/* Bottom row: wait time, fee, action */}
                <div className="row-between">
                  <div className="row" style={{ gap: 12 }}>
                    <span className="small muted">waited {item.waitedMin}m</span>
                    <span className="small strong" style={{ color: 'var(--primary)' }}>
                      {'$' + item.feeUsd.toFixed(2)}
                    </span>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    disabled={!online}
                    onClick={() => a.go('vetAnswer', { queueId: item.id })}
                    style={{ opacity: online ? 1 : 0.4 }}
                  >
                    Answer
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View earnings CTA */}
        <button
          className="btn btn-ghost"
          onClick={() => a.go('vetEarnings')}
        >
          View earnings &amp; payouts
        </button>

        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}
