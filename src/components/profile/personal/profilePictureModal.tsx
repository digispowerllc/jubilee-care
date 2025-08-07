"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";

interface ProfilePictureModalProps {
  userId: string;
  currentPhoto: string | null;
  onClose: () => void;
}

export default function ProfilePictureModal({
  userId,
  currentPhoto,
  onClose,
}: ProfilePictureModalProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const previewImageRef = useRef<HTMLImageElement>(null);
  const router = useRouter();

  const clearImage = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl("");
    setImageFile(null);
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
    clearImage();
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const removeImage = () => clearImage();

  const cropAndUpload = async () => {
    if (!previewImageRef.current || loading) return;
    setLoading(true);

    try {
      // Ensure image has loaded
      await new Promise<void>((resolve) => {
        if (previewImageRef.current?.complete) return resolve();
        previewImageRef.current!.onload = () => resolve();
      });

      const canvas = document.createElement("canvas");
      const size = 300;
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        alert("Canvas error.");
        return;
      }

      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      const scale = Math.min(
        previewImageRef.current.naturalWidth / size,
        previewImageRef.current.naturalHeight / size
      );
      const srcSize = size * scale;
      const sx = (previewImageRef.current.naturalWidth - srcSize) / 2;
      const sy = (previewImageRef.current.naturalHeight - srcSize) / 2;

      ctx.drawImage(
        previewImageRef.current,
        sx,
        sy,
        srcSize,
        srcSize,
        0,
        0,
        size,
        size
      );

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg")
      );

      if (!blob) {
        alert("Failed to crop image.");
        return;
      }

      const formData = new FormData();
      formData.append("profilePicture", blob, "avatar.jpg");

      const res = await fetch("/api/profile/update-picture", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        localStorage.setItem("wasUpdated", "true");
        alert("Profile picture updated successfully.");
        router.refresh();
        clearImage();
        onClose();
      } else if (res.status === 400) {
        alert("Please select a valid image file.");
      } else if (res.status === 422) {
        alert("Image must be at least 300x300 pixels.");
      } else {
        alert("Upload failed.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl rounded bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Update Profile Picture
        </h2>

        <div
          className="mb-4 flex h-64 w-full items-center justify-center rounded border-2 border-dashed bg-gray-50 hover:bg-gray-100"
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
          }}
          onDragOver={(e) => e.preventDefault()}
          role="region"
          aria-label="Image upload dropzone"
        >
          {!imageUrl ? (
            <label className="cursor-pointer text-center text-gray-600">
              <p>Drag and drop or click to select an image</p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
              />
            </label>
          ) : (
            <div className="relative h-64 w-64 overflow-hidden rounded-full border border-gray-300">
              <img
                ref={previewImageRef}
                src={imageUrl}
                alt="Preview"
                className="h-full w-full object-cover"
              />

              <label
                className="absolute top-1 left-1 z-10 cursor-pointer rounded-full bg-black/70 p-1.5 shadow hover:bg-black/90"
                title="Replace Image"
              >
                <ImagePlus className="h-5 w-5 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleChange}
                />
              </label>

              <button
                type="button"
                onClick={removeImage}
                title="Remove Image"
                className="absolute top-1 right-1 z-10 rounded-full bg-black/70 p-1.5 text-white shadow hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="rounded px-4 py-2 text-sm text-gray-700 hover:underline"
            onClick={onClose}
          >
            Cancel
          </button>
          {imageUrl && (
            <button
              type="button"
              className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
              onClick={cropAndUpload}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update profile picture"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
