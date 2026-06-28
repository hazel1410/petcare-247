const steps = [
  {
    number: 1,
    title: 'Describe',
    desc: 'Tell us what&rsquo;s going on with your pet. Symptoms, behaviour changes, anything unusual.',
  },
  {
    number: 2,
    title: 'Instant match',
    desc: 'We match you with a licensed, available vet in seconds — no appointment needed.',
  },
  {
    number: 3,
    title: 'Get guidance',
    desc: 'Receive triage guidance: is this an emergency, a vet visit, or something you can monitor at home?',
  },
];

export function HowItWorks() {
  return (
    <section className="section" id="how-it-works" aria-label="How it works">
      <div className="section-inner text-center">
        <span className="section-label">How it works</span>
        <h2 className="section-title">From worried owner to clear answer</h2>
        <p className="section-subtitle" style={{ margin: '0 auto' }}>
          Three simple steps to get your pet the care they need, right when you need it.
        </p>
        <div className="how-steps">
          {steps.map((step) => (
            <div className="card" key={step.number}>
              <div className="step-number">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc" dangerouslySetInnerHTML={{ __html: step.desc }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
