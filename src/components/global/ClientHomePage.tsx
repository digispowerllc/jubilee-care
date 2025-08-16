"use client";

import { useEffect, useState } from "react";
import AgentEnrollmentModal from "./AgentEnrollmentModal";
import HeroWrapper from "@/components/ui/landingPage/HeroWrapper";
import CoreServices from "@/components/ui/landingPage/CoreServices";
import Testimonials from "@/components/ui/landingPage/Testimonials";
import ImpactSection from "@/components/ui/landingPage/ImpactSection";
import VisualInsight from "@/components/ui/landingPage/VisualInsight";
import AboutUs from "@/components/ui/landingPage/AboutUs";
import SocialHandles from "@/components/ui/landingPage/SocialHandles";

export default function ClientHomePage() {
  const [showModal, setShowModal] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    const now = new Date();
    const cutoff = new Date();
    cutoff.setHours(15, 0, 0, 0);

    const timeout = setTimeout(() => {
      requestAnimationFrame(() => {
        setContentVisible(true);
      });

      if (now < cutoff) {
        setShowModal(false);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {showModal && (
        <AgentEnrollmentModal onClose={() => setShowModal(false)} />
      )}

      <main className="min-h-screen bg-white">
        <div
          className={`transition-all duration-700 ease-out transform ${
            contentVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <HeroWrapper />
          <CoreServices />
          <ImpactSection />
          <Testimonials />
          <VisualInsight />
          <AboutUs />
          <SocialHandles />
        </div>
      </main>
    </>
  );
}
