import { ScrollReveal } from './ScrollReveal';

const benefits = [
  {
    title: 'Your schedule',
    desc: 'Work when you want. Morning, night, weekends \u2014 you decide. Perfect for supplementing your clinic income.',
    icon: '\u{1F552}',
  },
  {
    title: '80% of every consult',
    desc: 'Keep 80% of the consultation fee. Weekly payouts via Stripe Connect (US/CA) or Wise (India).',
    icon: '\u{1F4B0}',
  },
  {
    title: 'From anywhere',
    desc: 'All you need is a license, a stable internet connection, and a quiet space. Work from home, a coffee shop, or wherever you travel.',
    icon: '\u{1F30D}',
  },
];

export function VetRecruitment() {
  return (
    <section className="section vet-section" id="for-vets" aria-label="For veterinarians">
      <div className="section-inner text-center">
        <ScrollReveal>
          <span className="section-label" style={{ color: 'var(--teal-light)' }}>For veterinarians</span>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <h2 className="section-title">Earn from home, on your schedule</h2>
        </ScrollReveal>
        <ScrollReveal delay={150}>
          <p className="section-subtitle" style={{ margin: '0 auto', color: 'var(--gray-300)' }}>
            PetCare 24/7 connects licensed DVMs with pet owners who need immediate triage
            guidance. No commute, no clinic overhead, no late-night ER shifts.
          </p>
        </ScrollReveal>
        <div className="vet-benefits">
          {benefits.map((b, i) => (
            <ScrollReveal key={b.title} delay={i * 150} direction="up">
              <div className="vet-benefit">
                <div style={{ fontSize: '2rem', marginBottom: '12px' }} aria-hidden="true">{b.icon}</div>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal delay={450}>
          <div className="mt-48">
            <a href="#waitlist" className="btn btn-amber">
              Become a vet &rarr;
            </a>
            <p className="mt-16" style={{ fontSize: '0.85rem', color: 'var(--gray-400)' }}>
              Must hold an active DVM/VMD license in your country of practice.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
