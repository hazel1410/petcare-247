import { useRef, useState } from 'react';
import { useApp } from '../app';
import { BackHeader, PawPulse } from '../ui';

/* ---- brand icons for social login ---- */
function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1F2937" aria-hidden>
      <path d="M16.4 12.9c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.5-.1-2.8.8-3.5.8s-1.8-.8-3-.8c-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2-.1 1.6-.8 3-.8s1.8.8 3 .7c1.2 0 2-1.1 2.8-2.2.9-1.3 1.2-2.5 1.3-2.6-.1 0-2.5-1-2.5-3.9zM14.1 6.3c.6-.8 1.1-1.9 1-3-1 0-2.1.6-2.8 1.4-.6.7-1.1 1.8-1 2.9 1.1.1 2.2-.5 2.8-1.3z" />
    </svg>
  );
}
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.5 29.3 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13.5 24 13.5c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.5 29.3 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 43.5c5.2 0 9.8-2 13.3-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.1 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.6 39 16.2 43.5 24 43.5z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.4l6.2 5.2c-.4.4 6.6-4.8 6.6-14.6 0-1.2-.1-2.3-.4-3.5z" />
    </svg>
  );
}

/* ============================================================
   WelcomeScreen — branded splash, one generic entry point
   ============================================================ */
const WELCOME_FEATURES = [
  { e: '🩺', t: 'Ask a vet, 24/7' },
  { e: '📋', t: 'Health records' },
  { e: '⏰', t: 'Reminders' },
  { e: '✂️', t: 'Groomers & walkers' },
  { e: '🛍️', t: 'Pet supplies' },
  { e: '💬', t: 'Community' },
];

export function WelcomeScreen() {
  const a = useApp();
  return (
    <div className="screen fade">
      <div className="pad center" style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 18 }} />
        <div className="stack center" style={{ gap: 10 }}>
          <span style={{ color: 'var(--primary)', display: 'block' }}>
            <PawPulse size={70} />
          </span>
          <h1 className="h-hero" style={{ textAlign: 'center', margin: 0 }}>PetCare 24/7</h1>
          <p className="body muted" style={{ textAlign: 'center', maxWidth: 290, margin: '0 auto' }}>
            Everything your pet needs — starting with a vet, any hour.
          </p>
          <span className="pill pill-online">
            <span className="dot" />
            {a.vetsOnline} vets online now
          </span>
        </div>

        <div className="feature-grid" style={{ marginTop: 26 }}>
          {WELCOME_FEATURES.map((f) => (
            <div key={f.t} className="feature-cell">
              <span style={{ fontSize: 22 }}>{f.e}</span>
              <span className="tiny strong">{f.t}</span>
            </div>
          ))}
        </div>

        <div style={{ flex: 1, minHeight: 18 }} />
        <div className="stack" style={{ gap: 10, width: '100%' }}>
          <button className="btn btn-primary" onClick={() => a.go('auth')}>
            Log in or sign up
          </button>
          <p className="tiny muted" style={{ textAlign: 'center', margin: 0 }}>
            First question is always free.
          </p>
        </div>
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

/* ============================================================
   AuthScreen — one generic flow: phone OR email + one-time code,
   then social as alternatives. No password, no signup/login split.
   ============================================================ */
export function AuthScreen() {
  const a = useApp();
  return (
    <div className="screen fade">
      <BackHeader title="Log in or sign up" />
      <div className="pad stack">
        <p className="body muted" style={{ marginTop: 2 }}>
          Enter your phone or email and we’ll text or email you a one-time code. No password to remember.
        </p>

        <div className="seg" style={{ marginTop: 4 }}>
          <button
            className={a.authMethod === 'phone' ? 'on' : ''}
            onClick={() => { a.setAuthMethod('phone'); a.setAuthValue(''); }}
          >
            Phone
          </button>
          <button
            className={a.authMethod === 'email' ? 'on' : ''}
            onClick={() => { a.setAuthMethod('email'); a.setAuthValue(''); }}
          >
            Email
          </button>
        </div>

        <div className="field stack-sm">
          <label className="field-label">
            {a.authMethod === 'phone' ? 'Mobile number' : 'Email address'}
          </label>
          <input
            className="input"
            type={a.authMethod === 'phone' ? 'tel' : 'email'}
            inputMode={a.authMethod === 'phone' ? 'tel' : 'email'}
            placeholder={a.authMethod === 'phone' ? '+1 (555) 000-0000' : 'you@example.com'}
            value={a.authValue}
            onChange={(e) => a.setAuthValue(e.target.value)}
            autoFocus
          />
        </div>

        <button
          className="btn btn-primary"
          disabled={!a.authValue.trim()}
          onClick={() => a.go('otp')}
        >
          Send one-time code
        </button>

        <div className="or-divider"><span>or</span></div>

        <button className="btn btn-ghost btn-social" onClick={() => a.go('ownerProfile')}>
          <AppleIcon /> Continue with Apple
        </button>
        <button className="btn btn-ghost btn-social" onClick={() => a.go('ownerProfile')}>
          <GoogleIcon /> Continue with Google
        </button>

        <p className="tiny muted" style={{ textAlign: 'center', marginTop: 10 }}>
          By continuing you agree to our Terms of Service & Privacy Policy.
        </p>
        <div style={{ height: 32 }} />
      </div>
    </div>
  );
}

/* ============================================================
   OtpScreen — enter the one-time code (generic, no mode)
   ============================================================ */
export function OtpScreen() {
  const a = useApp();
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const allFilled = digits.every((d) => d.length === 1);

  function handleChange(index: number, value: string) {
    const char = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    if (char && index < 5) refs[index + 1].current?.focus();
  }
  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) refs[index - 1].current?.focus();
  }

  return (
    <div className="screen fade">
      <BackHeader title="Enter your code" />
      <div className="pad stack">
        <p className="body muted" style={{ marginTop: 2 }}>
          Sent to <strong>{a.authValue || (a.authMethod === 'phone' ? 'your phone' : 'your email')}</strong>. It may take a moment to arrive.
        </p>

        <div className="row" style={{ gap: 8, justifyContent: 'center', marginTop: 14 }}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={refs[i]}
              className="input"
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              style={{ width: 46, textAlign: 'center', fontSize: 22, fontWeight: 600, padding: '12px 0', flexShrink: 0 }}
              autoFocus={i === 0}
            />
          ))}
        </div>

        <p className="tiny muted" style={{ textAlign: 'center', marginTop: 8 }}>
          Demo: type any 6 digits.
        </p>

        <button className="btn btn-primary" disabled={!allFilled} onClick={() => a.go('ownerProfile')} style={{ marginTop: 12 }}>
          Verify & continue
        </button>
        <button
          className="btn btn-text"
          onClick={() => { setDigits(['', '', '', '', '', '']); refs[0].current?.focus(); }}
          style={{ alignSelf: 'center' }}
        >
          Resend code
        </button>

        <div style={{ height: 32 }} />
      </div>
    </div>
  );
}
