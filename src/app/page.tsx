// No "use client" needed here — this is a server component
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import CoreServices from '../components/CoreServices';
import Testimonials from '../components/Testimonials';
import ImpactSection from '../components/ImpactSection';
import VisualInsight from '../components/VisualInsight';
import AboutUs from '../components/AboutUs';
import SocialHandles from '../components/SocialHandles';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <CoreServices />
      <ImpactSection />
      <Testimonials />
      <VisualInsight />
      <AboutUs />
      <SocialHandles />
      <Footer />
    </main>
  );
}
