"use client";

import { FiLogOut } from "react-icons/fi";

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/agent/auth/logout", { method: "POST" });
      if (res.ok) {
        window.location.href = "/agent/signin";
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="fixed top-4 right-4 flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition-colors z-50"
      aria-label="Logout"
    >
      <FiLogOut className="w-5 h-5" />
      <span className="hidden sm:inline">Logout</span>
    </button>
  );
}
