"use client";

import React, { useEffect, useState } from "react";
import ModalPortal from "./ModalPortal"; // adjust path as needed

interface Props {
  onClose: () => void;
}

const getRemainingTime = () => {
  const now = new Date();
  const closeTime = new Date();
  closeTime.setHours(15, 0, 0, 0); // 3:00 PM today

  const diff = closeTime.getTime() - now.getTime();
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  const expired = diff <= 0;

  return { hours, minutes, seconds, expired };
};

const AgentEnrollmentModal: React.FC<Props> = ({ onClose }) => {
  const [timeLeft, setTimeLeft] = useState(getRemainingTime());

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTime = getRemainingTime();
      setTimeLeft(updatedTime);
      if (updatedTime.expired) {
        onClose();
        clearInterval(interval);
      }
    }, 1000);

    // Prevent background scroll
    document.body.style.overflow = "hidden";

    // Handle Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (timeLeft.expired) return null;

  return (
    <ModalPortal>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
      <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white rounded-lg p-6 shadow-2xl max-w-lg w-full relative max-h-[90vh] overflow-y-auto animate-fade-in">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-xl text-gray-400 hover:text-red-500"
            aria-label="Close modal"
          >
            &times;
          </button>

          <h2 className="text-xl font-bold text-green-700 mb-2">
            Agent Enrollment In Progress
          </h2>
          <p className="text-gray-700 mb-2">
            Our agent onboarding window is currently open. You may begin your
            registration online or visit any accredited enrollment centre for
            assisted signup.
          </p>

          <div className="text-sm text-yellow-700 bg-yellow-50 p-2 rounded mb-4">
            ⏳ This enrollment link will close by <strong>3:00 PM</strong>{" "}
            today. Time left:{" "}
            <span className="font-semibold">
              {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </span>
          </div>

          <div className="mt-6 flex justify-end gap-3 flex-wrap">
            <a
              href="/contact"
              className="rounded-md border border-green-700 px-4 py-2 text-green-700 hover:bg-green-50"
            >
              Contact Support
            </a>
            <a
              href="https://bit.ly/JubileeCL"
              onClick={onClose}
              className="rounded-md bg-green-700 px-4 py-2 text-white hover:bg-green-800"
            >
              Start Enrollment
            </a>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default AgentEnrollmentModal;
