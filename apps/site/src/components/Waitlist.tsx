import { useState, type FormEvent } from 'react';
import { ScrollReveal } from './ScrollReveal';

export function Waitlist() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [role, setRole] = useState<'owner' | 'vet'>('owner');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <section className="section waitlist" id="waitlist" aria-label="Join the waitlist">
      <div className="section-inner">
        <ScrollReveal>
          <span className="section-label">Stay in touch</span>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <h2 className="section-title">Be the first to know</h2>
        </ScrollReveal>
        <ScrollReveal delay={150}>
          <p className="section-subtitle" style={{ margin: '0 auto', maxWidth: '500px' }}>
            PetCare 24/7 is launching soon. Join the waitlist and we&rsquo;ll let you know
            the moment we&rsquo;re live in your region.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={200}>
          {submitted ? (
            <div className="mt-32">
              <p className="waitlist-success" style={{ fontSize: '1.25rem' }}>
                You&rsquo;re on the list! We&rsquo;ll be in touch soon.
              </p>
            </div>
          ) : (
            <form className="waitlist-form" onSubmit={handleSubmit} aria-label="Waitlist signup" style={{ flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <button
                  type="button"
                  onClick={() => setRole('owner')}
                  className={`btn ${role === 'owner' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                >
                  Pet parent
                </button>
                <button
                  type="button"
                  onClick={() => setRole('vet')}
                  className={`btn ${role === 'vet' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                >
                  Veterinarian
                </button>
              </div>
              <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '480px' }}>
                <label htmlFor="waitlist-email" className="sr-only" style={{
                  position: 'absolute', width: '1px', height: '1px', overflow: 'hidden',
                }}>Email address</label>
                <input
                  id="waitlist-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-primary">
                  {role === 'vet' ? 'Apply as vet' : 'Join waitlist'}
                </button>
              </div>
            </form>
          )}
          <p className="waitlist-note">
            No spam. Unsubscribe anytime. We&rsquo;ll only email about launch updates.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
