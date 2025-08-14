"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AgentEnrollmentModal from "../components/global/AgentEnrollmentModal";
import HeroWrapper from "@/components/HeroWrapper";
import CoreServices from "@/components/CoreServices";
import Testimonials from "@/components/Testimonials";
import ImpactSection from "@/components/ImpactSection";
import VisualInsight from "@/components/VisualInsight";
import AboutUs from "@/components/AboutUs";
import SocialHandles from "@/components/SocialHandles";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/agent/auth/check-session", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (data.valid) {
          // ✅ Redirect to profile if already logged in
          router.replace("/agent/profile");
        } else {
          setAuthenticated(false);
        }
      } catch (err) {
        console.error("Session check failed:", err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);
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
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-700 border-t-transparent rounded-full animate-spin" />
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
