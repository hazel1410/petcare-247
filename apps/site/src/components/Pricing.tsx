import { ScrollReveal } from './ScrollReveal';

const plans = [
  {
    name: 'First question',
    price: 'Free',
    desc: 'Your first consultation is on us. No payment needed.',
    free: true,
  },
  {
    name: 'Per consult',
    price: '$1 \u2013 $5',
    featured: true,
    desc: 'Pay only when you need a vet. No subscription, no hidden fees.',
    features: ['Instant matching', 'License-verified vets', 'Follow-up included'],
  },
  {
    name: 'For vets',
    price: '80% payout',
    desc: 'Keep 80% of every consult fee. Set your own hours, work from anywhere.',
    features: ['Weekly payouts', 'Stripe or Wise', 'Licensed only'],
  },
];

export function Pricing() {
  return (
    <section className="section" id="pricing" aria-label="Pricing">
      <div className="section-inner text-center">
        <ScrollReveal>
          <span className="section-label">Pricing</span>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <h2 className="section-title">Fair to you, fair to vets</h2>
        </ScrollReveal>
        <ScrollReveal delay={150}>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            No subscriptions, no surprises. Pay only when you need a veterinarian.
          </p>
        </ScrollReveal>
        <div className="pricing-cards">
          {plans.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i * 150} direction="up">
              <div className={`card pricing-card ${plan.featured ? 'featured' : ''}`}>
                {plan.featured && <div className="pricing-card-featured-badge">Most popular</div>}
                {plan.free ? (
                  <div className="pricing-free">Free</div>
                ) : (
                  <div className="pricing-amount" dangerouslySetInnerHTML={{ __html: plan.price }} />
                )}
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '8px' }}>{plan.name}</h3>
                <p className="pricing-desc">{plan.desc}</p>
                {'features' in plan && plan.features && (
                  <ul style={{
                    listStyle: 'none', fontSize: '0.9rem', color: 'var(--charcoal-light)',
                    display: 'flex', flexDirection: 'column', gap: '8px',
                  }}>
                    {plan.features.map((f) => (
                      <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                        <span style={{ color: 'var(--leaf)' }} aria-hidden="true">{'\u2713'}</span> {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
