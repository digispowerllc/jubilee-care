// File: src/app/LayoutLoaderWrapper.tsx
"use client";
import { useEffect, useState } from "react";
import Navigation from "@/components/nav/Navigation";

export default function LayoutLoaderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/agent/auth/check-session", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        setAuthenticated(data.valid);
      } catch (err) {
        console.error("Session check failed:", err);
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
      requestAnimationFrame(() => setVisible(true));
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (visible) {
      const timeout = setTimeout(() => {
        setContentVisible(true);
      }, 10);
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
    <div className="min-h-screen flex flex-col">
      <Navigation authenticated={authenticated} />
      <main
        className={`flex-grow transition-all duration-700 ease-out transform ${
          contentVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6"
        }`}
      >
        {children}
      </main>
      {/* Footer has been removed from here */}
    </div>
  );
}
