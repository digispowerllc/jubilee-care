// File: src/app/agent/signin/AuthForm.tsx

"use client";

import { Eye, EyeOff, ArrowLeft, Shield, User, Lock, Smartphone } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "./signAuth";
import { motion, AnimatePresence } from "framer-motion";

type AuthFormProps = {
  loading: boolean;
  nimcLoading: boolean;
  onSubmit?: (identifier: string, password: string) => void;
  onProviderSignIn: (provider: "google" | "github") => void;
  onNimcVerify: (nin: string) => void;
};

const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
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
    // onNimcVerify(nimcNin);
    setValidationError("Service is undergoing development");
  };

  const switchTab = (tab: "standard" | "nimc") => {
    setActiveTab(tab);
    if (tab === "standard") {
      resetStandardForm();
    } else {
      resetNimcForm();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl border border-gray-100"
    >
      <div className="text-center">
        <div className="mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-4"
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agent Portal</h1>
          <p className="text-gray-600">Sign in to access your dashboard</p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center justify-center mb-8">
          <div className="inline-flex rounded-xl shadow-sm bg-gray-100 p-1" role="group">
            <motion.button
              type="button"
              onClick={() => switchTab("standard")}
              className={`px-6 py-3 text-sm font-medium rounded-xl transition-all ${
                activeTab === "standard"
                  ? "bg-white text-green-600 shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Standard Login
            </motion.button>
            <motion.button
              type="button"
              onClick={() => switchTab("nimc")}
              className={`px-6 py-3 text-sm font-medium rounded-xl transition-all ${
                activeTab === "nimc"
                  ? "bg-white text-green-600 shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              NIMC Verification
            </motion.button>
          </div>
        </div>

        {/* 3RD PARTY LOGIN */}
        <AnimatePresence mode="wait">
          {activeTab === "standard" && (
            <motion.div
              key="standard-social"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={tabVariants}
              transition={{ duration: 0.2 }}
            >
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  type="button"
                  onClick={() => onProviderSignIn("google")}
                  disabled={submitting || loading}
                  className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  whileHover={{ scale: submitting || loading ? 1 : 1.02 }}
                  whileTap={{ scale: submitting || loading ? 1 : 0.98 }}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => onProviderSignIn("github")}
                  disabled={submitting || loading}
                  className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  whileHover={{ scale: submitting || loading ? 1 : 1.02 }}
                  whileTap={{ scale: submitting || loading ? 1 : 0.98 }}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#333"
                      d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
                    />
                  </svg>
                  GitHub
                </motion.button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-white text-sm text-gray-500">
                    Or continue with credentials
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {validationError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl bg-red-50 p-4 border border-red-200"
          >
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-red-600 mr-2" />
              <div className="text-sm font-medium text-red-800">
                {validationError}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {activeTab === "standard" ? (
          <motion.form
            key="standard-form"
            onSubmit={handleSubmit}
            className="space-y-4"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            {/* Email or Phone */}
            {step === "identifier" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <label
                  htmlFor="identifier"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email or Phone Number
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 text-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all"
                    placeholder="Enter your email or phone number"
                    disabled={submitting}
                  />
                </div>
              </motion.div>
            )}

            {/* Password */}
            {step === "password" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center mb-3">
                  <motion.button
                    type="button"
                    onClick={() => setStep("identifier")}
                    className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                    disabled={submitting}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    <span className="text-sm">Back</span>
                  </motion.button>
                  <span className="ml-2 text-sm font-medium text-gray-700 truncate">
                    {identifier}
                  </span>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 text-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="Enter your password"
                      disabled={submitting}
                    />
                    <motion.button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={submitting}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Sign In Button */}
            <div>
              <motion.button
                type={step === "identifier" ? "button" : "submit"}
                onClick={() => {
                  if (step === "identifier") {
                    if (!identifier.trim()) {
                      setValidationError("Please enter your email or phone number");
                      return;
                    }
                    setStep("password");
                    setValidationError(null);
                  }
                }}
                disabled={submitting || (step === "password" && !password)}
                className={`w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-sm text-lg font-medium text-white transition-all ${
                  submitting
                    ? "bg-green-700 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {submitting ? (
                  <div className="flex items-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                      className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-3"
                    />
                    <span>Signing in...</span>
                  </div>
                ) : step === "identifier" ? (
                  "Continue"
                ) : (
                  "Sign In"
                )}
              </motion.button>
            </div>

            {/* Forgot Password */}
            <div className="text-center">
              <Link
                href="/agent/forgot-password"
                className="text-sm font-medium text-green-600 hover:text-green-500 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </motion.form>
        ) : (
          <motion.form
            key="nimc-form"
            onSubmit={handleNimcSubmit}
            className="space-y-4"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <label
                htmlFor="nin"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                National Identification Number (NIN)
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="nin"
                  type="tel"
                  value={nimcNin}
                  onChange={(e) => setNimcNin(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="Enter your 11-digit NIN"
                  maxLength={11}
                  disabled={nimcLoading}
                />
              </div>
            </motion.div>

            <div>
              <motion.button
                type="submit"
                disabled={nimcLoading || nimcNin.length !== 11}
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-lg font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {nimcLoading ? (
                  <div className="flex items-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                      className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-3"
                    />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  "Verify with NIMC"
                )}
              </motion.button>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900">NIMC Verification</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Secure government-issued identity verification for enhanced account security.
                  </p>
                </div>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <motion.div
        className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p>
          Don&#39;t have an account?{" "}
          <Link
            href="/agent/signup"
            className="font-medium text-green-600 hover:text-green-500 transition-colors"
          >
            Create account
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};