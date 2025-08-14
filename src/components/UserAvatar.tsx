// File: src/components/UserAvatar.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { FiUser } from "react-icons/fi";

interface UserAvatarProps {
  fullName: string;
  size?: number;
  profilePicture?: string | null;
  background?: string;
  showBadge?: boolean;
  className?: string;
}

export default function UserAvatar({
  fullName,
  size = 96,
  profilePicture,
  background = "008751", // Jubilee Care green
  showBadge = true,
  className = "",
}: UserAvatarProps) {
  const [showFallback, setShowFallback] = useState(false);

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    fullName.trim() || "User"
  )}&background=${background}&size=${size}&color=ffffff`;

  const isValidUrl =
    typeof profilePicture === "string" && profilePicture.startsWith("http");

  return (
    <div
      className={`relative rounded-full overflow-hidden border-2 border-primary ${className}`}
      style={{ width: size, height: size }}
    >
      {isValidUrl && !showFallback ? (
        <Image
          src={profilePicture as string}
          alt={fullName}
          width={size}
          height={size}
          className="object-cover"
          onError={() => setShowFallback(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          {isValidUrl ? (
            <Image
              src={avatarUrl}
              alt={fullName}
              width={size}
              height={size}
              className="object-cover"
            />
          ) : (
            <FiUser className="text-2xl text-gray-400" />
          )}
        </div>
      )}
      {showBadge && (
        <button className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 sm:w-4 sm:h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
