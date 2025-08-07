"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, appSignIn } from "@/app/actions/auth";
import { Eye, EyeOff } from "lucide-react";
import { notifySuccess, notifyError } from "@/components/store/notification";
import "./signin.css";

export default function SignInPage() {
  const [agentId, setAgentId] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") || "/profile";

  const PasswordStrength = ({ code }: { code: string }) => {
    const strength = Math.min((code.length / 10) * 100, 100);
    return (
      <div className="mt-1 h-1 w-full bg-gray-200 rounded-full">
        <div
          className={`h-full rounded-full ${
            strength > 70
              ? "bg-green-500"
              : strength > 40
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
          style={{ width: `${strength}%` }}
        />
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!agentId.trim() || !accessCode.trim()) {
      notifyError("Please enter both Agent ID and Access Code");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn(agentId, accessCode);

      if (result.success) {
        notifySuccess("Login successful! Redirecting...");
        router.push(redirectTo);
      } else {
        notifyError(
          result.message ||
            "Authentication failed. Please check your credentials."
        );
      }
    } catch (err) {
      notifyError("An error occurred during authentication. Please try again.");
      console.error("SignIn error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: string) => {
    try {
      setLoading(true);
      const result = await appSignIn(provider);

      if (result.success) {
        notifySuccess(`Signed in with ${provider} successfully!`);
        router.push(redirectTo);
      } else {
        notifyError(result.message || `Failed to sign in with ${provider}`);
      }
    } catch (error) {
      notifyError(`Error signing in with ${provider}`);
      console.error(`${provider} sign in error:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Agent Portal</h1>
          <p className="mt-2 text-gray-600">
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="agentId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Agent ID / Email
            </label>
            <div className="relative">
              <input
                id="agentId"
                name="agentId"
                type="text"
                autoComplete="username"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                placeholder="Enter your agent ID or email"
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="accessCode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Access Code
            </label>
            <div className="relative">
              <input
                id="accessCode"
                name="accessCode"
                type={showAccessCode ? "text" : "password"}
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all pr-12"
                placeholder="Enter your access code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowAccessCode(!showAccessCode)}
                disabled={loading}
              >
                {showAccessCode ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {accessCode && (
              <div className="mt-2">
                <PasswordStrength code={accessCode} />
                <p className="text-xs text-gray-500 mt-1">
                  Strength indicator (minimum 8 characters recommended)
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-green-600 hover:text-green-500"
              >
                Forgot access code?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-500">
          <p>
            Don&#39;t have an account?{" "}
            <a
              href="/agent/signup"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Create an account
            </a>
          </p>
        </div>

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSocialSignIn("google")}
            disabled={loading}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleSocialSignIn("facebook")}
            disabled={loading}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"
                fill="#1877F2"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
