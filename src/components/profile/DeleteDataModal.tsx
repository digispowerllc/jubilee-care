"use client";

import { useState } from "react";
import { FiX, FiMail, FiAlertOctagon, FiKey} from "react-icons/fi";

export function DeleteModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"warning" | "confirm" | "verify">("warning");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // API call to delete data
      await deleteAccountData({ email, password });
      setFeedback("Data deletion initiated successfully");
      setTimeout(() => {
        onClose();
        // Redirect or log out user
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        setFeedback(error.message);
      } else {
        setFeedback("Deletion failed");
      }
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
            <FiAlertOctagon className="text-red-600 w-5 h-5" />
            <h3 className="font-semibold text-red-900">Delete All Data</h3>
          </div>
          <button onClick={onClose} className="text-red-400 hover:text-red-600">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {step === "warning" ? (
            <>
              <div className="prose prose-red text-sm mb-6">
                <p className="font-bold">This action is irreversible!</p>
                <p>Deleting your data will:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Permanently erase all your personal information</li>
                  <li>Delete your account and all associated data</li>
                  <li>Cancel any active subscriptions</li>
                  <li>Remove access to all services immediately</li>
                </ul>
                <p className="mt-3 text-red-700 font-medium">
                  This cannot be undone. We recommend downloading your data
                  first.
                </p>
              </div>

              <div className="flex gap-3 justify-between">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => (window.location.href = "/account/export")}
                    className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50"
                  >
                    Export Data
                  </button>
                  <button
                    onClick={() => setStep("confirm")}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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
                  Are you absolutely sure?
                </p>
                <p className="text-sm text-red-700">
                  This will permanently delete all your data across all our
                  systems. You will lose access to all services immediately.
                </p>
              </div>

              <div className="flex gap-3 justify-between">
                <button
                  onClick={() => setStep("warning")}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("verify")}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  I Understand
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <div className="p-3 bg-red-100 rounded-lg border border-red-200">
                  <p className="text-sm text-red-800 font-medium">
                    Final verification required
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 w-full rounded-lg border-gray-300 focus:border-red-300 focus:ring focus:ring-red-200"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Enter Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiKey className="text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 w-full rounded-lg border-gray-300 focus:border-red-300 focus:ring focus:ring-red-200"
                      placeholder="Your account password"
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

              <div className="flex gap-3 justify-between">
                <button
                  type="button"
                  onClick={() => setStep("confirm")}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
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
                      Deleting...
                    </>
                  ) : (
                    "Permanently Delete All Data"
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
