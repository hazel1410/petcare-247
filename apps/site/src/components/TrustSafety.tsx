import { ScrollReveal } from './ScrollReveal';

const trustItems = [
  {
    icon: '\u{1F393}',
    title: 'License-verified vets',
    desc: 'Every veterinarian on PetCare 24/7 is credential-checked. We verify licenses against state/provincial veterinary boards.',
  },
  {
    icon: '\u{1F512}',
    title: 'Encrypted records',
    desc: 'All medical records, conversations, and personal data are encrypted end-to-end. We never share your data without consent.',
  },
  {
    icon: '\u{1F4CB}',
    title: 'Triage, not diagnosis',
    desc: 'We provide triage guidance and urgency assessment only. No diagnoses, no prescriptions. Always follow up with your local vet.',
  },
];

export function TrustSafety() {
  return (
    <section className="section" id="trust" aria-label="Trust and safety">
      <div className="section-inner">
        <div className="text-center">
          <ScrollReveal>
            <span className="section-label">Trust &amp; safety</span>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 className="section-title">Your pet&rsquo;s well-being is our priority</h2>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              We take safety seriously. Here&rsquo;s how we protect you and your pet.
            </p>
          </ScrollReveal>
        </div>
        <div className="trust-grid">
          {trustItems.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 150} direction="up">
              <div className="trust-item card">
                <div className="trust-icon" aria-hidden="true">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal delay={500}>
          <div className="disclaimer mt-48" role="alert">
            <strong>Important:</strong> PetCare 24/7 provides <strong>triage guidance and urgency assessment</strong> only.
            Our veterinarians do <strong>not</strong> diagnose conditions, prescribe medications, or replace in-person
            veterinary care. Always consult your local veterinarian for definitive diagnosis and treatment.
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
