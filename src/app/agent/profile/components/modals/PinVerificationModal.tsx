// File: src/components/profile/PinVerificationModal.tsx
"use client";

import { useState, useEffect } from "react";
import { FiLock, FiX, FiRotateCw } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { verifyAgentPin } from "@/lib/utils/pin-utils";

interface PinVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  actionName?: string;
}

export function PinVerificationModal({
  isOpen,
  onClose,
  onSuccess,
  actionName = "this action",
}: PinVerificationModalProps) {
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionValid, setIsSessionValid] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const checkSession = async () => {
    try {
      const res = await fetch("/api/agent/auth/check-session", {
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Session check failed");

      const { valid } = await res.json();
      if (!mounted) return;

      setIsSessionValid(valid);
      if (!valid) {
        toast.error("Session expired. Please log in again.");
        onClose();
      }
    } catch (error) {
      if (!mounted) return;
      toast.error("Failed to verify session");
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // First verify session
    await checkSession();
    if (!isSessionValid) return;

    if (pin.length < 4) return;

    setIsLoading(true);
    try {
      // Get agent ID from session
      const sessionRes = await fetch("/api/agent/auth/get-session", {
        credentials: "include",
        cache: "no-store",
      });

      if (!sessionRes.ok) throw new Error("Failed to get session");

      const { agentId } = await sessionRes.json();
      if (!agentId) throw new Error("No agent ID in session");

      // Verify PIN with the agentId from session
      const isValid = await verifyAgentPin(agentId, pin);
      if (!isValid) {
        throw new Error("Invalid PIN");
      }

      toast.success("PIN verified successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "PIN verification failed"
      );
      setPin("");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkSession();
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold text-lg">Security Verification</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-4">
              To complete {actionName}, please verify your 4-digit security PIN.
            </p>

            <label
              htmlFor="pin"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter Security PIN
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
                maxLength={4}
                value={pin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setPin(value);
                }}
                className="pl-10 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 text-center text-xl tracking-widest font-mono"
                placeholder="••••"
                required
                disabled={isLoading || !isSessionValid}
                autoComplete="off"
              />
            </div>
            {!isSessionValid && (
              <p className="mt-2 text-sm text-red-600">
                Verifying session... Please wait
              </p>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pin.length < 4 || isLoading || !isSessionValid}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <FiRotateCw className="animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify PIN"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
