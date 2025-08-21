"use client";

import React, { useEffect, useState } from "react";

const getRemainingTime = () => {
  const now = new Date();
  const closeTime = new Date();

  closeTime.setHours(15, 0, 0, 0); // 3:00 PM today

  if (now > closeTime) {
    // If past 3PM, set it for the next day 3PM
    closeTime.setDate(closeTime.getDate() + 1);
  }

  const diff = closeTime.getTime() - now.getTime();

  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { hours, minutes, seconds };
};

const CountdownBanner: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(getRemainingTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getRemainingTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-amber-100 text-amber-900 text-sm text-center py-2 px-4">
      ⏳ Agent Enrollment ends by <strong>3:00 PM</strong> today. Time left:{" "}
      <span className="font-semibold">
        {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </span>
    </div>
  );
};

export default CountdownBanner;
