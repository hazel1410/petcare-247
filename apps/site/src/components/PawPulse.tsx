export function PawPulse({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Main pad (paw center) — contains ECG line */}
      <path
        d="M20 24c-3 0-5.5-2.5-5.5-5.5S17 13 20 13s5.5 2.5 5.5 5.5S23 24 20 24Z"
        fill="#3AAFA9"
        opacity="0.2"
      />
      {/* ECG line inside the main pad */}
      <polyline
        points="14,18.5 17,18.5 18,16 19,21 20,17 21,20 22,18.5 26,18.5"
        stroke="#3AAFA9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Toe beans */}
      <ellipse cx="12" cy="12" rx="3" ry="3.5" fill="#3AAFA9" />
      <ellipse cx="20" cy="8" rx="3" ry="3.5" fill="#3AAFA9" />
      <ellipse cx="28" cy="12" rx="3" ry="3.5" fill="#3AAFA9" />
      <ellipse cx="11" cy="21" rx="3" ry="3.5" fill="#3AAFA9" transform="rotate(-20 11 21)" />
      <ellipse cx="29" cy="21" rx="3" ry="3.5" fill="#3AAFA9" transform="rotate(20 29 21)" />
    </svg>
  );
}
