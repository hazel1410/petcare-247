import { useState } from 'react';
import { BackHeader, Stars } from '../ui';
import { VET_STATS, VET_PAYOUTS, VET_BALANCE_USD } from '../mock';

export function VetEarningsScreen() {
  const [withdrawn, setWithdrawn] = useState(false);

  return (
    <div className="screen fade">
      <BackHeader title="Earnings" />

      <div className="pad stack">
        {/* ── Hero: available balance ── */}
        <div className="card" style={{ background: 'var(--primary-soft)', gap: 10 }}>
          <span className="small muted" style={{ letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: 11 }}>
            Available balance
          </span>
          <span className="h1" style={{ fontSize: 38, lineHeight: 1.1 }}>
            {'$' + VET_BALANCE_USD.toFixed(2)}
          </span>
          <button
            className="btn btn-primary btn-sm"
            style={{ alignSelf: 'flex-start', marginTop: 4 }}
            onClick={() => setWithdrawn(true)}
            disabled={withdrawn}
          >
            {withdrawn ? 'Payout requested ✓' : 'Withdraw'}
          </button>
        </div>

        {/* ── Stat tiles ── */}
        <div className="row" style={{ gap: 10 }}>
          <div className="card-flat" style={{ flex: 1, padding: '12px 14px', gap: 4 }}>
            <span className="tiny muted">This month</span>
            <span className="h3" style={{ color: 'var(--primary)' }}>$441.40</span>
          </div>
          <div className="card-flat" style={{ flex: 1, padding: '12px 14px', gap: 4 }}>
            <span className="tiny muted">Answered today</span>
            <span className="h3" style={{ color: 'var(--primary)' }}>{VET_STATS.answeredToday}</span>
          </div>
          <div className="card-flat" style={{ flex: 1, padding: '12px 14px', gap: 4 }}>
            <span className="tiny muted">Rating</span>
            <div className="row" style={{ gap: 4, alignItems: 'center' }}>
              <span className="h3" style={{ color: 'var(--primary)' }}>{VET_STATS.rating}</span>
              <Stars value={VET_STATS.rating} size={13} />
            </div>
          </div>
        </div>

        {/* ── Payout method ── */}
        <div className="stack-sm">
          <span className="h2">Payout method</span>
          <div className="card">
            <div className="row-between" style={{ alignItems: 'flex-start' }}>
              <div className="stack-sm" style={{ gap: 4 }}>
                <div className="row" style={{ gap: 8, alignItems: 'center' }}>
                  <span className="body strong">Wise → INR</span>
                  <span className="pill pill-online">Connected</span>
                </div>
                <span className="small muted">W-8BEN on file</span>
              </div>
              <button className="btn btn-ghost btn-sm" style={{ flexShrink: 0 }}>
                Change method
              </button>
            </div>
          </div>
        </div>

        {/* ── Payout history ── */}
        <div className="stack-sm">
          <span className="h2">Payout history</span>
          <div className="card" style={{ padding: 0 }}>
            {VET_PAYOUTS.map((p, idx) => (
              <div key={idx}>
                {idx > 0 && <div className="divider" style={{ margin: '0 16px' }} />}
                <div
                  className="row-between"
                  style={{ padding: '14px 16px', alignItems: 'center', gap: 8 }}
                >
                  <div className="stack-sm" style={{ gap: 2, flex: 1 }}>
                    <span className="body strong">{p.date}</span>
                    <span className="small muted">{p.rail}</span>
                  </div>
                  <div className="row" style={{ gap: 10, alignItems: 'center' }}>
                    <span className="body strong">{'$' + p.amountUsd.toFixed(2)}</span>
                    <span
                      className="badge"
                      style={{
                        background: p.status === 'Paid'
                          ? 'var(--leaf)'
                          : 'var(--amber)',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 6,
                        letterSpacing: '0.02em',
                      }}
                    >
                      {p.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer note ── */}
        <span className="tiny muted center">
          Payouts run bi-weekly · $20 minimum.
        </span>

        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}
