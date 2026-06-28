import { HeroScene } from './HeroScene';
import { AnimatedCounter } from './AnimatedCounter';

export function Hero() {
  return (
    <section className="hero" aria-label="Hero">
      <div className="section-inner">
        <HeroScene />
        <h1 className="hero-title" style={{ maxWidth: 900 }}>
          Is it an emergency, <br />or can it wait?
        </h1>
        <p className="hero-subtitle">
          A qualified veterinarian, any hour. Describe your pet&rsquo;s symptoms,
          get matched instantly, and receive expert triage guidance &mdash; no
          appointments, no waiting rooms.
        </p>
        <div className="hero-trust">
          <span className="hero-trust-dot" aria-hidden="true" />
          <span>
            <AnimatedCounter target={24} suffix="" /> vets online now
          </span>
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
