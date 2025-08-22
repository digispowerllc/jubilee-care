// File: api/agent/verify-r-token/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheckCircle,
  FiXCircle,
  FiLoader,
  FiArrowRight,
  FiShield,
  FiLock,
} from "react-icons/fi";

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
        router.push(`/agent/signin`);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-6 bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <FiXCircle className="h-8 w-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Invalid Link
            </h1>
            <p className="text-gray-600">Redirecting to home page...</p>
          </div>
          <div className="flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="h-6 w-6 border-2 border-gray-300 border-t-blue-600 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
      >
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <FiShield className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {verified
              ? isPasswordReset
                ? "Verification Complete!"
                : "Account Verified!"
              : "Verifying Your Account"}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {verified
              ? isPasswordReset
                ? `You're being redirected to password reset in ${countdown}s...`
                : `You're being redirected to sign in in ${countdown}s...`
              : error
                ? "You're being redirected to home page..."
                : "Please wait while we verify your account"}
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-red-50 p-4 border border-red-200"
            >
              <div className="flex items-center">
                <FiXCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-sm font-medium text-red-800">
                  {error}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {verified && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-6"
          >
            <div className="flex justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
              >
                <FiCheckCircle className="h-8 w-8 text-green-600" />
              </motion.div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center">
                <FiLock className="h-5 w-5 text-blue-600 mr-2" />
                <p className="text-sm text-blue-700">
                  {isPasswordReset
                    ? "Your email has been verified. You can now reset your password."
                    : "Your account has been successfully verified and is now secure."}
                </p>
              </div>
            </div>

            <motion.button
              onClick={() => {
                if (formToken) {
                  router.push(
                    `/agent/password-reset?token=${encodeURIComponent(formToken)}&sid=${encodeURIComponent(sid!)}`
                  );
                } else {
                  router.push("/agent/signin");
                }
              }}
              className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-green-700 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isPasswordReset
                ? "Continue to Password Reset"
                : "Continue to Sign In"}
              <FiArrowRight className="ml-2 h-4 w-4" />
            </motion.button>
          </motion.div>
        )}

        {!verified && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-4"
          >
            <div className="flex justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full"
              />
            </div>
            <p className="text-sm text-gray-600">Verifying your account...</p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="flex justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="h-6 w-6 border-2 border-gray-300 border-t-blue-600 rounded-full"
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Redirecting to home page...
            </p>
          </motion.div>
        )}

        {/* Countdown Progress */}
        {(verified || error) && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-green-500 h-2 rounded-full"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: countdown, ease: "linear" }}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}
