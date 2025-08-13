// File: src/app/agent/verify/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const sid = searchParams.get("sid");
  const autoVerify = searchParams.get("auto") === "true";

  const [loading, setLoading] = useState(autoVerify);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const handleVerification = useCallback(async () => {
    if (!token) {
      setError("Invalid verification link");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/agent/auth/verify-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, sid }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Verification failed. Please try again."
        );
      }

      setVerified(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during verification"
      );
    } finally {
      setLoading(false);
    }
  }, [token, sid]);

  // Auto-verify if token exists and auto=true
  useEffect(() => {
    if (autoVerify && token && !verified && !error) {
      handleVerification();
    }
  }, [autoVerify, token, error, handleVerification, verified]);

  // Countdown redirect after verification
  useEffect(() => {
    if (verified && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (verified && countdown === 0) {
      router.push("/agent/signin");
    }
  }, [verified, countdown, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {verified ? "Account Verified!" : "Verify Your Account"}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {verified
              ? `Redirecting to sign in page in ${countdown} seconds...`
              : "Click the button below to verify your email address"}
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-red-400 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium text-red-800">{error}</span>
            </div>
            {error.includes("expired") && (
              <div className="mt-2">
                <Link
                  href="/agent/resend-verification"
                  className="text-sm font-medium text-green-600 hover:text-green-500"
                >
                  Resend verification email
                </Link>
              </div>
            )}
          </div>
        )}

        {verified ? (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center">
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
            <Link
              href="/agent/signin"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Continue to Sign In
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <button
              onClick={handleVerification}
              disabled={loading || !token}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading || !token
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              } transition-colors duration-200`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Verifying...
                </>
              ) : (
                "Verify Account"
              )}
            </button>
          </div>
        )}

        {!token && !verified && (
          <div className="text-center text-sm text-gray-600">
            <p>
              Missing verification token. Please check your email for the
              correct link.
            </p>
            <Link
              href="/agent/resend-verification"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Resend verification email
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

