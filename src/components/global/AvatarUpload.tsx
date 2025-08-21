"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import Image from "next/image";
import toast from "react-hot-toast";
import { uploadImage } from "@/lib/utils/upload";

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
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadHeight = Math.min(200, 200 * (uploadProgress / 100));

  // Load cached avatar from IndexedDB
  useEffect(() => {
    const loadCachedAvatar = async () => {
      if (!initialAvatarUrl) {
        const cachedAvatar = await getAvatarFromDB(agentId);
        if (cachedAvatar) setAvatarUrl(cachedAvatar);
      } else {
        await saveAvatarToDB(agentId, initialAvatarUrl);
      }
    };
    loadCachedAvatar();
  }, [agentId, initialAvatarUrl]);

  const resetFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPEG, PNG, etc.)");
      resetFileInput();
      return;
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size must be less than 5MB");
      resetFileInput();
      return;
    }

    let previewUrl: string | undefined;
    let toastId: string | undefined;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      previewUrl = URL.createObjectURL(file);
      setAvatarUrl(previewUrl);

      // Simulate wave progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const next = prev + Math.random() * 10;
          if (next >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return next;
        });
      }, 300);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("agentId", agentId);

      const result = (await uploadImage(formData)) as {
        success?: boolean;
        url?: string;
        error?: string;
      };

      clearInterval(progressInterval);
      setUploadProgress(100);

      await new Promise((resolve) => setTimeout(resolve, 500)); // let animation finish

      if (result?.success && result.url) {
        toast.success("Profile picture updated successfully!", { id: toastId });
        setAvatarUrl(result.url);
        await saveAvatarToDB(agentId, result.url);
      } else {
        throw new Error(result?.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image",
        { id: toastId }
      );
      const cachedAvatar = await getAvatarFromDB(agentId);
      setAvatarUrl(cachedAvatar || undefined);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      resetFileInput();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    }
  };

  const LIGHT_MODE_COLORS = [
    { bg: "a8dadc", text: "1d3557" }, // soft cyan bg, dark text
    { bg: "f1faee", text: "1d3557" }, // pale cream bg, dark text
    { bg: "ffe5d9", text: "9d0208" }, // soft peach bg, dark red text
    { bg: "cce3de", text: "1d3557" }, // muted teal bg, dark text
    { bg: "e7e6f7", text: "264653" }, // soft lavender bg, slate text
  ];

  const DARK_MODE_COLORS = [
    { bg: "1d3557", text: "f1faee" }, // deep blue bg, light text
    { bg: "457b9d", text: "f1faee" }, // muted blue bg, light text
    { bg: "2a9d8f", text: "f1faee" }, // muted teal bg, light text
    { bg: "264653", text: "f1faee" }, // dark slate bg, light text
    { bg: "6d6875", text: "f1faee" }, // soft purple bg, light text
  ];

  // Utility to pick random color
  const getRandomColor = (colors: { bg: string; text: string }[]) => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getAvatarUrl = () => {
    if (avatarUrl) return avatarUrl;

    const isDarkMode =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const colorSet = isDarkMode ? DARK_MODE_COLORS : LIGHT_MODE_COLORS;
    const { bg, text } = getRandomColor(colorSet);

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      fullName || initials
    )}&background=${bg}&color=${text}&size=256&rounded=true`;
  };

  const finalAvatar = getAvatarUrl();

  return (
    <div className="relative group w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-100 overflow-hidden border-2 border-primary flex items-center justify-center">
      {/* Wave Animation */}
      {isUploading && (
        <svg
          viewBox="0 0 200 200"
          className="absolute w-full h-full top-0 left-0 z-10"
          preserveAspectRatio="none"
        >
          <defs>
            <clipPath id="wave-clip">
              <path
                d="M0,50 C50,30 100,50 150,30 S250,50 300,30 V200 H0 Z"
                fill="white"
                transform={`translate(0, ${200 - uploadHeight})`}
              />
            </clipPath>
          </defs>
          <rect
            width="200"
            height="200"
            fill="rgba(255,255,255,0.3)"
            clipPath="url(#wave-clip)"
            className="transition-transform duration-300 ease-out"
          />
          <path
            d="M0,40 C50,20 100,40 150,20 S250,40 300,20 V200 H0 Z"
            fill="rgba(255,255,255,0.2)"
            transform={`translate(0, ${200 - uploadHeight})`}
            className="wave-animation"
          />
          <path
            d="M0,60 C50,40 100,60 150,40 S250,60 300,40 V200 H0 Z"
            fill="rgba(255,255,255,0.15)"
            transform={`translate(0, ${200 - uploadHeight * 0.9})`}
            className="wave-animation delay-200"
          />
        </svg>
      )}

      {/* Avatar Image */}
      {finalAvatar.startsWith("http") || finalAvatar.startsWith("blob:") ? (
        <Image
          src={finalAvatar}
          alt={fullName}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 80px, 96px"
          priority={!!initialAvatarUrl}
          onError={async () => {
            console.warn("Image failed to load, falling back");
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

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={isUploading}
      />

      {/* Upload Button */}
      <button
        type="button"
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full ${isUploading ? "!opacity-100" : ""}`}
        aria-label="Upload profile picture"
        disabled={isUploading}
      >
        {!isUploading && <FiUpload className="w-5 h-5 text-white" />}
      </button>

      {/* Wave Animation Styles */}
      <style jsx global>{`
        @keyframes wave-float {
          0%,
          100% {
            transform: translateY(0) scaleY(1);
          }
          25% {
            transform: translateY(-3px) scaleY(0.98);
          }
          50% {
            transform: translateY(0) scaleY(1.02);
          }
          75% {
            transform: translateY(2px) scaleY(0.99);
          }
        }
        .wave-animation {
          animation: wave-float 4s ease-in-out infinite;
          transition: transform 0.5s ease-out;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  );
}
