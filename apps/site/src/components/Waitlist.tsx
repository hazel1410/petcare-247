import { useState, type FormEvent } from 'react';

export function Waitlist() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    // Stubbed — in production, POST to a webhook or Supabase
    setSubmitted(true);
  }

  return (
    <section className="section waitlist" id="waitlist" aria-label="Join the waitlist">
      <div className="section-inner">
        <span className="section-label">Stay in touch</span>
        <h2 className="section-title">Be the first to know</h2>
        <p className="section-subtitle" style={{ margin: '0 auto', maxWidth: '500px' }}>
          PetCare 24/7 is launching soon. Join the waitlist and we&rsquo;ll let you know
          the moment we&rsquo;re live in your region.
        </p>
        {submitted ? (
          <p className="waitlist-success">You&rsquo;re on the list! We&rsquo;ll be in touch soon.</p>
        ) : (
          <form className="waitlist-form" onSubmit={handleSubmit} aria-label="Waitlist signup">
            <label htmlFor="waitlist-email" className="sr-only" style={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              overflow: 'hidden',
            }}>Email address</label>
            <input
              id="waitlist-email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Join waitlist</button>
          </form>
        )}
        <p className="waitlist-note">
          No spam. Unsubscribe anytime. We&rsquo;ll only email about launch updates.
        </p>
      </div>
    </section>
  );
}
