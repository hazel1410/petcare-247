import { PawPulse } from './PawPulse';

export function Hero() {
  return (
    <section className="hero" aria-label="Hero">
      <div className="section-inner">
        <div className="hero-paw">
          <PawPulse size={64} />
        </div>
        <h1 className="hero-title">
          Is it an emergency, <br />or can it wait?
        </h1>
        <p className="hero-subtitle">
          A qualified veterinarian, any hour. Describe your pet&rsquo;s symptoms,
          get matched instantly, and receive expert triage guidance — no
          appointments, no waiting rooms.
        </p>
        <div className="hero-trust">
          <span className="hero-trust-dot" aria-hidden="true" />
          <span><strong>24</strong> vets online now</span>
        </div>
        <div className="hero-ctas">
          <a href="#waitlist" className="btn btn-primary">
            Join the waitlist
          </a>
          <a href="#how-it-works" className="btn btn-secondary">
            See how it works
          </a>
        </div>
      </div>
    </section>
  );
}
