// File: src/components/global/AvatarUpload.tsx
"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
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

// IndexedDB setup
const DB_NAME = "AvatarsDB";
const STORE_NAME = "avatars";
const VERSION = 1;

const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "agentId" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const getAvatarFromDB = async (agentId: string) => {
  try {
    const db = await openDB();
    return new Promise<string | undefined>((resolve) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(agentId);

      request.onsuccess = () => resolve(request.result?.avatarUrl);
      request.onerror = () => resolve(undefined);
    });
  } catch {
    return undefined;
  }
};

const saveAvatarToDB = async (agentId: string, avatarUrl: string) => {
  try {
    const db = await openDB();
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      store.put({ agentId, avatarUrl });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error("Failed to save avatar to DB:", error);
  }
};

const deleteAvatarFromDB = async (agentId: string) => {
  try {
    const db = await openDB();
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      store.delete(agentId);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error("Failed to delete avatar from DB:", error);
  }
};

export function AvatarUpload({
  initialAvatarUrl,
  initials,
  fullName,
  agentId,
}: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    initialAvatarUrl
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize DB and load cached avatar
  useEffect(() => {
    const loadCachedAvatar = async () => {
      if (!initialAvatarUrl) {
        const cachedAvatar = await getAvatarFromDB(agentId);
        if (cachedAvatar) setAvatarUrl(cachedAvatar);
      } else {
        // Cache the initial avatar if it exists
        await saveAvatarToDB(agentId, initialAvatarUrl);
      }
    };

    loadCachedAvatar();
  }, [agentId, initialAvatarUrl]);

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image type
    if (!file.type.startsWith("image/")) {
      notifyError("Please select a valid image file (JPEG, PNG, etc.)");
      resetFileInput();
      return;
    }

    // Validate size limit (5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      notifyError("Image size must be less than 5MB");
      resetFileInput();
      return;
    }

    let previewUrl: string | undefined;
    try {
      setIsUploading(true);

      // Create and store preview URL
      previewUrl = URL.createObjectURL(file);
      setAvatarUrl(previewUrl);

      // Prepare form data
      const formData = new FormData();
      formData.append("file", file);
      formData.append("agentId", agentId);

      // Upload to backend
      const result = await uploadImage(formData);

      if (result?.success && result.url) {
        notifySuccess("Profile picture updated successfully!");
        setAvatarUrl(result.url);
        // Cache the successful upload in IndexedDB
        await saveAvatarToDB(agentId, result.url);
      } else {
        throw new Error(result?.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      notifyError(
        error instanceof Error ? error.message : "Failed to upload image"
      );
      // Fall back to cached avatar from IndexedDB
      const cachedAvatar = await getAvatarFromDB(agentId);
      setAvatarUrl(cachedAvatar || undefined);
    } finally {
      setIsUploading(false);
      resetFileInput();
      // Clean up object URL to avoid memory leaks
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    }
  };

  const getAvatarUrl = () => {
    if (avatarUrl) return avatarUrl;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      fullName || initials
    )}&background=random&color=fff&size=256&rounded=true`;
  };

  const finalAvatar = getAvatarUrl();

  return (
    <div className="relative group w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-100 overflow-hidden border-2 border-primary flex items-center justify-center">
      {finalAvatar.startsWith("data:") ||
      finalAvatar.startsWith("blob:") ||
      finalAvatar.startsWith("http") ? (
        <Image
          src={finalAvatar}
          alt={fullName}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 80px, 96px"
          priority={!!initialAvatarUrl}
          onError={async () => {
            console.warn("Image failed to load, falling back");
            // Remove invalid URL from IndexedDB
            await deleteAvatarFromDB(agentId);
            setAvatarUrl(undefined);
          }}
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
        type="button"
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
