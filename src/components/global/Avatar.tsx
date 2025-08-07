"use client";

import { useState } from "react";
import Image from "next/image";

interface AvatarProps {
  fullName?: string;
  size?: number;
  profilePicture?: string;
  background?: string;
}

export default function Avatar({
  fullName = "User",
  size = 32,
  profilePicture,
  background = "ffffff",
}: AvatarProps) {
  const [showFallback, setShowFallback] = useState(false);

  // Generate fallback avatar URL
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    fullName.trim()
  )}&background=${background}&size=${size}`;

  return (
    <div className="relative">
      {profilePicture && !showFallback ? (
        <Image
          src={profilePicture}
          alt="User Avatar"
          width={size}
          height={size}
          className="rounded-full border-gray-300 object-cover ring-2 ring-red-500 ring-offset-2 ring-offset-white"
          onError={() => setShowFallback(true)}
        />
      ) : (
        <Image
          src={avatarUrl}
          alt="User Avatar"
          width={size}
          height={size}
          className="rounded-full border-gray-300 object-cover ring-2 ring-red-500 ring-offset-2 ring-offset-white"
        />
      )}
    </div>
  );
}
