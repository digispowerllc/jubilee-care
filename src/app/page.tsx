'use client';

import { useEffect, useState } from 'react';
import AgentEnrollmentModal from './components/AgentEnrollmentModal';
import Hero from '@/app/components/Hero';
import CoreServices from '@/app/components/CoreServices';
import Testimonials from '@/app/components/Testimonials';
import ImpactSection from '@/app/components/ImpactSection';
import VisualInsight from '@/app/components/VisualInsight';
import AboutUs from '@/app/components/AboutUs';
import SocialHandles from '@/app/components/SocialHandles';

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
     
      <Hero />
      <CoreServices />
      <ImpactSection />
      <Testimonials />
      <VisualInsight />
      <AboutUs />
      <SocialHandles />
          </main>
  );
}
