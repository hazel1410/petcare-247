import { useRef, useState } from 'react';
import { useApp } from '../app';
import { BackHeader, PawPulse } from '../ui';

export function WelcomeScreen() {
  const a = useApp();
  return (
    <div className="screen fade">
      <div className="pad stack center" style={{ minHeight: '100%', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }} />

        <div className="stack center" style={{ gap: 12 }}>
          <span style={{ color: 'var(--primary)', display: 'block' }}>
            <PawPulse size={72} />
          </span>
          <h1 className="h-hero" style={{ textAlign: 'center', margin: 0 }}>PetCare 24/7</h1>
          <p className="body muted" style={{ textAlign: 'center', maxWidth: 260, margin: '0 auto' }}>
            Is it an emergency, or can it wait?<br />A vet, any hour.
          </p>
          <div style={{ marginTop: 4 }}>
            <span className="pill pill-online">
              <span className="dot" />
              {a.vetsOnline} vets online now
            </span>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div className="stack" style={{ gap: 12, width: '100%' }}>
          <button
            className="btn btn-primary"
            onClick={() => a.go('auth', { mode: 'signup' })}
          >
            Get started
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => a.go('auth', { mode: 'login' })}
          >
            I already have an account
          </button>
          <p className="tiny muted" style={{ textAlign: 'center', margin: 0 }}>
            First question is always free.
          </p>
        </div>

        <div style={{ height: 32 }} />
      </div>
    </div>
  );
}

export function AuthScreen() {
  const a = useApp();
  const mode = (a.params?.mode as string) ?? 'signup';
  const title = mode === 'login' ? 'Welcome back' : 'Create your account';

  return (
    <div className="screen fade">
      <BackHeader title={title} />
      <div className="pad stack">
        <p className="body muted" style={{ marginTop: 4 }}>
          We'll send you a 6-digit code — no password needed.
        </p>

        <div className="seg" style={{ marginTop: 8 }}>
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

        <div className="stack-sm" style={{ marginTop: 4 }}>
          <label className="field-label">
            {a.authMethod === 'phone' ? 'Mobile number' : 'Email address'}
          </label>
          <input
            className="input"
            type={a.authMethod === 'phone' ? 'tel' : 'email'}
            placeholder={a.authMethod === 'phone' ? '+1 (555) 000-0000' : 'you@example.com'}
            value={a.authValue}
            onChange={e => a.setAuthValue(e.target.value)}
            autoFocus
          />
          <span className="field-hint">
            {a.authMethod === 'phone'
              ? 'Standard SMS rates may apply.'
              : 'Check your inbox and spam folder.'}
          </span>
        </div>

        <button
          className="btn btn-primary"
          disabled={!a.authValue.trim()}
          onClick={() => a.go('otp', { mode })}
          style={{ marginTop: 8 }}
        >
          Send code
        </button>

        <div className="divider"><span>or</span></div>

        <div className="stack" style={{ gap: 10 }}>
          <button
            className="btn btn-ghost"
            onClick={() => a.go('otp', { mode })}
          >
            Continue with Apple
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => a.go('otp', { mode })}
          >
            Continue with Google
          </button>
        </div>

        <p className="tiny muted" style={{ textAlign: 'center', marginTop: 12 }}>
          By continuing you agree to our Terms of Service and Privacy Policy.
        </p>

        <div style={{ height: 32 }} />
      </div>
    </div>
  );
}

export function OtpScreen() {
  const a = useApp();
  const mode = (a.params?.mode as string) ?? 'signup';
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const allFilled = digits.every(d => d.length === 1);

  function handleChange(index: number, value: string) {
    const char = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    if (char && index < 5) {
      refs[index + 1].current?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
  }

  function handleVerify() {
    if (!allFilled) return;
    if (mode === 'login') {
      a.seedAndEnter();
    } else {
      a.go('ownerProfile');
    }
  }

  return (
    <div className="screen fade">
      <BackHeader title="Enter your code" />
      <div className="pad stack">
        <p className="body muted" style={{ marginTop: 4 }}>
          Sent to <strong>{a.authValue || 'your phone'}</strong>. It may take a moment to arrive.
        </p>

        <div className="row" style={{ gap: 8, justifyContent: 'center', marginTop: 16 }}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={refs[i]}
              className="input"
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              style={{
                width: 44,
                textAlign: 'center',
                fontSize: 22,
                fontWeight: 600,
                padding: '10px 0',
                flexShrink: 0,
              }}
              autoFocus={i === 0}
            />
          ))}
        </div>

        <p className="tiny muted" style={{ textAlign: 'center', marginTop: 8 }}>
          Demo: type any 6 digits.
        </p>

        <button
          className="btn btn-primary"
          disabled={!allFilled}
          onClick={handleVerify}
          style={{ marginTop: 16 }}
        >
          Verify
        </button>

        <button
          className="btn btn-text"
          onClick={() => {
            setDigits(['', '', '', '', '', '']);
            refs[0].current?.focus();
          }}
          style={{ alignSelf: 'center', marginTop: 4 }}
        >
          Resend code
        </button>

        <p className="disclaimer" style={{ textAlign: 'center', marginTop: 16 }}>
          Having trouble? Contact support@petcare247.com
        </p>

        <div style={{ height: 32 }} />
      </div>
    </div>
  );
}
