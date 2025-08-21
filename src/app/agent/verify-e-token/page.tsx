// File: api/agent/verify-r-token/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Decode token & sid safely
  const rawToken = searchParams.get("token");
  const token = rawToken ? decodeURIComponent(rawToken) : null;
  const sidRaw = searchParams.get("sid");
  const sid = sidRaw ? decodeURIComponent(sidRaw) : null;
  const autoVerify = searchParams.get("auto") === "true";
  const isPasswordReset = searchParams.get("reset") === "true";

  const [loading, setLoading] = useState(autoVerify);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [formToken, setFormToken] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);

  // ---------------- HANDLE VERIFICATION ----------------
  const handleVerification = useCallback(async () => {
    if (!token || !sid) {
      setError("Invalid verification link");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Verifying token:", token, "sid:", sid);

      const res = await fetch("/agent/verify-e-token/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, sid }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Verification failed");

      console.log("Verification response:", data);

      setVerified(true);

      // Capture temporary form token for password reset
      if (data.formToken) setFormToken(data.formToken);
    } catch (err) {
      console.error("Verification error:", err);
      setError(
        err instanceof Error ? err.message : "Unexpected verification error"
      );
    } finally {
      setLoading(false);
    }
  }, [token, sid]);

  // ---------------- AUTO VERIFY ----------------
  useEffect(() => {
    if (autoVerify && token && sid && !verified && !error) handleVerification();
  }, [autoVerify, token, sid, verified, error, handleVerification]);

  // ---------------- COUNTDOWN TIMER ----------------
  useEffect(() => {
    if ((!verified && !error) || countdown <= 0) return;

    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [verified, error, countdown]);

  // ---------------- REDIRECT AFTER COUNTDOWN ----------------
  useEffect(() => {
    if (countdown > 0) return;

    if (verified) {
      if (formToken) {
        router.push(
          `/agent/password-reset?token=${encodeURIComponent(formToken)}&sid=${encodeURIComponent(sid!)}`
        );
      } else {
        router.push(`/agent/sign-in`);
      }
    } else {
      router.push("/");
    }
  }, [countdown, verified, error, router, formToken, sid]);

  // ---------------- IMMEDIATE REDIRECT IF MISSING TOKEN ----------------
  useEffect(() => {
    if (!token) {
      const timer = setTimeout(() => router.push("/"), 3000);
      return () => clearTimeout(timer);
    }
  }, [token, router]);

  // ---------------- UI ----------------
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Invalid Link</h1>
          <p className="text-sm text-gray-600">
            Redirecting to home in 3 seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {verified
              ? isPasswordReset
                ? "Verification Complete!"
                : "Account Verified!"
              : "Verifying Your Account"}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {verified
              ? isPasswordReset
                ? `You're being redirected to password reset in ${countdown}s.. Click the button if you are not redirected.`
                : `You're being redirected to sign in in ${countdown}s...`
              : error
                ? "You're being redirected to home page..."
                : "Please wait while we verify your account"}
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 flex items-center">
            <span className="text-sm font-medium text-red-800">{error}</span>
          </div>
        )}

        {verified && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <svg
                className="h-12 w-12 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <button
              onClick={() => {
                if (formToken) {
                  router.push(
                    `/agent/password-reset?token=${encodeURIComponent(formToken)}&sid=${encodeURIComponent(sid!)}`
                  );
                } else {
                  router.push("/agent/sign-in");
                }
              }}
              className="inline-flex items-center px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {isPasswordReset
                ? "Continue to Password Reset"
                : "Continue to Sign In"}
            </button>
          </div>
        )}

        {!verified && !error && (
          <div className="flex justify-center">
            <div className="animate-spin h-8 w-8 border-b-2 border-green-600 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
}
