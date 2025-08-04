import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import CoreServices from '@/components/CoreServices';
import Testimonials from '@/components/Testimonials';
import ImpactSection from '@/components/ImpactSection';
import VisualInsight from '@/components/VisualInsight';
import AboutUs from '@/components/AboutUs';
import SocialHandles from '@/components/SocialHandles';
import Footer from '@/components/Footer';
import AgentEnrollmentModal from '@/components/AgentEnrollmentModal';

export default function Home() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(true);
  }, []);

  return (
    <>
      <Navigation />
      {showModal && <AgentEnrollmentModal onClose={() => setShowModal(false)} />}
      <Hero />
      <CoreServices />
      <ImpactSection />
      <Testimonials />
      <VisualInsight />
      <AboutUs />
      <SocialHandles />
      <Footer />
    </>
  );
}
