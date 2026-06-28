import { PawPulse } from './PawPulse';

export function Nav() {
  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      <div className="nav-inner">
        <a href="#" className="nav-logo">
          <PawPulse size={32} />
          PetCare 24/7
        </a>
        <button className="nav-mobile-toggle" aria-label="Toggle menu" onClick={toggleMobileNav}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <ul className="nav-links" id="nav-links">
          <li><a href="#how-it-works">How it works</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#for-vets">For vets</a></li>
          <li><a href="#waitlist" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>Join waitlist</a></li>
        </ul>
      </div>
    </nav>
  );
}

function toggleMobileNav() {
  const links = document.getElementById('nav-links');
  if (links) links.classList.toggle('open');
}
