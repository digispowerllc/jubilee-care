"use client";

import { useState } from "react";
import { FiLogOut, FiX, FiAlertCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog } from "@headlessui/react";

interface LogoutButtonProps {
  variant?: "default" | "ghost" | "minimal";
}

export default function LogoutButton({ variant = "default" }: LogoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agent/auth/signout", { method: "POST" });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();

      if (data.success) {
        window.location.href = "/agent/signin";
      } else {
        console.error("Signout failed:", data.message);
        setLoading(false);
        setIsOpen(false);
      }
    } catch (err) {
      console.error("Logout failed", err);
      setLoading(false);
      setIsOpen(false);
    }
  };

  const getButtonClass = () => {
    switch (variant) {
      case "ghost":
        return "flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-70";
      case "minimal":
        return "flex items-center gap-1 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-70";
      default:
        return "flex items-center gap-2 px-4 py-2 bg-white text-red-500 border border-red-200 rounded-lg shadow-sm hover:bg-red-50 hover:border-red-300 transition-all disabled:opacity-70";
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        disabled={loading}
        className={getButtonClass()}
        aria-label="Logout"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? (
          <motion.div
            className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
        ) : (
          <FiLogOut className={`${variant === "minimal" ? "w-4 h-4" : "w-4 h-4"}`} />
        )}
        {variant !== "minimal" && (
          <span className="hidden sm:inline text-sm font-medium">
            {loading ? "Logging out..." : "Logout"}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <Dialog
            open={isOpen}
            onClose={() => !loading && setIsOpen(false)}
            className="relative z-50"
          >
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal container */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
              {/* Modal content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl border border-gray-200"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <FiAlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <Dialog.Title className="text-xl font-bold text-gray-900">
                      Confirm Logout
                    </Dialog.Title>
                  </div>
                  {!loading && (
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Close"
                    >
                      <FiX className="h-5 w-5 text-gray-500" />
                    </button>
                  )}
                </div>

                <Dialog.Description className="text-gray-600 mb-6">
                  Are you sure you want to log out of your account? You&#39;ll need to sign in again to access your dashboard.
                </Dialog.Description>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    disabled={loading}
                    className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 font-medium"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleLogout}
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {loading ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        />
                        Logging out...
                      </>
                    ) : (
                      <>
                        <FiLogOut className="w-4 h-4" />
                        Logout
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Security notice */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-700">
                    <strong>Security Tip:</strong> Always log out when using shared devices to protect your account.
                  </p>
                </div>
              </motion.div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}