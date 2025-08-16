"use client";
import { useState, useEffect } from "react";
import { FiX, FiAlertOctagon, FiKey, FiLock, FiCheck } from "react-icons/fi";
import { toast } from "react-hot-toast";

interface AuditMetadata {
  deletionScheduled?: Date;
  recoveryWindow?: string; // e.g., "30 days"
  affectedServices?: string[];
  riskScore?: number;
  twoFactorUsed?: boolean;
}

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

  // Validate PIN (8-15 digits)
  const validatePin = (pin: string): boolean => /^\d{8,15}$/.test(pin);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!validatePin(pin)) throw new Error("PIN must be 8-15 digits");
      if (confirmationText.toLowerCase() !== "delete my data") {
        throw new Error("Confirmation text does not match");
      }

      const response = await fetch("/api/agent/auth/account/delete", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-Delete-Intent": "permanent", // Special header for destructive actions
        },
        body: JSON.stringify({
          agentId, // From session
          pin, // 8-15 digit PIN
          password, // User's current password
          confirmation: confirmationText, // Must be "delete my data"
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Deletion failed. Please try again.");
      }

      // Success - force logout and redirect
      window.location.href = "/logout?message=account_deleted";
      setStep("final");
      setTimeout(() => (window.location.href = "/logout"), 2000);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Deletion failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
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
                <ul className="list-disc pl-5 space-y-1 marker:text-red-400">
                  <li>Permanently erase all personal information</li>
                  <li>Delete your account and all associated data</li>
                  <li>Cancel any active subscriptions</li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep("confirm")}
                  className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm hover:shadow-md transition-colors"
                >
                  Continue
                </button>
              </div>
            </>
          ) : step === "confirm" ? (
            <>
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium mb-2">Final Warning</p>
                <p className="text-sm text-red-700">
                  Data will be permanently erased with no recovery option.
                </p>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setStep("warning")}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("verify")}
                  className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm hover:shadow-md transition-colors"
                >
                  I Understand
                </button>
              </div>
            </>
          ) : step === "verify" ? (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <div className="p-3 bg-red-100 rounded-lg border border-red-200">
                  <p className="text-sm text-red-800 font-medium">
                    Verify identity to permanently delete all data
                  </p>
                </div>

                {/* Password Field */}
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
                      className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* PIN Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter Security PIN (8-15 digits)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      inputMode="numeric"
                      value={pin}
                      onChange={(e) =>
                        setPin(e.target.value.replace(/\D/g, ""))
                      }
                      className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 font-mono"
                      required
                    />
                  </div>
                  {pin && !validatePin(pin) && (
                    <p className="text-sm text-red-600">
                      PIN must be 8-15 digits
                    </p>
                  )}
                </div>

                {/* Confirmation Text */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type{" "}
                    <strong className="text-red-600">delete my data</strong> to
                    confirm
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCheck className="text-red-400" />
                    </div>
                    <input
                      type="text"
                      value={confirmationText}
                      onChange={(e) => setConfirmationText(e.target.value)}
                      className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="delete my data"
                      required
                    />
                  </div>
                </div>

                {feedback && (
                  <div
                    className={`p-3 rounded-lg text-sm ${feedback.includes("failed") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
                  >
                    {feedback}
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setStep("confirm")}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={
                    !validatePin(pin) ||
                    confirmationText.toLowerCase() !== "delete my data"
                  }
                  className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors"
                >
                  {isLoading ? "Processing..." : "Permanently Delete"}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <FiCheck className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Deletion Complete
              </h3>
              <p className="text-sm text-gray-500">
                All data has been scheduled for deletion.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
