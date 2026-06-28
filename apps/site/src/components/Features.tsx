import { ScrollReveal } from './ScrollReveal';

const features = [
  {
    icon: '\u{1F9D1}\u200D\u{2695}\uFE0F',
    title: 'Vet triage & guidance',
    desc: 'Get expert triage from licensed veterinarians. We help you understand urgency \u2014 we never diagnose or prescribe.',
  },
  {
    icon: '\u{1F4CB}',
    title: 'Digital records',
    desc: 'Vaccination history, medications, weight tracking \u2014 all in one place, accessible anytime.',
  },
  {
    icon: '\u{23F0}',
    title: 'Smart reminders',
    desc: 'Never miss a vaccine booster, flea treatment, or check-up again.',
  },
  {
    icon: '\u{1F9F5}',
    title: 'Services near you',
    desc: 'Find trusted groomers, walkers, and boarding \u2014 all reviewed by the pet parent community.',
  },
  {
    icon: '\u{1F6CD}\uFE0F',
    title: 'Pet supplies',
    desc: 'Food, medication, accessories delivered to your door. Curated recommendations from vets.',
  },
  {
    icon: '\u{1F91D}',
    title: 'Community',
    desc: 'Connect with other pet parents. Share tips, ask questions, and find local playgroups.',
  },
];

export function Features() {
  return (
    <section className="section" id="features" aria-label="Features">
      <div className="section-inner">
        <ScrollReveal>
          <span className="section-label">Super-app</span>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <h2 className="section-title">Everything your pet needs</h2>
        </ScrollReveal>
        <ScrollReveal delay={150}>
          <p className="section-subtitle">
            Beyond triage, PetCare 24/7 is your pet&rsquo;s wellness hub:
          </p>
        </ScrollReveal>
        <div className="features-grid">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 80} direction="up">
              <div className="card">
                <div className="feature-icon" aria-hidden="true" style={{ background: 'var(--teal-light)' }}>
                  {f.icon}
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
