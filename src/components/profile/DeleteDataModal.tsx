"use client";
import { useState, useEffect } from "react";
import {
  FiX,
  FiAlertOctagon,
  FiKey,
  FiLock,
  FiCheck,
  FiClock,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

const SECURITY_CONFIG = {
  BASE_LOCK_HOURS: 24,
  PENALTY_MULTIPLIER: 2,
  MAX_LOCK_DAYS: 30,
  MAX_ATTEMPTS: 3,
  WINDOW_HOURS: 1,
};

export function DeleteModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<
    "warning" | "confirm" | "verify" | "final-confirm" | "final"
  >("warning");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [confirmationText, setConfirmationText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agentId, setAgentId] = useState("");
  const [lockedUntil, setLockedUntil] = useState<Date | null>(null);
  const [lockoutCount, setLockoutCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);

  const isDisabled = lockedUntil && new Date() < lockedUntil;

  useEffect(() => {
    if (!isOpen) return;

    fetch("/api/agent/auth/get-session", {
      credentials: "include",
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.agentId) {
          setAgentId(data.agentId);
        } else {
          toast.error(data.error || "Session not found");
        }
      })
      .catch(() => toast.error("Failed to verify session"));
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchLockStatus();
      loadAttempts();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!lockedUntil) return;

    const timer = setInterval(() => {
      const now = new Date();
      const newRemaining = lockedUntil.getTime() - now.getTime();
      setRemainingTime(newRemaining);

      if (newRemaining <= 0) {
        clearInterval(timer);
        fetchLockStatus(); // Check if unlocked
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lockedUntil]);

  const loadAttempts = async () => {
    try {
      // Check localStorage first
      const storedAttempts = localStorage.getItem("deleteAttempts");
      if (storedAttempts) {
        setAttempts(parseInt(storedAttempts));
      }

      // Sync with server
      const res = await fetch("/api/agent/auth/account/attempts");
      if (res.ok) {
        const data = await res.json();
        setAttempts(data.attempts || 0);
        localStorage.setItem(
          "deleteAttempts",
          data.attempts?.toString() || "0"
        );
      }
    } catch (error) {
      console.error("Failed to load attempts:", error);
    }
  };

  const saveAttempts = async (newAttempts: number) => {
    try {
      // Save to localStorage
      localStorage.setItem("deleteAttempts", newAttempts.toString());

      // Sync with server
      await fetch("/api/agent/auth/account/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attempts: newAttempts }),
      });
    } catch (error) {
      console.error("Failed to save attempts:", error);
    }
  };

  const fetchLockStatus = async () => {
    try {
      const res = await fetch("/api/agent/auth/account/lock-status");
      const data = await res.json();

      if (data.lockedUntil) {
        const lockTime = new Date(data.lockedUntil);
        if (new Date() < lockTime) {
          setLockedUntil(lockTime);
          setRemainingTime(lockTime.getTime() - Date.now());
          setLockoutCount(data.lockoutCount || 0);
          setStep("verify");
        } else {
          // Lock has expired
          setLockedUntil(null);
          setLockoutCount(0);
          setAttempts(0);
          localStorage.removeItem("deleteAttempts");
        }
      } else {
        setLockedUntil(null);
      }
    } catch (error) {
      console.error("Failed to fetch lock status:", error);
    }
  };

  const validatePin = (pin: string) => /^\d{8,15}$/.test(pin);

  const formatTimeRemaining = (ms: number) => {
    if (ms <= 0) return "0s";
    const sec = Math.floor(ms / 1000);
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;
    return [
      hours ? `${hours}h` : null,
      minutes ? `${minutes}m` : null,
      seconds ? `${seconds}s` : null,
    ]
      .filter(Boolean)
      .join(" ");
  };

  const verifyCredentials = async () => {
    if (isDisabled) {
      setFeedback(
        `Account locked. Try again in ${formatTimeRemaining(remainingTime)}`
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        "/api/agent/auth/account/verify-credentials",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, pin }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // failed attempt
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        await saveAttempts(newAttempts);

        await fetch("/api/agent/auth/account/attempts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            details: data.error || "Verification failed",
          }),
        });

        const remainingAttempts = SECURITY_CONFIG.MAX_ATTEMPTS - newAttempts;

        if (remainingAttempts <= 0) {
          setFeedback("Account locked due to too many failed attempts");
          await fetchLockStatus();
        } else {
          setFeedback(
            `${data.error || "Verification failed"} (${remainingAttempts} attempts remaining)`
          );
        }
        return;
      }

      // success
      setAgentId(data.agentId);
      setStep("final-confirm");
      setAttempts(0);
      localStorage.removeItem("deleteAttempts");
      setFeedback("");
    } catch (error) {
      setFeedback(
        error instanceof Error ? error.message : "Verification failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (confirmationText.toLowerCase() !== "delete my data") {
      setFeedback("Confirmation text does not match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/agent/auth/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Deletion failed");
      }

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
              {lockedUntil
                ? "Account Locked"
                : step === "final"
                  ? "Deletion Complete"
                  : "Delete All Data"}
            </h3>
          </div>
          {step !== "final" && !lockedUntil && (
            <button
              onClick={onClose}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-5">
          {/* Locked view */}
          {isDisabled ? (
            <LockedView
              lockedUntil={lockedUntil!}
              lockoutCount={lockoutCount}
              remainingTime={remainingTime}
              formatTimeRemaining={formatTimeRemaining}
            />
          ) : step === "warning" ? (
            <WarningStep setStep={setStep} onClose={onClose} />
          ) : step === "confirm" ? (
            <ConfirmStep setStep={setStep} />
          ) : step === "verify" ? (
            <VerifyStep
              password={password}
              setPassword={setPassword}
              pin={pin}
              setPin={setPin}
              feedback={feedback}
              isLoading={isLoading}
              verifyCredentials={verifyCredentials}
              attempts={attempts}
              setStep={setStep}
              disabled={isDisabled || false}
            />
          ) : step === "final-confirm" ? (
            <FinalConfirmStep
              confirmationText={confirmationText}
              setConfirmationText={setConfirmationText}
              feedback={feedback}
              isLoading={isLoading}
              handleFinalSubmit={handleFinalSubmit}
              setStep={setStep}
              disabled={isDisabled || false}
            />
          ) : (
            <FinalStep />
          )}
        </div>
      </div>
    </div>
  );
}

/* --- Step Components --- */

type LockedViewProps = {
  lockedUntil: Date;
  lockoutCount: number;
  remainingTime: number;
  formatTimeRemaining: (ms: number) => string;
};

const LockedView = ({
  lockedUntil,
  lockoutCount,
  remainingTime,
  formatTimeRemaining,
}: LockedViewProps) => (
  <div className="text-center py-6">
    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
      <FiClock className="h-6 w-6 text-red-600" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      Account Temporarily Locked
    </h3>
    <p className="text-sm text-gray-500 mb-4">
      Too many failed attempts. Please try again in{" "}
      {formatTimeRemaining(remainingTime)}.
    </p>
    {lockoutCount > 0 && (
      <p className="text-xs text-red-500">
        Lockout #{lockoutCount} - Duration increases with each lockout
      </p>
    )}
  </div>
);

const WarningStep = ({
  setStep,
  onClose,
}: {
  setStep: (
    step: "warning" | "confirm" | "verify" | "final-confirm" | "final"
  ) => void;
  onClose: () => void;
}) => (
  <>
    <div className="prose prose-red text-sm mb-6">
      <p className="font-bold text-red-800">This action is irreversible!</p>
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
);

const ConfirmStep = ({
  setStep,
}: {
  setStep: (
    step: "warning" | "confirm" | "verify" | "final-confirm" | "final"
  ) => void;
}) => (
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
);

type VerifyStepProps = {
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  pin: string;
  setPin: React.Dispatch<React.SetStateAction<string>>;
  feedback: string;
  isLoading: boolean;
  verifyCredentials: () => void;
  attempts: number;
  setStep: (
    step: "warning" | "confirm" | "verify" | "final-confirm" | "final"
  ) => void;
  disabled: boolean;
};

const VerifyStep = ({
  password,
  setPassword,
  pin,
  setPin,
  feedback,
  isLoading,
  verifyCredentials,
  attempts,
  setStep,
  disabled,
}: VerifyStepProps) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      if (!disabled) verifyCredentials();
    }}
  >
    <div className="space-y-4 mb-6">
      <div className="p-3 bg-red-100 rounded-lg border border-red-200">
        <p className="text-sm text-red-800 font-medium">
          Verify your identity first
        </p>
        {attempts > 0 && (
          <p className="text-xs text-red-600 mt-1">
            {SECURITY_CONFIG.MAX_ATTEMPTS - attempts} attempts remaining before
            temporary lock
          </p>
        )}
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
            className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            disabled={disabled}
            required
          />
        </div>
      </div>

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
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 font-mono"
            disabled={disabled}
            required
          />
        </div>
        {pin && !/^\d{8,15}$/.test(pin) && (
          <p className="text-sm text-red-600">PIN must be 8-15 digits</p>
        )}
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-lg text-sm ${
            feedback.includes("failed")
              ? "bg-red-50 text-red-600"
              : "bg-green-50 text-green-600"
          }`}
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
        disabled={!password || !/^\d{8,15}$/.test(pin) || isLoading || disabled}
        className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors"
      >
        {isLoading ? "Verifying..." : "Verify Identity"}
      </button>
    </div>
  </form>
);

type FinalConfirmStepProps = {
  confirmationText: string;
  setConfirmationText: React.Dispatch<React.SetStateAction<string>>;
  feedback: string;
  isLoading: boolean;
  handleFinalSubmit: () => void;
  setStep: (
    step: "warning" | "confirm" | "verify" | "final-confirm" | "final"
  ) => void;
  disabled: boolean;
};

const FinalConfirmStep = ({
  confirmationText,
  setConfirmationText,
  feedback,
  isLoading,
  handleFinalSubmit,
  setStep,
  disabled,
}: FinalConfirmStepProps) => (
  <>
    <div className="space-y-4 mb-6">
      <div className="p-3 bg-red-100 rounded-lg border border-red-200">
        <p className="text-sm text-red-800 font-medium">
          Final confirmation required
        </p>
        <p className="text-xs text-red-600 mt-1">
          This is your last chance to cancel
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Type <strong className="text-red-600">delete my data</strong> to
          confirm deletion
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
            disabled={disabled}
            required
          />
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-lg text-sm ${
            feedback.includes("failed")
              ? "bg-red-50 text-red-600"
              : "bg-green-50 text-green-600"
          }`}
        >
          {feedback}
        </div>
      )}
    </div>

    <div className="flex gap-3 justify-end">
      <button
        type="button"
        onClick={() => setStep("verify")}
        className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Back
      </button>
      <button
        type="button"
        onClick={handleFinalSubmit}
        disabled={
          confirmationText.toLowerCase() !== "delete my data" ||
          isLoading ||
          disabled
        }
        className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors"
      >
        {isLoading ? "Processing..." : "Confirm Deletion"}
      </button>
    </div>
  </>
);

const FinalStep = () => (
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
);
