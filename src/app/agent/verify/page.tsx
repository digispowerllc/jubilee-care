// File: api/agent/verify-account/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const sid = searchParams.get("sid");
  const autoVerify = searchParams.get("auto") === "true";
  const isPasswordReset = searchParams.get("reset") === "true";

  const [loading, setLoading] = useState(autoVerify);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [formToken, setFormToken] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);

  const handleVerification = useCallback(async () => {
    if (!token || !sid) {
      setError("Invalid verification link");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/agent/auth/verify-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, sid }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Verification failed");

      setVerified(true);

      // Capture temporary form token for password reset
      if (data.formToken) setFormToken(data.formToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected verification error");
    } finally {
      setLoading(false);
    }
  }, [token, sid]);

  // Auto-verify if auto=true
  useEffect(() => {
    if (autoVerify && token && sid && !verified && !error) handleVerification();
  }, [autoVerify, token, sid, verified, error, handleVerification]);

  // Countdown timer for redirects
  useEffect(() => {
    if ((!verified && !error) || countdown <= 0) return;

    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [verified, error, countdown]);

  // Redirect after countdown
  useEffect(() => {
    if (countdown > 0) return;

    if (verified) {
      router.push(
        formToken
          ? `/agent/reset-password?token=${formToken}&sid=${sid}`
          : `/agent/reset-password?token=${formToken}&sid=${sid}`
      );
    } else if (error || !token) {
      router.push("/");
    }
  }, [countdown, verified, error, router, formToken, sid, token]);

  // Immediate redirect if token is missing
  useEffect(() => {
    if (!token) {
      const timer = setTimeout(() => router.push("/"), 3000);
      return () => clearTimeout(timer);
    }
  }, [token, router]);

  // ===== UI Rendering =====
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Invalid Link</h1>
          <p className="text-sm text-gray-600">Redirecting to home in 3 seconds...</p>
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
                ? `Redirecting to password reset in ${countdown}s...`
                : `Redirecting to sign in in ${countdown}s...`
              : error
              ? "Redirecting to home page..."
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <button
              onClick={() =>
                router.push(
                  formToken
                    ? `/agent/reset-password?token=${formToken}&sid=${sid}`
                    : `/agent/reset-password?token=${formToken}&sid=${sid}`
                )
              }
              className="inline-flex items-center px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {isPasswordReset ? "Continue to Password Reset" : "Continue to Sign In"}
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
