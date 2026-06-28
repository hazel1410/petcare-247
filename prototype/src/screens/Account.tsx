import { useState } from 'react';
import { useApp } from '../app';
import { Avatar, Icon } from '../ui';

export function AccountScreen() {
  const a = useApp();

  const [healthData, setHealthData] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [exportNote, setExportNote] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  return (
    <div className="screen fade">
      <div className="pad stack">
        <h1 className="h1">Account</h1>

        {/* Header card: Avatar + owner info */}
        <div className="card row" style={{ gap: 16, alignItems: 'center' }}>
          <Avatar initials={
            a.owner?.name
              ? a.owner.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
              : 'ME'
          } size={52} />
          <div className="stack-sm grow">
            <span className="h3">{a.owner?.name ?? 'Your Name'}</span>
            <span className="small muted">{a.owner?.email ?? 'your@email.com'}</span>
          </div>
        </div>

        {/* Section: Consent & privacy */}
        <div className="stack-sm">
          <span className="h2">Consent &amp; privacy</span>

          <div className="card stack-sm">
            <div className="row-between">
              <div className="stack-sm" style={{ flex: 1, paddingRight: 12 }}>
                <span className="body strong">Store my pet's health data</span>
                <span className="tiny muted">Required for vet consultations and triage history.</span>
              </div>
              <button
                className={`switch${healthData ? ' on' : ''}`}
                onClick={() => setHealthData(v => !v)}
                aria-pressed={healthData}
                aria-label="Store my pet's health data"
              />
            </div>

            <div className="divider" />

            <div className="row-between">
              <div className="stack-sm" style={{ flex: 1, paddingRight: 12 }}>
                <span className="body strong">Marketing emails</span>
                <span className="tiny muted">Tips, offers, and pet health news. Unsubscribe anytime.</span>
              </div>
              <button
                className={`switch${marketing ? ' on' : ''}`}
                onClick={() => setMarketing(v => !v)}
                aria-pressed={marketing}
                aria-label="Marketing emails"
              />
            </div>
          </div>
        </div>

        {/* Section: Your data */}
        <div className="stack-sm">
          <span className="h2">Your data</span>

          <div className="card stack-sm">
            {/* Export my data */}
            <button
              className="lrow btn-text"
              style={{ width: '100%', textAlign: 'left' }}
              onClick={() => { setExportNote(v => !v); setDeleteConfirm(false); }}
            >
              <div className="row-between" style={{ width: '100%' }}>
                <span className="body">Export my data</span>
                <Icon name="chevron" size={18} color="var(--text-muted)" />
              </div>
            </button>

            {exportNote && (
              <div className="card-flat" style={{ padding: '10px 14px' }}>
                <span className="small muted">
                  We'll email your data within 30 days. Check your inbox (and spam folder — just in case).
                </span>
              </div>
            )}

            <div className="divider" />

            {/* Delete my account */}
            <button
              className="lrow btn-text"
              style={{ width: '100%', textAlign: 'left' }}
              onClick={() => { setDeleteConfirm(v => !v); setExportNote(false); }}
            >
              <div className="row-between" style={{ width: '100%' }}>
                <span className="body" style={{ color: 'var(--coral)' }}>Delete my account</span>
                <Icon name="chevron" size={18} color="var(--coral)" />
              </div>
            </button>

            {deleteConfirm && (
              <div className="card stack-sm" style={{ border: '1.5px solid var(--coral)', marginTop: 4 }}>
                <span className="body strong">Are you sure?</span>
                <span className="small muted">
                  This permanently deletes your account, all pets, and consultation history. This cannot be undone.
                </span>
                <div className="row" style={{ gap: 10 }}>
                  <button
                    className="btn btn-coral btn-sm grow"
                    onClick={() => { setDeleteConfirm(false); a.go('welcome'); }}
                  >
                    Yes, delete everything
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setDeleteConfirm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section: Region */}
        <div className="stack-sm">
          <span className="h2">Region</span>
          <div className="card stack-sm">
            <div className="row-between">
              <span className="body strong">United States 🇺🇸</span>
              <span className="pill pill-teal" style={{ fontSize: 12 }}>Active</span>
            </div>
            <span className="small muted">Triage available in US, Canada &amp; India.</span>
          </div>
        </div>

        {/* Grievance officer */}
        <span className="tiny muted center">
          Grievance officer: privacy@petcare247.app (India)
        </span>

        {/* Vet mode */}
        <div className="stack-sm">
          <span className="h2">Are you a vet?</span>
          <button
            className="card card-tap lrow"
            style={{ width: '100%', textAlign: 'left' }}
            onClick={() => a.go('vetHome')}
          >
            <div className="row" style={{ gap: 12, alignItems: 'center', width: '100%' }}>
              <span style={{ fontSize: 22 }}>🩺</span>
              <div className="grow">
                <span className="h3">Switch to Vet mode</span>
                <p className="small muted" style={{ marginTop: 2 }}>Answer questions & track your earnings</p>
              </div>
              <Icon name="chevron" size={18} color="var(--text-muted)" />
            </div>
          </button>
        </div>

        {/* Sign out */}
        <button
          className="btn btn-ghost"
          onClick={() => a.go('welcome')}
          style={{ marginTop: 4 }}
        >
          Sign out
        </button>

        {/* Bottom breathing room for tab bar */}
        <div style={{ height: 96 }} />
      </div>
    </div>
  );
}
