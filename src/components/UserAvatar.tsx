// File: src/components/UserAvatar.tsx
"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { FiUser, FiEdit2 } from "react-icons/fi";

interface UserAvatarProps {
  fullName: string;
  size?: number;
  profilePicture?: string | null;
  showBadge?: boolean;
  className?: string;
  onAvatarChange?: (file: File) => void;
}

export default function UserAvatar({
  fullName,
  size = 96,
  profilePicture,
  showBadge = true,
  className = "",
  onAvatarChange,
}: UserAvatarProps) {
  const [showFallback, setShowFallback] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate initials for the fallback avatar
  const getInitials = (name: string) => {
    const names = name.trim().split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const initials = getInitials(fullName || "User");
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    initials
  )}&background=ffffff&color=008751&size=${size * 2}`;

  const isValidUrl =
    typeof profilePicture === "string" && profilePicture.startsWith("http");

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAvatarChange) {
      onAvatarChange(file);
    }
  };

  return (
    <div
      className={`relative group ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="relative rounded-full overflow-hidden border-2 border-primary w-full h-full">
        {isValidUrl && !showFallback ? (
          <Image
            src={profilePicture}
            alt={fullName}
            width={size}
            height={size}
            className="object-cover w-full h-full"
            onError={() => setShowFallback(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white">
            <img
              src={avatarUrl}
              alt={fullName}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {showBadge && (
        <>
          {/* Lighter Edit Overlay */}
          <div
            className="absolute inset-0 rounded-full bg-primary bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center cursor-pointer"
            onClick={handleEditClick}
          >
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white p-2 rounded-full">
              <FiEdit2 className="text-primary w-4 h-4" />
            </div>
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Verification badge - now with better visibility */}
          <div
            className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full cursor-pointer"
            onClick={handleEditClick}
          >
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
          </div>
        </>
      )}
    </div>
  );
}
