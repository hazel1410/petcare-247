import { PawPulse } from './PawPulse';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PawPulse size={28} />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--white)' }}>
              PetCare 24/7
            </span>
          </div>
          <p>
            A qualified vet, any hour. PetCare 24/7 connects pet parents with
            licensed veterinarians for instant triage guidance — no appointments,
            no waiting rooms.
          </p>
        </div>
        <div className="footer-links">
          <h4>Product</h4>
          <ul>
            <li><a href="#how-it-works">How it works</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#waitlist">Waitlist</a></li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Veterinarians</h4>
          <ul>
            <li><a href="#for-vets">Why join</a></li>
            <li><a href="#for-vets">Apply as a vet</a></li>
            <li><a href="#">Vet FAQ</a></li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About us</a></li>
            <li><a href="#">Privacy policy</a></li>
            <li><a href="#">Terms of service</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} PetCare 24/7. All rights reserved.</span>
        <div className="footer-markets" aria-label="Available in">
          <span title="United States" aria-label="United States">{'\u{1F1FA}\u{1F1F8}'}</span>
          <span title="Canada" aria-label="Canada">{'\u{1F1E8}\u{1F1E6}'}</span>
          <span title="India" aria-label="India">{'\u{1F1EE}\u{1F1F3}'}</span>
        </div>
      </div>
    </footer>
  );
}
