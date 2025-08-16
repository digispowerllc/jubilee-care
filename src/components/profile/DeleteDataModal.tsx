"use client";

import { useState, useEffect } from "react";
import {
  FiX,
  FiAlertOctagon,
  FiKey,
  FiLock,
  FiDownload,
  FiCheck,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { verifyAgentPin } from "@/lib/pin-utils";

export function DeleteModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"warning" | "confirm" | "verify" | "final">(
    "warning"
  );
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [confirmationText, setConfirmationText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agentId, setAgentId] = useState("");
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    (async () => {
      try {
        const authRes = await fetch("/api/agent/auth/check-session", {
          credentials: "include",
          cache: "no-store",
        });
        const { valid } = await authRes.json();

        if (!valid) {
          setAuthenticated(false);
          toast.error("You are not authenticated");
          return;
        }

        setAuthenticated(true);

        const sessionRes = await fetch("/api/agent/auth/get-session", {
          credentials: "include",
          cache: "no-store",
        });
        const sessionData = await sessionRes.json();

        if (!sessionData?.agentId) {
          throw new Error("Agent ID not found in session");
        }

        setAgentId(sessionData.agentId);
      } catch (err) {
        console.error("Auth/session check failed:", err);
        setAuthenticated(false);
        toast.error("Failed to verify session");
      }
    })();
  }, [isOpen]);

  const validatePin = (pin: string): boolean => {
    return /^\d{8,15}$/.test(pin);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback("");

    try {
      if (!validatePin(pin)) {
        throw new Error("PIN must be 8-15 digits");
      }

      if (!agentId) throw new Error("Session expired");

      if (confirmationText.toLowerCase() !== "delete my data") {
        throw new Error("Confirmation text does not match");
      }

      const response = await fetch("/api/account/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          pin,
          confirmation: confirmationText,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Deletion failed");
      }

      setFeedback("Data deletion initiated successfully");
      setStep("final");

      setTimeout(() => {
        window.location.href = "/logout";
      }, 2000);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Deletion failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl max-w-md w-full shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-red-100 flex justify-between items-center bg-gradient-to-r from-red-50 to-red-100 rounded-t-xl">
          <div className="flex items-center gap-3">
            <FiAlertOctagon className="text-red-600 w-5 h-5 flex-shrink-0" />
            <h3 className="font-semibold text-red-900">
              {step === "final" ? "Deletion Complete" : "Delete All Data"}
            </h3>
          </div>
          {step !== "final" && (
            <button
              onClick={onClose}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-5">
          {step === "warning" ? (
            <>
              <div className="prose prose-red text-sm mb-6">
                <p className="font-bold text-red-800">
                  This action is irreversible!
                </p>
                <p>Deleting your data will:</p>
                <ul className="list-disc pl-5 space-y-1 marker:text-red-400">
                  <li>Permanently erase all personal information</li>
                  <li>Delete your account and all associated data</li>
                  <li>Cancel any active subscriptions immediately</li>
                  <li>Remove access to all services permanently</li>
                </ul>
                <p className="mt-3 text-red-700 font-medium">
                  This cannot be undone. We strongly recommend exporting your
                  data first.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => (window.location.href = "/account/export")}
                    className="px-4 py-2.5 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 flex items-center justify-center gap-2 transition-colors"
                  >
                    <FiDownload className="w-4 h-4" />
                    Export Data
                  </button>
                  <button
                    onClick={() => setStep("confirm")}
                    className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm hover:shadow-md"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </>
          ) : step === "confirm" ? (
            <>
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium mb-3">
                  Final Warning: This cannot be undone
                </p>
                <p className="text-sm text-red-700">
                  By proceeding, you acknowledge that all your data will be
                  permanently erased from our systems with no possibility of
                  recovery.
                </p>
              </div>

              <div className="flex gap-3 justify-between">
                <button
                  onClick={() => setStep("warning")}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("verify")}
                  className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm hover:shadow-md"
                >
                  I Understand the Risks
                </button>
              </div>
            </>
          ) : step === "verify" ? (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <div className="p-3 bg-red-100 rounded-lg border border-red-200">
                  <p className="text-sm text-red-800 font-medium">
                    Verify your identity to permanently delete all data
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter Your Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiKey className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all focus:outline-none focus-visible:outline-none hover:shadow-sm"
                      placeholder="Your account password"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter Your Security PIN (8-15 digits)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={15}
                      value={pin}
                      onChange={(e) =>
                        setPin(e.target.value.replace(/\D/g, ""))
                      }
                      className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all focus:outline-none focus-visible:outline-none hover:shadow-sm font-mono"
                      placeholder="Enter your PIN"
                      required
                    />
                  </div>
                  {pin && !validatePin(pin) && (
                    <p className="text-sm text-red-600">
                      PIN must be 8-15 digits
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type <strong>delete my data</strong> to confirm
                  </label>
                  <input
                    type="text"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all focus:outline-none focus-visible:outline-none hover:shadow-sm"
                    placeholder="delete my data"
                    required
                  />
                </div>

                {feedback && (
                  <div
                    className={`p-3 rounded-lg text-sm ${
                      feedback.includes("failed")
                        ? "bg-red-50 text-red-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {feedback}
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-between">
                <button
                  type="button"
                  onClick={() => setStep("confirm")}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    !validatePin(pin) ||
                    confirmationText.toLowerCase() !== "delete my data"
                  }
                  className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 flex items-center justify-center gap-2 transition-colors shadow-sm hover:shadow-md disabled:shadow-none"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
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
                      Processing...
                    </>
                  ) : (
                    "Permanently Delete All Data"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <FiCheck className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Deletion Complete
              </h3>
              <p className="text-sm text-gray-500">
                All your data has been scheduled for deletion. You will be
                logged out shortly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}