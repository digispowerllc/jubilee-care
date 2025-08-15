// File: src/app/LayoutLoaderWrapper.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isPublicPath, isPrivatePath } from "@/lib/config/auth-paths";
import Navigation from "@/components/nav/Navigation";

export default function LayoutLoaderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [transitionState, setTransitionState] = useState<
    "hidden" | "transitioning" | "visible"
  >("hidden");
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    let transitionTimer: NodeJS.Timeout;

    const checkSession = async () => {
      try {
        setLoading(true); // Show spinner immediately

        const res = await fetch("/api/agent/auth/check-session", {
          credentials: "include",
          cache: "no-store",
        });
        const { valid } = await res.json();

        if (!mounted) return;

        setAuthenticated(valid);

        // Redirect authenticated users from public pages
        if (valid && isPublicPath(pathname)) {
          router.replace("/agent/profile");
          return;
        }

        // Redirect unauthenticated users from private pages
        if (!valid && isPrivatePath(pathname)) {
          router.replace("/agent/signin");
          return;
        }
      } catch (err) {
        console.error("Session check failed:", err);
        if (mounted) setAuthenticated(false);
      } finally {
        if (mounted) {
          setLoading(false);
          setTransitionState("transitioning");
          transitionTimer = setTimeout(() => setTransitionState("visible"), 30);
        }
      }
    };

    checkSession();
    return () => {
      mounted = false;
      clearTimeout(transitionTimer);
    };
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="animate-spin h-8 w-8 border-b-2 border-green-600 rounded-full"></div>
      </div>
    );
  }

  // Don't render if redirecting
  if (
    (authenticated && isPublicPath(pathname)) ||
    (!authenticated && isPrivatePath(pathname))
  ) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation authenticated={authenticated ?? false} />
      <main
        className={`flex-grow transition-all duration-200 ${
          transitionState === "visible"
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        }`}
      >
        {children}
      </main>

      {/* Persistent spinner during transitions */}
      {transitionState !== "visible" && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-40">
          <div className="animate-spin h-8 w-8 border-b-2 border-green-600 rounded-full"></div>
        </div>
      )}
    </div>
  );
}
