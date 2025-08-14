"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function PasswordResetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const sid = searchParams.get("sid");

  const [status, setStatus] = useState<{
    phase: "verifying" | "ready" | "submitting" | "success" | "error";
    message?: string;
  }>({ phase: "verifying" });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Verify token on page load
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
        const res = await fetch("/api/agent/auth/verify-password-reset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, sid }),
        });

        const data = await parseJsonResponse(res); // Custom JSON parser

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

    if (password !== confirmPassword) {
      setStatus({
        phase: "error",
        message: "Passwords do not match",
      });
      return;
    }

    if (password.length < 8) {
      setStatus({
        phase: "error",
        message: "Password must be at least 8 characters",
      });
      return;
    }

    setStatus({ phase: "submitting" });

    try {
      const res = await fetch("/api/agent/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, sid, password }),
      });

      const data = await parseJsonResponse(res); // Custom JSON parser

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

  // Helper function to safely parse JSON responses
  const parseJsonResponse = async (response: Response) => {
    try {
      return await response.json();
    } catch {
      return null;
    }
  };

 // Render loading state
if (status.phase === "verifying") {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin h-8 w-8 border-b-2 border-green-600 rounded-full mx-auto" 
             style={{ transformOrigin: '50% 50%' }}>
        </div>
        <p className="text-gray-600">Verifying your reset link...</p>
      </div>
    </div>
  );
}

  // Render error state
  if (status.phase === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Unable to Reset Password
          </h2>
          <p className="text-gray-600">{status.message}</p>
          <button
            onClick={() => router.push("/agent/forgot-password")}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Request New Reset Link
          </button>
        </div>
      </div>
    );
  }

  // Render success state
  if (status.phase === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
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
          <h2 className="text-2xl font-bold text-gray-900">Password Updated</h2>
          <p className="text-gray-600">{status.message}</p>
        </div>
      </div>
    );
  }

  // Render ready state (password reset form)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Reset Your Password
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Create a new secure password for your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={status.phase === "submitting"}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white ${
                status.phase === "submitting"
                  ? "bg-green-500"
                  : "bg-green-600 hover:bg-green-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
            >
              {status.phase === "submitting" ? (
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
