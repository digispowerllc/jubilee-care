"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit2 } from "lucide-react";

interface EmailUpdateModalProps {
  currentEmail: string;
  onClose: () => void;
}

export default function EmailUpdateModal({
  currentEmail,
  onClose,
}: EmailUpdateModalProps) {
  const [email, setEmail] = useState(currentEmail);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/profile/update-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        localStorage.setItem("wasUpdated", "true");
        alert("Email address updated successfully.");
        router.refresh();
        onClose();
      } else if (res.status === 400) {
        alert("This email is already associated with your account.");
      } else if (res.status === 401) {
        alert("Incorrect password. Please try again.");
      } else if (res.status === 422) {
        alert("Email must be valid.");
      } else if (res.status === 409) {
        alert("Unable to update email. Try again later.");
      } else {
        alert("Failed to update email address.");
      }
    } catch (error) {
      console.error("Error updating email:", error);
      alert("Failed to update email address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold">Update Email</h2>
        <form onSubmit={save}>
          <label className="mb-2 block">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border p-2"
              placeholder="Enter new email address"
              required
            />
          </label>
          <label className="mt-4 mb-2 block">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded border p-2"
              placeholder="Current password"
              required
            />
          </label>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Email"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
