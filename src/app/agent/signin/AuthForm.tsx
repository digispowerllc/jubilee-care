"use client";

import { Eye, EyeOff } from "lucide-react";
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
    onNimcVerify(nimcNin);
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
      className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg"
    >
      <div className="text-center">
        <h1 className="text-3xl mb-6 font-bold text-gray-900">Agent Portal</h1>

        {/* Tab Selector */}
        <div className="flex items-center justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <motion.button
              type="button"
              onClick={() => switchTab("standard")}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                activeTab === "standard"
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Standard Login
            </motion.button>
            <motion.button
              type="button"
              onClick={() => switchTab("nimc")}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
                activeTab === "nimc"
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              NIMC Verification
            </motion.button>
          </div>
        </div>

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
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Google
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => onProviderSignIn("github")}
                  disabled={submitting || loading}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  GitHub
                </motion.button>
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
            className="rounded-md bg-red-50 p-4"
          >
            <div className="text-sm font-medium text-red-800">
              {validationError}
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
              </motion.div>
            )}

            {/* Password */}
            {step === "password" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center mb-2">
                  <motion.button
                    type="button"
                    onClick={() => setStep("identifier")}
                    className="text-gray-500 hover:text-gray-700 mr-2"
                    disabled={submitting}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
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
                  </motion.button>
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
                    <motion.button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
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
                  submitting
                    ? "bg-green-700"
                    : "bg-green-600 hover:bg-green-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 disabled:cursor-not-allowed`}
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
            </motion.div>

            <div>
              <motion.button
                type="submit"
                disabled={nimcLoading || !nimcNin}
                className="w-full flex justify-center items-center py-3 px-4 rounded-lg text-lg font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed"
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
          Don&apos;t have an account?{" "}
          <Link
            href="/agent/signup"
            className="font-medium text-green-600 hover:text-green-500"
          >
            Create account
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};
