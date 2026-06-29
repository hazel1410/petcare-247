import { useRef } from 'react';

/* Clean interactive hero: a CSS-3D phone mockup that tilts toward the cursor,
   with floating cards that parallax. No procedural 3D geometry (which read as
   "weird"); reliable + on-brand. Owned by the lead (hero is lead's lane). */

const reduce =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function HeroScene() {
  const wrap = useRef<HTMLDivElement>(null);
  const phone = useRef<HTMLDivElement>(null);
  const layers = useRef<HTMLDivElement[]>([]);
  const setLayer = (i: number) => (el: HTMLDivElement | null) => {
    if (el) layers.current[i] = el;
  };

  function onMove(e: React.MouseEvent) {
    if (reduce || !wrap.current) return;
    const r = wrap.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    if (phone.current) phone.current.style.transform = `rotateY(${px * 18}deg) rotateX(${-py * 14}deg)`;
    layers.current.forEach((el, i) => {
      const d = (i + 1) * 12;
      el.style.transform = `translate3d(${-px * d}px, ${-py * d}px, 0)`;
    });
  }
  function onLeave() {
    if (phone.current) phone.current.style.transform = '';
    layers.current.forEach((el) => (el.style.transform = ''));
  }

  return (
    <div
      ref={wrap}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        height: 400,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: 1000,
        position: 'relative',
      }}
    >
      <style>{`
        @keyframes heroFloat { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
        .hero-phone-wrap { animation: heroFloat 5s ease-in-out infinite; transform-style: preserve-3d; }
        @media (prefers-reduced-motion: reduce){ .hero-phone-wrap { animation: none } }
      `}</style>

      {/* floating glass cards (parallax) */}
      <div ref={setLayer(0)} style={cardStyle({ top: 10, right: -2 })}>
        <span style={{ width: 8, height: 8, borderRadius: 9, background: 'var(--leaf)', display: 'inline-block' }} />
        <span style={{ fontWeight: 700, fontSize: 12 }}>14 vets online</span>
      </div>
      <div ref={setLayer(1)} style={cardStyle({ bottom: 18, left: -6 })}>
        <span style={{ fontSize: 18 }}>🩺</span>
        <div style={{ lineHeight: 1.15 }}>
          <div style={{ fontWeight: 800, fontSize: 12 }}>Dr. Aisha Khan</div>
          <div style={{ fontSize: 11, color: 'var(--charcoal-light)' }}>⭐ 4.9 · Mumbai 🇮🇳</div>
        </div>
      </div>

      {/* phone */}
      <div className="hero-phone-wrap">
        <div ref={phone} style={{ transition: 'transform 0.15s ease-out', transformStyle: 'preserve-3d' }}>
          <div style={phoneStyle}>
            <div style={screenStyle}>
              <div style={{ fontFamily: 'var(--font-heading, serif)', fontWeight: 800, fontSize: 15, color: 'var(--charcoal)' }}>
                PetCare 24/7
              </div>
              <div style={{ fontSize: 11, color: 'var(--charcoal-light)', marginBottom: 10 }}>
                How can we help today?
              </div>

              <div style={{ background: 'var(--teal-light, #e4f4f2)', border: '1px solid var(--teal)', borderRadius: 14, padding: 12 }}>
                <div style={{ fontWeight: 800, fontSize: 12.5, color: 'var(--charcoal)', marginBottom: 7 }}>
                  Worried about your pet?
                </div>
                <div style={{ background: 'var(--teal)', color: '#fff', textAlign: 'center', fontWeight: 800, fontSize: 12.5, padding: '9px 0', borderRadius: 99 }}>
                  Ask a Vet Now
                </div>
              </div>

              <div style={{ display: 'flex', gap: 7, marginTop: 10 }}>
                <div style={miniTile}>🔍<div style={miniLbl}>Symptoms</div></div>
                <div style={miniTile}>📋<div style={miniLbl}>Records</div></div>
              </div>

              <div style={{ marginTop: 10, background: '#FEF3DF', border: '1px solid #F3D79A', borderRadius: 12, padding: '8px 10px', display: 'flex', gap: 8, alignItems: 'center' }}>
                <span>⏱️</span>
                <div style={{ lineHeight: 1.1 }}>
                  <div style={{ fontWeight: 800, fontSize: 11.5, color: '#B45309' }}>See a vet soon</div>
                  <div style={{ fontSize: 10, color: 'var(--charcoal-light)' }}>Within 24 hours</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const phoneStyle: React.CSSProperties = {
  width: 210,
  height: 380,
  borderRadius: 34,
  background: '#11181c',
  padding: 9,
  boxShadow: '0 30px 60px rgba(31,41,55,0.28)',
};
const screenStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  background: 'var(--cream, #fafaf7)',
  borderRadius: 26,
  padding: 16,
  overflow: 'hidden',
};
const miniTile: React.CSSProperties = {
  flex: 1,
  background: '#fff',
  border: '1px solid #ECECE4',
  borderRadius: 12,
  padding: '10px 8px',
  fontSize: 16,
  textAlign: 'center',
};
const miniLbl: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: 'var(--teal-dark, #2b8f8a)', marginTop: 3 };
function cardStyle(pos: React.CSSProperties): React.CSSProperties {
  return {
    position: 'absolute',
    zIndex: 6,
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    borderRadius: 12,
    padding: '8px 12px',
    boxShadow: '0 8px 22px rgba(31,41,55,0.12)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    transition: 'transform 0.15s ease-out',
    ...pos,
  };
}
