"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle, XCircle, Loader2 } from "lucide-react";

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
      const res = await fetch("/api/agent/auth/password-reset", {
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

      setTimeout(() => router.push("/agent/signin"), 3000);
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div
            className="animate-spin h-8 w-8 border-b-2 border-green-600 rounded-full mx-auto"
            style={{ transformOrigin: "50% 50%" }}
          />
          <p className="text-gray-600">Verifying your reset link...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (status.phase === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Unable to Reset Password
          </h2>
          <p className="text-gray-600">{status.message}</p>
          <button
            onClick={() => router.push("/agent/forgot-password")}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Request New Reset Link
          </button>
        </div>
      </div>
    );
  }

  // Success state
  if (status.phase === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Password Updated</h2>
          <p className="text-gray-600">{status.message}</p>
        </div>
      </div>
    );
  }

  // Ready state (password reset form)
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8 space-y-6 border border-gray-200">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Reset Your Password
          </h1>
          <p className="mt-2 text-gray-600">
            Create a new secure password for your account
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
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
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  )}
                </button>
              </div>

              <div className="mt-2 space-y-1">
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
                className="block text-sm font-medium text-gray-700 mb-1"
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
                  className={`block w-full px-3 py-2 border ${
                    triedToSubmit && !passwordsMatch
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  )}
                </button>
              </div>
              {triedToSubmit && !passwordsMatch && (
                <p className="mt-1 text-sm text-red-600">
                  Passwords do not match
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={
              status.phase === "submitting" ||
              !isPasswordValid ||
              !passwordsMatch
            }
            className={`w-full flex justify-center items-center py-2.5 px-4 rounded-md shadow-sm text-white font-medium ${
              status.phase === "submitting" ||
              !isPasswordValid ||
              !passwordsMatch
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
          >
            {status.phase === "submitting" ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
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
    <div className="flex items-center text-xs">
      {met ? (
        <CheckCircle className="h-4 w-4 text-green-500 mr-1.5" />
      ) : (
        <div
          className={`h-4 w-4 rounded-full border ${
            showError ? "border-red-500" : "border-gray-300"
          } mr-1.5`}
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
