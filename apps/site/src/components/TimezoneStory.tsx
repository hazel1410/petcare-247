import { useState } from 'react';
import { ScrollReveal } from './ScrollReveal';
import TimezoneGlobe from './3d/TimezoneGlobe';

const cities = [
  { name: 'New York', flag: '🇺🇸', offset: 0 },
  { name: 'London', flag: '🇬🇧', offset: 5 },
  { name: 'Toronto', flag: '🇨🇦', offset: 0 },
  { name: 'Mumbai', flag: '🇮🇳', offset: 9.5 },
  { name: 'Sydney', flag: '🇦🇺', offset: 14 },
  { name: 'Dubai', flag: '🇦🇪', offset: 8 },
];

function formatLocalTime(estHour: number, offset: number): { timeString: string; isNight: boolean; status: 'active' | 'standby' | 'offline' } {
  // Add 24 to handle negative offsets if any, and modulo 24
  const totalMinutes = Math.round((estHour * 60 + offset * 60) + 1440) % 1440;
  const hour24 = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  const displayHour = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const displayMinutes = minutes === 30 ? '30' : '00';
  
  const timeString = `${displayHour}:${displayMinutes} ${ampm}`;
  const isNight = hour24 < 6 || hour24 >= 18;
  
  let status: 'active' | 'standby' | 'offline' = 'offline';
  if (hour24 >= 8 && hour24 < 22) {
    status = 'active';
  } else if ((hour24 >= 6 && hour24 < 8) || (hour24 >= 22 && hour24 < 24)) {
    status = 'standby';
  }
  
  return { timeString, isNight, status };
}

export function TimezoneStory() {
  const [estHour, setEstHour] = useState<number>(12); // Default to 12 PM EST

  const getAmPmEST = (hour: number) => {
    if (hour === 0) return '12:00 AM';
    if (hour === 12) return '12:00 PM';
    return hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
  };

  // Count active/standby vets
  const activeCount = cities.reduce((acc, city) => {
    const { status } = formatLocalTime(estHour, city.offset);
    return status === 'active' || status === 'standby' ? acc + 1 : acc;
  }, 0);

  return (
    <section className="section" id="timezone-story" aria-label="24/7 availability" style={{ background: 'var(--white)', borderTop: '1px solid var(--gray-200)' }}>
      <div className="section-inner text-center">
        <ScrollReveal>
          <span className="section-label">Always awake</span>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <h2 className="section-title">The sun never sets on our vet network</h2>
        </ScrollReveal>
        <ScrollReveal delay={150}>
          <p className="section-subtitle" style={{ margin: '0 auto', maxWidth: '640px' }}>
            We routing consults across time zones. While your local clinic is closed, a licensed vet in London, Mumbai, or Sydney is awake, alert, and ready to help.
          </p>
        </ScrollReveal>

        {/* Interactive 3D globe — drag to spin; pulses flow from night-time owners to awake vets */}
        <ScrollReveal delay={180}>
          <div style={{ width: '100%', maxWidth: 560, height: 360, margin: '12px auto 0' }}>
            <TimezoneGlobe />
          </div>
          <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: 'var(--charcoal-light)' }}>
            Drag to spin the globe 🌍
          </p>
        </ScrollReveal>

        {/* Timezone Slider Widget */}
        <ScrollReveal delay={200}>
          <div className="timezone-slider-container" style={{
            background: 'var(--cream)',
            border: '1.5px dashed var(--teal)',
            borderRadius: '20px',
            padding: '24px 32px',
            maxWidth: '750px',
            margin: '40px auto 32px',
            boxShadow: '0 4px 12px rgba(58,175,169,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--charcoal-light)' }}>Simulate Hour (EST):</span>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--teal-dark)', margin: 0, fontFamily: 'var(--font-heading)' }}>
                  {getAmPmEST(estHour)}
                </h3>
              </div>
              <div style={{ background: 'var(--white)', padding: '8px 16px', borderRadius: '100px', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--gray-200)' }}>
                <span className="hero-trust-dot" style={{ background: 'var(--leaf)' }} />
                <span>{activeCount} regional hubs online</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.25rem' }}>🌙</span>
              <input
                type="range"
                min="0"
                max="23"
                value={estHour}
                onChange={(e) => setEstHour(parseInt(e.target.value))}
                style={{
                  flex: 1,
                  height: '8px',
                  borderRadius: '5px',
                  background: 'var(--gray-300)',
                  outline: 'none',
                  cursor: 'pointer',
                  accentColor: 'var(--teal)'
                }}
                aria-label="Simulate hour of the day"
              />
              <span style={{ fontSize: '1.25rem' }}>☀️</span>
            </div>
            <p style={{ margin: '8px 0 0', fontSize: '0.78rem', color: 'var(--charcoal-light)' }}>
              Slide the slider to rotate the Earth and see which veterinarians are awake!
            </p>
          </div>
        </ScrollReveal>

        <div className="timezone-visual" style={{ marginTop: '24px' }}>
          {cities.map((city) => {
            const { timeString, isNight, status } = formatLocalTime(estHour, city.offset);
            const isOnline = status === 'active' || status === 'standby';

            return (
              <div
                key={city.name}
                className="timezone-city"
                style={{
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: isNight ? '#1E293B' : 'var(--white)',
                  color: isNight ? '#F8FAFC' : 'var(--charcoal)',
                  border: isOnline 
                    ? `2px solid ${status === 'active' ? 'var(--teal)' : 'var(--amber)'}`
                    : '2px solid transparent',
                  boxShadow: isOnline 
                    ? `0 0 15px ${status === 'active' ? 'rgba(58,175,169,0.15)' : 'rgba(245,158,11,0.1)'}`
                    : '0 2px 5px rgba(0,0,0,0.03)',
                  transform: isOnline ? 'scale(1.03)' : 'scale(1)',
                  padding: '24px 16px',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Status Dot / Ribbon */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: status === 'active' ? 'var(--leaf)' : status === 'standby' ? 'var(--amber)' : 'var(--gray-400)',
                  boxShadow: isOnline ? `0 0 8px ${status === 'active' ? 'var(--leaf)' : 'var(--amber)'}` : 'none'
                }} />

                <div className="timezone-city-flag" aria-hidden="true" style={{ fontSize: '2rem', marginBottom: '8px' }}>
                  {city.flag}
                </div>
                <div className="timezone-city-name" style={{ fontSize: '1rem', fontWeight: 700 }}>
                  {city.name}
                </div>
                <div className="timezone-city-time" style={{
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  margin: '6px 0',
                  color: isNight ? '#E2E8F0' : 'var(--charcoal-light)'
                }}>
                  {timeString}
                </div>

                <div style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: '100px',
                  marginTop: '4px',
                  background: status === 'active' 
                    ? 'rgba(34,197,94,0.15)' 
                    : status === 'standby' 
                      ? 'rgba(245,158,11,0.15)' 
                      : 'rgba(156,163,175,0.15)',
                  color: status === 'active' 
                    ? '#22C55E' 
                    : status === 'standby' 
                      ? 'var(--amber)' 
                      : isNight ? '#94A3B8' : 'var(--gray-500)'
                }}>
                  {status === 'active' ? 'Active Online' : status === 'standby' ? 'Vets On Call' : 'Offline'}
                </div>

                {/* Day/Night indicator icon */}
                <div style={{
                  position: 'absolute',
                  bottom: '-8px',
                  opacity: 0.1,
                  fontSize: '3rem',
                  pointerEvents: 'none'
                }}>
                  {isNight ? '🌙' : '☀️'}
                </div>
              </div>
            );
          })}
        </div>
        <ScrollReveal delay={500}>
          <p className="mt-32" style={{ fontSize: '0.9rem', color: 'var(--gray-500)' }}>
            Localized for <strong>United States, Canada, and India</strong> &mdash; with more regions coming soon.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
