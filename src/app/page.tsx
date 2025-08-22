// Homepage (page.tsx)
"use client";

import { useEffect, useState } from "react";
import AgentEnrollmentModal from "../components/global/AgentEnrollmentModal";
import Hero from "@/components/ui/landingPage/HeroClient";
import CoreServices from "@/components/ui/landingPage/CoreServices";
import Testimonials from "@/components/ui/landingPage/Testimonials";
import ImpactSection from "@/components/ui/landingPage/ImpactSection";
import VisualInsight from "@/components/ui/landingPage/VisualInsight";
import AboutUs from "@/components/ui/landingPage/AboutUs";
import SocialHandles from "@/components/ui/landingPage/SocialHandles";
import { ProjectsSeo } from "@/components/seo";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const now = new Date();
    const cutoff = new Date();
    cutoff.setHours(15, 0, 0, 0); // 3:00 PM

    if (now < cutoff) {
      setShowModal(false);
    }
  }, []);

  return (
    <>
      <ProjectsSeo />
      <div className="animate-fade-in">
        {/* Modal rendered outside main content */}
        {showModal && (
          <div className="animate-fade-in">
            <AgentEnrollmentModal onClose={() => setShowModal(false)} />
          </div>
        )}

        <main className="min-h-screen bg-white">
          <Hero />
          <CoreServices />
          <ImpactSection />
          <Testimonials />
          <VisualInsight />
          <AboutUs />
          <SocialHandles />
        </main>

        <style jsx global>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
          }
        `}</style>
      </div>
    </>
  );
}
