'use client';

import { useEffect, useState } from 'react';
import AgentEnrollmentModal from './components/AgentEnrollmentModal';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import CoreServices from './components/CoreServices';
import Testimonials from './components/Testimonials';
import ImpactSection from './components/ImpactSection';
import VisualInsight from './components/VisualInsight';
import AboutUs from './components/AboutUs';
import SocialHandles from './components/SocialHandles';
import Footer from './components/Footer';

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const now = new Date();
    const cutoff = new Date();
    cutoff.setHours(15, 0, 0, 0); // 3:00 PM today

    if (now < cutoff) {
      setShowModal(true);
    }
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {showModal && <AgentEnrollmentModal onClose={() => setShowModal(false)} />}
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
