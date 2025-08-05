"use client";

import { useEffect, useState } from "react";
import AgentEnrollmentModal from "./components/global/AgentEnrollmentModal";
import Hero from "@/app/components/Hero";
import CoreServices from "@/app/components/CoreServices";
import Testimonials from "@/app/components/Testimonials";
import ImpactSection from "@/app/components/ImpactSection";
import VisualInsight from "@/app/components/VisualInsight";
import AboutUs from "@/app/components/AboutUs";
import SocialHandles from "@/app/components/SocialHandles";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    const now = new Date();
    const cutoff = new Date();
    cutoff.setHours(15, 0, 0, 0); // 3:00 PM

    const timeout = setTimeout(() => {
      setLoading(false);
      requestAnimationFrame(() => {
        setContentVisible(true);
      });

      if (now < cutoff) {
        setShowModal(false);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-[#008751] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* ✅ Modal rendered outside main content */}
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
          <Hero />
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
