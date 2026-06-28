import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Features } from './components/Features';
import { TimezoneStory } from './components/TimezoneStory';
import { Pricing } from './components/Pricing';
import { VetRecruitment } from './components/VetRecruitment';
import { TrustSafety } from './components/TrustSafety';
import { Waitlist } from './components/Waitlist';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <TimezoneStory />
        <Pricing />
        <VetRecruitment />
        <TrustSafety />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}
