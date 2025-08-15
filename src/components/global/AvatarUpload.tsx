// File: src/components/global/AvatarUpload.tsx
"use client";

import { useState, useRef, ChangeEvent } from "react";
import { FiUpload } from "react-icons/fi";
import Image from "next/image";
import { uploadImage } from "@/lib/actions/upload";
import { notifyError, notifySuccess } from "./Notification";

interface AvatarUploadProps {
  initialAvatarUrl?: string;
  initials: string;
  fullName: string;
  agentId: string;
}

export function AvatarUpload({
  initialAvatarUrl,
  initials,
  fullName,
  agentId,
}: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image type
    if (!file.type.match("image.*")) {
      notifyError("Please select a valid image file (JPEG, PNG, etc.)");
      return;
    }

    // Validate size limit
    if (file.size > 5 * 1024 * 1024) {
      notifyError("Image size must be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);

      // Show immediate preview
      const previewUrl = URL.createObjectURL(file);
      setAvatarUrl(previewUrl);

      // Prepare form data
      const formData = new FormData();
      formData.append("file", file);
      formData.append("agentId", agentId);

      // Upload
      const result = await uploadImage(formData);

      if (result?.success && result.url) {
        notifySuccess("Profile picture updated successfully!");
        setAvatarUrl(result.url);
      } else {
        notifyError("Failed to upload image");
        setAvatarUrl(undefined);
      }
    } catch (error) {
      console.error("Upload error:", error);
      notifyError(
        error instanceof Error ? error.message : "Failed to upload image"
      );
      setAvatarUrl(undefined); // fallback to initials
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="relative group w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-100 overflow-hidden border-2 border-primary flex items-center justify-center">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={fullName}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 80px, 96px"
          priority
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-primary/10">
          <span className="text-2xl sm:text-3xl font-bold text-primary">
            {initials}
          </span>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={isUploading}
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full"
        aria-label="Upload profile picture"
        disabled={isUploading}
      >
        {isUploading ? (
          <span className="text-white text-xs font-medium">Uploading...</span>
        ) : (
          <FiUpload className="w-5 h-5 text-white" />
        )}
      </button>
    </div>
  );
}
