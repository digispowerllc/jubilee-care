"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Edit2 } from "lucide-react";
import Image from "next/image";

// Import your modal components (you'll need to create these)
import ProfilePictureModal from "@/components/profile/personal/profilePictureModal";
import SetPinModal from "@/components/profile/security/setPINModal";
import ChangePinModal from "@/components/profile/security/changePinModal";
import RemovePinModal from "@/components/profile/security/removePinModal";
import EmailUpdateModal from "@/components/profile/contact/emailUpdateModal";
import PhoneUpdateModal from "@/components/profile/contact/phoneUpdateModal";
import PasswordUpdateModal from "@/components/profile/security/passwordUpdateModal";
import PersonalDetailsModal from "@/components/profile/personal/personalDetailsModal";
import AddressUpdateModal from "@/components/profile/contact/addressUpdateModal";
import Avatar from "@/components/global/Avatar";

interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePicture: string;
  bio: string;
  verified: number;
  phoneVerified: number;
  banned: number;
  createdAt: string;
  updatedAt: string;
  hasPin: number;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [hasPin, setHasPin] = useState(false);
  const [enablePin, setEnablePin] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [activeModal, setActiveModal] = useState<
    | "personal"
    | "address"
    | "email"
    | "phone"
    | "password"
    | "profilePicture"
    | "setPIN"
    | "changePIN"
    | "removePIN"
    | null
  >(null);

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();
        if (response.ok) {
          setUser(data.user);
          setHasPin(Boolean(data.user.hasPin));
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();

    // Check for updates
    if (localStorage.getItem("wasUpdated") === "true") {
      refreshUser();
      localStorage.removeItem("wasUpdated");
    }
  }, []);

  const refreshUser = () => {
    setTimeout(() => {
      if (localStorage.getItem("wasUpdated") === "true") {
        router.refresh();
        localStorage.removeItem("wasUpdated");
      }
    }, 200);
  };

  const handlePinToggle = () => {
    if (!hasPin && enablePin) {
      setActiveModal("setPIN");
      setEnablePin(false);
    }
  };

  const isValidUrl = (url: string | null | undefined) =>
    typeof url === "string" && url.startsWith("https");

  if (!user) {
    return <div>Loading...</div>;
  }

  const bio = user.bio || "No bio provided.";
  const shouldTruncate = bio.length > 50;

  function closeModal(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-12 p-8">
      {/* profile Overview */}
      <div className="flex items-center gap-6">
        <div className="relative">
          {isValidUrl(user.profilePicture) && !showFallback ? (
            <Image
              src={user.profilePicture}
              alt={user.fullName}
              width={96}
              height={96}
              className="h-24 w-24 rounded-full border object-cover"
              onError={() => setShowFallback(true)}
            />
          ) : (
            <Avatar fullName={user.fullName} size={96} />
          )}

          {/* Edit Button */}
          <button
            type="button"
            className="absolute right-0 bottom-0 rounded-full bg-white p-1 shadow transition hover:bg-gray-100"
            title="Edit Picture"
            aria-label="Edit profile picture"
            onClick={() => setActiveModal("profilePicture")}
          >
            <Edit2 className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        <div>
          <h2 className="flex flex-wrap items-center gap-2 text-3xl font-bold">
            {user.fullName}
            {user.verified ? (
              <span className="inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                Email Verified
              </span>
            ) : (
              <span className="inline-flex items-center rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                Email Unverified
              </span>
            )}

            {user.phoneVerified ? (
              <span className="inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                Phone Verified
              </span>
            ) : (
              <span className="inline-flex items-center rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                Phone Unverified
              </span>
            )}
          </h2>
          <p className="mt-1 text-sm text-gray-500">@{user.username}</p>
          <p className="mt-1 text-sm text-gray-400">
            • Member since{" "}
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            | Last updated{" "}
            {new Date(user.updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <div className="mt-2 w-full max-w-xs text-[10px] text-gray-500">
            <span className={!showFull && shouldTruncate ? "line-clamp-1" : ""}>
              {showFull || !shouldTruncate ? bio : bio.slice(0, 50) + "..."}
            </span>
            {shouldTruncate && (
              <button
                className="ml-1 inline-block text-blue-500 hover:underline"
                onClick={() => setShowFull(!showFull)}
                type="button"
              >
                {showFull ? "Show less" : "Show more"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Personal Details */}
      <section>
        <div className="flex items-center justify-between">
          <h3 className="mb-4 text-xl font-semibold">Personal Details</h3>
          <button
            type="button"
            className="rounded-full p-2 hover:bg-gray-100"
            onClick={() => setActiveModal("personal")}
          >
            <Edit2 className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              className="mb-1 block font-medium"
              htmlFor="profile-fullname"
            >
              Full Name
            </label>
            <p className="flex items-center rounded border border-gray-200 p-3 text-gray-700">
              {user.fullName}
            </p>
          </div>
          <div>
            <label
              className="mb-1 block font-medium"
              htmlFor="profile-username"
            >
              Username
            </label>
            <p className="flex items-center rounded border border-gray-200 p-3 text-gray-700">
              {user.username}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Details */}
      <section>
        <h3 className="mb-4 text-xl font-semibold">Contact Details</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Email */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="block font-medium" htmlFor="profile-email">
                Email
              </label>
              <button
                type="button"
                title="Edit Email"
                onClick={() => setActiveModal("email")}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <Edit2 className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <div
              className={`flex items-center rounded border p-3 ${
                user.verified
                  ? "border-gray-200 text-gray-700"
                  : "border-yellow-500 bg-yellow-50 text-yellow-800"
              }`}
            >
              <span className="truncate">{user.email}</span>
            </div>
            {!user.verified && (
              <a
                href="/verify/email"
                className="text-sm text-blue-600 hover:underline"
              >
                Verify your email address
              </a>
            )}
          </div>

          {/* Phone */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="block font-medium" htmlFor="profile-phone">
                Phone Number
              </label>
              <button
                type="button"
                title="Edit Phone"
                onClick={() => setActiveModal("phone")}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <Edit2 className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <div
              className={`flex items-center rounded border p-3 ${
                user.phoneVerified
                  ? "border-gray-200 text-gray-700"
                  : "border-yellow-500 bg-yellow-50 text-yellow-800"
              }`}
            >
              <span className="truncate">{user.phoneNumber}</span>
            </div>
            {!user.phoneVerified && (
              <a
                href="/verify/phone"
                className="text-sm text-blue-600 hover:underline"
              >
                Verify your phone number
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Address Section */}
      <section>
        <h3 className="mb-4 text-xl font-semibold">Address</h3>

        {/* Summary Display */}
        {activeModal !== "address" && (
          <div className="relative">
            <div className="mb-1 flex items-center justify-between">
              <label className="block font-medium" htmlFor="profile-address">
                Address
              </label>
              <button
                type="button"
                title="Edit Address"
                onClick={() => setActiveModal("address")}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <Edit2 className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            <div className="rounded border border-gray-200 p-3 text-gray-700">
              {user.address || user.city || user.state || user.country ? (
                <p className="break-words whitespace-pre-wrap">
                  {[user.address, user.city, user.state, user.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              ) : (
                <p className="text-gray-400">No address provided</p>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Security Settings */}
      <section>
        <div className="flex items-center justify-between">
          <h3 className="mb-4 text-xl font-semibold">Security Settings</h3>
          <button
            type="button"
            className="rounded-full p-2 hover:bg-gray-100"
            onClick={() => setActiveModal("password")}
          >
            <Edit2 className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              className="mb-1 block font-medium"
              htmlFor="profile-new-password"
            >
              New Password
            </label>
            <input
              id="profile-new-password"
              type="password"
              className="w-full rounded border border-gray-200 p-3 text-gray-700"
              value="••••••••"
              readOnly
              tabIndex={-1}
              aria-readonly="true"
            />
          </div>
          <div>
            <label
              className="mb-1 block font-medium"
              htmlFor="profile-confirm-password"
            >
              Confirm Password
            </label>
            <input
              id="profile-confirm-password"
              type="password"
              className="w-full rounded border border-gray-200 p-3 text-gray-700"
              value="••••••••"
              readOnly
              tabIndex={-1}
              aria-readonly="true"
            />
          </div>
        </div>

        {/* PIN Toggle */}
        {hasPin ? (
          <div className="mt-6 flex flex-col gap-2 rounded border border-gray-200 p-4">
            <p className="font-medium">PIN is enabled</p>
            <div className="flex gap-3">
              <button
                type="button"
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                onClick={() => setActiveModal("changePIN")}
              >
                Change PIN
              </button>
              <button
                type="button"
                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                onClick={() => setActiveModal("removePIN")}
              >
                Remove PIN
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-6 flex items-center justify-between rounded border border-gray-200 p-3">
              <div>
                <label
                  className="block font-medium"
                  htmlFor="enable-pin-checkbox"
                >
                  Enable PIN
                </label>
                <p className="text-sm text-gray-500">
                  Add an extra layer of security using a PIN.
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  id="enable-pin-checkbox"
                  type="checkbox"
                  className="peer sr-only"
                  checked={enablePin}
                  onChange={handlePinToggle}
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500"></div>
              </label>
            </div>
            {enablePin && (
              <p className="mt-2 text-sm text-gray-500">
                You will be prompted to set a PIN after enabling this option.
              </p>
            )}
          </>
        )}
      </section>

      {/* Account Controls */}
      <div className="mt-2">
        <hr className="mb-5 border-t border-gray-200" />
        <h2 className="mb-4 text-xl font-semibold text-red-700">
          Account Controls
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            className="w-full rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            onClick={() => {
              if (confirm("Are you sure?")) {
                // Handle account deletion
                alert("Account deleted successfully");
              }
            }}
          >
            Delete Account
          </button>
          <button
            type="button"
            className="w-full rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
            onClick={() => alert("Account suspended successfully")}
          >
            Suspend Account
          </button>
        </div>
      </div>

      {/* Render modals based on activeModal state */}
      {activeModal === "email" && (
        <EmailUpdateModal currentEmail={user.email} onClose={closeModal} />
      )}

      {activeModal === "phone" && (
        <PhoneUpdateModal
          currentPhone={user.phoneNumber}
          onClose={closeModal}
        />
      )}

      {activeModal === "profilePicture" && (
        <ProfilePictureModal
          userId={user.id}
          currentPhoto={user.profilePicture}
          onClose={closeModal}
        />
      )}

      {activeModal === "personal" && (
        <PersonalDetailsModal
          currentName={user.fullName}
          currentUsername={user.username}
          currentBio={user.bio}
          onClose={closeModal}
        />
      )}

      {activeModal === "address" && (
        <AddressUpdateModal
          address={user.address}
          country={user.country}
          state={user.state}
          city={user.city}
          onClose={closeModal}
        />
      )}

      {activeModal === "password" && (
        <PasswordUpdateModal onClose={closeModal} />
      )}

      {activeModal === "setPIN" && <SetPinModal onClose={closeModal} />}

      {activeModal === "changePIN" && (
        <ChangePinModal userId={user.id} onClose={closeModal} />
      )}

      {activeModal === "removePIN" && <RemovePinModal onClose={closeModal} />}
    </div>
  );
}
