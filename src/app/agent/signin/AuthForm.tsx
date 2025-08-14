"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "./signAuth";

type AuthFormProps = {
  loading: boolean;
  nimcLoading: boolean;
  onSubmit?: (identifier: string, password: string) => void;
  onProviderSignIn: (provider: "google" | "github") => void;
  onNimcVerify: (nin: string) => void;
};

export const AuthForm = ({
  loading,
  nimcLoading,
  onSubmit,
  onProviderSignIn,
  onNimcVerify,
}: AuthFormProps) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [nimcNin, setNimcNin] = useState("");
  const [activeTab, setActiveTab] = useState<"standard" | "nimc">("standard");
    const [validationError, setValidationError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<"identifier" | "password">("identifier");

  const resetStandardForm = () => {
    setIdentifier("");
    setPassword("");
    setValidationError(null);
    setSubmitting(false);
    setStep("identifier");
  };

  const resetNimcForm = () => {
    setNimcNin("");
    setValidationError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (step === "identifier") {
        if (!identifier.trim()) {
          setValidationError("Please enter your email or phone number");
          return;
        }
        setStep("password");
        setValidationError(null);
      } else {
        handleSubmit(e as unknown as React.FormEvent);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setValidationError(null);
    setSubmitting(true);

    try {
      const result = await signIn(identifier, password);

      if (!result.success) {
        setValidationError(
          result.message || "Sign in failed. Please try again."
        );
        return;
      }

      if (onSubmit) {
        onSubmit(identifier, password);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleNimcSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    onNimcVerify(nimcNin);
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
      <div className="text-center">
        <h1 className="text-3xl mb-6 font-bold text-gray-900">Agent Portal</h1>

        {/* Tab Selector */}
        <div className="flex items-center justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => {
                setActiveTab("standard");
                resetStandardForm();
              }}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                activeTab === "standard"
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              Standard Login
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("nimc");
                resetNimcForm();
              }}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
                activeTab === "nimc"
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              NIMC Verification
            </button>
          </div>
        </div>

        {/* Social logins */}
        {activeTab === "standard" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onProviderSignIn("google")}
                disabled={submitting || loading}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Google
              </button>
              <button
                type="button"
                onClick={() => onProviderSignIn("github")}
                disabled={submitting || loading}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                GitHub
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-white text-sm text-gray-500">
                  Or sign in with credentials
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {validationError && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm font-medium text-red-800">
            {validationError}
          </div>
        </div>
      )}

      {activeTab === "standard" ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email or Phone */}
          {step === "identifier" && (
            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email or Phone Number
              </label>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none focus-visible:outline-none transition-all"
                placeholder="Enter your email or phone number"
                disabled={submitting}
              />
            </div>
          )}

          {/* Password */}
          {step === "password" && (
            <>
              <div className="flex items-center mb-2">
                <button
                  type="button"
                  onClick={() => setStep("identifier")}
                  className="text-gray-500 hover:text-gray-700 mr-2"
                  disabled={submitting}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <span className="text-sm font-medium text-gray-700">
                  {identifier}
                </span>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 pr-12 focus:outline-none focus-visible:outline-none transition-all"
                    placeholder="Enter your password"
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={submitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center"></div>
            <div className="text-sm">
              <Link
                href="/agent/forgot-password"
                className="font-medium text-green-600 hover:text-green-500"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Sign In Button */}
          <div>
            <button
              type={step === "identifier" ? "button" : "submit"}
              onClick={() => {
                if (step === "identifier") {
                  if (!identifier.trim()) {
                    setValidationError(
                      "Please enter your email or phone number"
                    );
                    return;
                  }
                  setStep("password");
                  setValidationError(null);
                }
              }}
              disabled={submitting || (step === "password" && !password)}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white ${
                submitting ? "bg-green-700" : "bg-green-600 hover:bg-green-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200`}
            >
              {submitting ? (
                <div className="flex items-center">
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
                  <span>Signing in...</span>
                </div>
              ) : step === "identifier" ? (
                "Continue"
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleNimcSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="nin"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              National Identification Number (NIN)
            </label>
            <input
              id="nin"
              type="tel"
              value={nimcNin}
              onChange={(e) => setNimcNin(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Enter your 11-digit NIN"
              maxLength={11}
              disabled={nimcLoading}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={nimcLoading || !nimcNin}
              className="w-full flex justify-center items-center py-3 px-4 rounded-lg text-lg font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {nimcLoading ? (
                <div className="flex items-center">
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
                  <span>Verifying...</span>
                </div>
              ) : (
                "Verify with NIMC"
              )}
            </button>
          </div>
        </form>
      )}

      <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
        <p>
          Don&apos;t have an account?{" "}
          <Link
            href="/agent/signup"
            className="font-medium text-green-600 hover:text-green-500"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};
