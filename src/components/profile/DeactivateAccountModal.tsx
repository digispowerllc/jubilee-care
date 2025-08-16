// File: src/components/profile/DeactivateAccountModal.tsx
"use client";

import { useState, useEffect } from "react";
import { FiAlertTriangle, FiX, FiLock, FiCheck } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { verifyAgentPin } from "@/lib/pin-utils";

export function DeactivateModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"confirm" | "verify" | "final">("confirm");
  const [pin, setPin] = useState("");
  const [confirmationText, setConfirmationText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);

  // Validate PIN (8-15 digits)
  const validatePin = (pin: string): boolean => {
    const pinRegex = /^\d{8,15}$/;
    return pinRegex.test(pin);
  };

  // Get agent ID from session
  useEffect(() => {
    if (isOpen) {
      fetch("/api/agent/auth/get-session", {
        credentials: "include",
        cache: "no-store",
      })
        .then((res) => res.json())
        .then((data) => setAgentId(data.agentId))
        .catch(() => toast.error("Failed to verify session"));
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate PIN format first
      if (!validatePin(pin)) {
        throw new Error("PIN must be 8-15 digits");
      }

      // Verify PIN against database
      if (!agentId) throw new Error("Session expired");
      const isValidPin = await verifyAgentPin(agentId, pin);
      if (!isValidPin) throw new Error("Invalid PIN");

      // Verify confirmation text
      if (confirmationText.toLowerCase() !== "deactivate my account") {
        throw new Error("Confirmation text does not match");
      }

      // Final deactivation API call
      const response = await fetch("/api/agent/account/deactivate", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agentId,
          pin,
          confirmation: confirmationText,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Deactivation failed");
      }

      setFeedback("Account deactivation initiated successfully");
      setTimeout(() => {
        window.location.href = "/logout"; // Force logout after deactivation
      }, 2000);
    } catch (error) {
      setFeedback(
        error instanceof Error ? error.message : "Deactivation failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="p-5 border-b border-red-100 flex justify-between items-center bg-red-50 rounded-t-xl">
          <div className="flex items-center gap-3">
            <FiAlertTriangle className="text-red-600 w-5 h-5" />
            <h3 className="font-semibold text-red-900">Deactivate Account</h3>
          </div>
          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-600"
            disabled={isLoading}
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {step === "confirm" ? (
            <>
              <div className="prose prose-red text-sm mb-6">
                <p>Deactivating your account will:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Immediately suspend all services</li>
                  <li>Remove your profile from search results</li>
                  <li>Preserve your data for 30 days</li>
                  <li>Require admin approval to reactivate</li>
                </ul>
                <p className="mt-3 font-medium">
                  This action is reversible within 30 days by contacting support.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep("verify")}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Continue
                </button>
              </div>
            </>
          ) : step === "verify" ? (
            <form onSubmit={(e) => { e.preventDefault(); setStep("final"); }}>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <FiAlertTriangle className="text-amber-600 flex-shrink-0" />
                  <p className="text-sm text-amber-800">
                    You must verify your identity to proceed with deactivation.
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="pin"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Enter Your Security PIN (8-15 digits)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400" />
                    </div>
                    <input
                      id="pin"
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={15}
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                      className="pl-10 w-full rounded-lg border-gray-300 focus:border-red-300 focus:ring focus:ring-red-200 font-mono"
                      placeholder="Enter 8-15 digit PIN"
                      required
                    />
                  </div>
                  {pin.length > 0 && !validatePin(pin) && (
                    <p className="text-sm text-red-600">
                      PIN must be 8-15 digits
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setStep("confirm")}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!validatePin(pin)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400"
                >
                  Verify Identity
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <FiAlertTriangle className="text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-800">
                    This is your final confirmation. This action cannot be undone.
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirmation"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Type <strong>deactivate my account</strong> to confirm
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCheck className="text-gray-400" />
                    </div>
                    <input
                      id="confirmation"
                      type="text"
                      value={confirmationText}
                      onChange={(e) => setConfirmationText(e.target.value)}
                      className="pl-10 w-full rounded-lg border-gray-300 focus:border-red-300 focus:ring focus:ring-red-200"
                      placeholder="deactivate my account"
                      required
                    />
                  </div>
                </div>

                {feedback && (
                  <p
                    className={`text-sm ${feedback.includes("failed") ? "text-red-600" : "text-green-600"}`}
                  >
                    {feedback}
                  </p>
                )}
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setStep("verify")}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={isLoading}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    confirmationText.toLowerCase() !== "deactivate my account"
                  }
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                    "Permanently Deactivate"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}