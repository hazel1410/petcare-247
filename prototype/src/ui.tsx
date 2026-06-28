import { useApp } from './app';

/* Shared presentational components every screen reuses. */

/* ---- Paw Pulse: the signature logo (paw + heartbeat) ---- */
export function PawPulse({ size = 56, line = '#F59E0B' }: { size?: number; line?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-label="PetCare 24/7">
      <ellipse cx="17" cy="21" rx="6" ry="8" fill="currentColor" />
      <ellipse cx="32" cy="15.5" rx="6.5" ry="9" fill="currentColor" />
      <ellipse cx="47" cy="21" rx="6" ry="8" fill="currentColor" />
      <ellipse cx="55" cy="34" rx="4.6" ry="6" fill="currentColor" />
      <path
        d="M32 27C21.5 27 15 36 16.6 44.4 18 51.5 25 55 32 55s14-3.5 15.4-10.6C49 36 42.5 27 32 27Z"
        fill="currentColor"
      />
      <polyline
        className="pawpulse-line"
        points="20,44 26.5,44 29.5,37 33.5,51 37,44 44,44"
        stroke={line}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/* ---- iOS-style status bar at the top of the phone ---- */
export function StatusBar() {
  return (
    <div className="statusbar">
      <span>9:41</span>
      <span className="dots">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
          <rect x="0" y="6" width="3" height="5" rx="1" fill="#1F2937" />
          <rect x="4.5" y="3.5" width="3" height="7.5" rx="1" fill="#1F2937" />
          <rect x="9" y="1" width="3" height="10" rx="1" fill="#1F2937" />
          <rect x="13.5" y="1" width="3" height="10" rx="1" fill="#1F2937" opacity="0.35" />
        </svg>
        <svg width="22" height="11" viewBox="0 0 24 12" fill="none">
          <rect x="0.5" y="0.5" width="20" height="11" rx="3" stroke="#1F2937" opacity="0.5" />
          <rect x="2" y="2" width="15" height="8" rx="1.5" fill="#1F2937" />
          <rect x="21.5" y="4" width="2" height="4" rx="1" fill="#1F2937" opacity="0.5" />
        </svg>
      </span>
    </div>
  );
}

/* ---- back header for pushed screens ---- */
export function BackHeader({ title, onBack }: { title?: string; onBack?: () => void }) {
  const { back } = useApp();
  return (
    <div className="topbar">
      <button className="iconbtn" onClick={onBack ?? back} aria-label="Back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M15 5l-7 7 7 7" stroke="#1F2937" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {title ? <span className="h3">{title}</span> : null}
    </div>
  );
}

/* ---- star rating (display or interactive) ---- */
export function Stars({
  value,
  size = 16,
  onChange,
}: {
  value: number;
  size?: number;
  onChange?: (v: number) => void;
}) {
  return (
    <span style={{ display: 'inline-flex', gap: 3 }}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.round(value);
        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            onClick={onChange ? () => onChange(i) : undefined}
            style={{ cursor: onChange ? 'pointer' : 'default' }}
            fill={filled ? '#F59E0B' : 'none'}
            stroke={filled ? '#F59E0B' : '#cbd5d1'}
            strokeWidth="1.8"
          >
            <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5L12 18.9 6.2 21l1.1-6.5L2.6 9.9l6.5-.95L12 2.5z" strokeLinejoin="round" />
          </svg>
        );
      })}
    </span>
  );
}

export function Avatar({ initials, size = 44, bg }: { initials: string; size?: number; bg?: string }) {
  return (
    <span
      className="avatar"
      style={{ width: size, height: size, fontSize: size * 0.38, background: bg }}
    >
      {initials}
    </span>
  );
}

export function Typing() {
  return (
    <span className="typing" aria-label="typing">
      <i /><i /><i />
    </span>
  );
}

/* small inline icons used across tabs */
export function Icon({ name, size = 22, color = 'currentColor' }: { name: string; size?: number; color?: string }) {
  const p: Record<string, string> = {
    home: 'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10',
    paw: 'M12 14c-3 0-5 2-5 4s2 2 5 2 5 0 5-2-2-4-5-4z',
    services: 'M4 7h16M4 12h16M4 17h10',
    community: 'M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM21 20v-2a4 4 0 0 0-3-3.8',
    account: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 21a7 7 0 0 1 14 0',
    chevron: 'M9 6l6 6-6 6',
    phone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z',
    pin: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    plus: 'M12 5v14M5 12h14',
    bell: 'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
    shield: 'M12 2l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5l8-3z',
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={p[name] ?? p.paw} />
    </svg>
  );
}
