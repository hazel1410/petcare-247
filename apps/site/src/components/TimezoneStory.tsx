import { ScrollReveal } from './ScrollReveal';

const cities = [
  { name: 'New York', flag: '\u{1F1FA}\u{1F1F8}', time: '03:00 AM' },
  { name: 'London', flag: '\u{1F1EC}\u{1F1E7}', time: '08:00 AM' },
  { name: 'Toronto', flag: '\u{1F1E8}\u{1F1E6}', time: '03:00 AM' },
  { name: 'Mumbai', flag: '\u{1F1EE}\u{1F1F3}', time: '12:30 PM' },
  { name: 'Sydney', flag: '\u{1F1E6}\u{1F1FA}', time: '05:00 PM' },
  { name: 'Dubai', flag: '\u{1F1E6}\u{1F1EA}', time: '11:00 AM' },
];

export function TimezoneStory() {
  return (
    <section className="section" aria-label="24/7 availability" style={{ background: 'var(--white)' }}>
      <div className="section-inner text-center">
        <ScrollReveal>
          <span className="section-label">Always on</span>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <h2 className="section-title">Someone trusted is always awake</h2>
        </ScrollReveal>
        <ScrollReveal delay={150}>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Our vet network spans every time zone. When your regular clinic is closed,
            a licensed veterinarian is already online &mdash; ready to help.
          </p>
        </ScrollReveal>
        <div className="timezone-visual">
          {cities.map((city, i) => (
            <ScrollReveal key={city.name} delay={i * 100}>
              <div className="timezone-city">
                <div className="timezone-city-flag" aria-hidden="true">{city.flag}</div>
                <div className="timezone-city-name">{city.name}</div>
                <div className="timezone-city-time">{city.time}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal delay={600}>
          <p className="mt-24" style={{ fontSize: '0.9rem', color: 'var(--gray-500)' }}>
            Localized for <strong>United States, Canada, and India</strong> &mdash; with more regions coming soon.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
