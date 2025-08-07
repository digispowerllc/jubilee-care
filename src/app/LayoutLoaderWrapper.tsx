"use client";

import { useEffect, useState } from "react";
 import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Notification from "@/components/global/Notification";

export default function LayoutLoaderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
      // Trigger visibility transition on next frame
      requestAnimationFrame(() => setVisible(true));
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  // Trigger content visibility once visible is true
  useEffect(() => {
    if (visible) {
      const timeout = setTimeout(() => {
        setContentVisible(true);
      }, 10); // Delay just enough for transition to kick in
      return () => clearTimeout(timeout);
    }
  }, [visible]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-[#008751] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Navigation />

      <div
        className={`transition-all duration-700 ease-out transform ${
          contentVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6"
        }`}
      >
        {children}
      </div>

      <Footer />
      <Notification />
    </>
  );
}
