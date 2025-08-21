"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Loader2,
  Lock,
  Shield,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PasswordResetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawToken = searchParams.get("token");
  const token = rawToken ? decodeURIComponent(rawToken) : null;
  const sidRaw = searchParams.get("sid");
  const sid = sidRaw ? decodeURIComponent(sidRaw) : null;

  const [status, setStatus] = useState<{
    phase: "verifying" | "ready" | "submitting" | "success" | "error";
    message?: string;
  }>({ phase: "verifying" });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [triedToSubmit, setTriedToSubmit] = useState(false);

  // Enhanced password strength validation
  const passwordStrength = {
    hasMinLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
  };

  const isPasswordValid = Object.values(passwordStrength).every(Boolean);
  const passwordsMatch = password === confirmPassword;

  useEffect(() => {
    if (!token || !sid) {
      setStatus({
        phase: "error",
        message: "Invalid password reset link. Please request a new one.",
      });
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch("/api/agent/auth/verify-pr-reset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, sid }),
        });

        const data = await parseJsonResponse(res);

        if (!res.ok) {
          throw new Error(
            data?.message || "This link has expired or is invalid"
          );
        }

        setStatus({ phase: "ready" });
      } catch (err) {
        setStatus({
          phase: "error",
          message: err instanceof Error ? err.message : "Verification failed",
        });
      }
    };

    verifyToken();
  }, [token, sid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTriedToSubmit(true);

    if (!isPasswordValid) {
      setStatus({
        phase: "error",
        message: "Password doesn't meet all requirements",
      });
      return;
    }

    if (!passwordsMatch) {
      setStatus({
        phase: "error",
        message: "Passwords do not match",
      });
      return;
    }

    setStatus({ phase: "submitting" });

    try {
      const res = await fetch("/agent/password-reset/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, sid, password }),
      });

      const data = await parseJsonResponse(res);

      if (!res.ok) {
        throw new Error(data?.message || "Password reset failed");
      }

      setStatus({
        phase: "success",
        message: "Password updated successfully! Redirecting to sign in...",
      });

      setTimeout(() => router.push("/agent/signin"), 2000);
    } catch (err) {
      setStatus({
        phase: "error",
        message:
          err instanceof Error ? err.message : "An unexpected error occurred",
      });
    }
  };

  const parseJsonResponse = async (response: Response) => {
    try {
      return await response.json();
    } catch {
      return null;
    }
  };

  // Loading state
  if (status.phase === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Verifying Reset Link
            </h2>
            <p className="text-gray-600">
              Checking your password reset request...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (status.phase === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-6 text-center bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Unable to Reset Password
            </h2>
            <p className="text-gray-600">{status.message}</p>
          </div>
          <motion.button
            onClick={() => router.push("/agent/forgot-password")}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Request New Reset Link
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Success state
  if (status.phase === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-6 text-center bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Password Updated
            </h2>
            <p className="text-gray-600">{status.message}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-blue-600 mr-2" />
              <p className="text-sm text-blue-700">
                Your password has been securely updated
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Ready state (password reset form)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-200"
      >
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Lock className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Reset Your Password
          </h1>
          <p className="text-gray-600">
            Create a new secure password for your account
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 text-gray-500 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="Enter your new password"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="mt-3 space-y-2">
                <PasswordRequirement
                  met={passwordStrength.hasMinLength}
                  text="At least 8 characters"
                  showError={triedToSubmit && !passwordStrength.hasMinLength}
                />
                <PasswordRequirement
                  met={passwordStrength.hasNumber}
                  text="Contains a number"
                  showError={triedToSubmit && !passwordStrength.hasNumber}
                />
                <PasswordRequirement
                  met={passwordStrength.hasSpecialChar}
                  text="Contains a special character"
                  showError={triedToSubmit && !passwordStrength.hasSpecialChar}
                />
                <PasswordRequirement
                  met={passwordStrength.hasUppercase}
                  text="Contains an uppercase letter"
                  showError={triedToSubmit && !passwordStrength.hasUppercase}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-10 pr-10 py-3 border ${
                    triedToSubmit && !passwordsMatch
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-xl focus:ring-2 focus:ring-green-500 text-gray-500 focus:border-green-500 transition-all`}
                  placeholder="Confirm your new password"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {triedToSubmit && !passwordsMatch && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Passwords do not match
                </p>
              )}
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={
              status.phase === "submitting" ||
              !isPasswordValid ||
              !passwordsMatch
            }
            className={`w-full flex justify-center items-center py-3 px-4 rounded-xl text-lg font-medium text-white transition-all ${
              status.phase === "submitting" ||
              !isPasswordValid ||
              !passwordsMatch
                ? "bg-green-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {status.phase === "submitting" ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </motion.button>
        </form>

        {/* Security Notice */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-start">
            <Shield className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900">Security Tips</p>
              <ul className="text-xs text-blue-700 mt-1 space-y-1">
                <li>• Use a unique password you haven&#39;t used elsewhere</li>
                <li>• Consider using a password manager</li>
                <li>• Avoid using personal information in your password</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function PasswordRequirement({
  met,
  text,
  showError = false,
}: {
  met: boolean;
  text: string;
  showError?: boolean;
}) {
  return (
    <div className="flex items-center text-sm">
      {met ? (
        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
      ) : (
        <div
          className={`h-4 w-4 rounded-full border ${
            showError ? "border-red-500" : "border-gray-300"
          } mr-2`}
        />
      )}
      <span
        className={
          met ? "text-gray-600" : showError ? "text-red-500" : "text-gray-400"
        }
      >
        {text}
      </span>
    </div>
  );
}
