"use client";

import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog } from "@headlessui/react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agent/auth/logout", { method: "POST" });
      if (res.ok) {
        window.location.href = "/agent/signin";
      }
    } catch (err) {
      console.error("Logout failed", err);
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        disabled={loading}
        className="fixed top-4 right-4 flex items-center gap-2 px-3 py-2 bg-white text-red-500 rounded-md shadow-md hover:bg-red-600 hover:text-white transition-colors z-50 disabled:opacity-70"
        aria-label="Logout"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {loading ? (
          <motion.div
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
        ) : (
          <motion.div
            animate={{ rotate: 0 }}
            whileHover={{ rotate: 20 }}
            transition={{ type: "spring" }}
          >
            <FiLogOut className="w-5 h-5" />
          </motion.div>
        )}
        <span className="hidden sm:inline">
          {loading ? "Logging out..." : "Logout"}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            className="relative z-50"
          >
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/30"
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
                transition={{ type: "spring", damping: 20 }}
                className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
              >
                <Dialog.Title className="text-xl font-bold text-gray-900">
                  Confirm Logout
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-gray-600">
                  Are you sure you want to log out?
                </Dialog.Description>

                <div className="mt-6 flex justify-end gap-3">
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleLogout}
                    disabled={loading}
                    className="px-4 py-2 bg-white-500 text-red-500 rounded-md hover:bg-red-500 hover:outline-red-600 hover:text-white transition-colors disabled:opacity-70"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            repeat: Infinity,
                            duration: 1,
                            ease: "linear",
                          }}
                        />
                        Logging out...
                      </div>
                    ) : (
                      "Logout"
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
