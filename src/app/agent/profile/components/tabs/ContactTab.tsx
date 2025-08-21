// File: src/app/agent/profile/components/tabs/ContactTab.tsx
"use client";

import { useState } from "react";
import {
  FiMail,
  FiPhone,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiShield,
  FiLock,
  FiAlertTriangle,
} from "react-icons/fi";
import { AgentData } from "../../types";

interface ContactTabProps {
  profileData: AgentData;
  controller?: { switchTab?: (tab: string) => void };
  switchTab?: (tab: string) => void;
  onVerifyEmail?: () => Promise<void>;
  onVerifyPhone?: () => Promise<void>;
  onRequestPhonePIN?: () => Promise<boolean>;
}

function getVerificationStatus(profileData: AgentData) {
  const emailVerified = profileData.emailVerified;
  const phoneVerified = profileData.phoneVerified;
  const lastVerifiedDate =
    typeof profileData.emailVerified === "string"
      ? profileData.emailVerified
      : typeof profileData.phoneVerified === "string"
        ? profileData.phoneVerified
        : new Date().toISOString();

  return {
    verified: emailVerified && phoneVerified,
    level:
      emailVerified && phoneVerified
        ? "Full"
        : emailVerified || phoneVerified
          ? "Partial"
          : "None",
    date: lastVerifiedDate,
    pendingFields: [
      ...(!emailVerified ? ["email"] : []),
      ...(!phoneVerified ? ["phone"] : []),
    ],
  };
}

export function ContactTab({
  profileData,
  onVerifyEmail,
  onVerifyPhone,
  onRequestPhonePIN,
}: ContactTabProps) {
  const [showPhone, setShowPhone] = useState(false);
  const [pinVerified, setPinVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState<"email" | "phone" | null>(
    null
  );

  const verificationStatus = getVerificationStatus(profileData);

  const handleVerifyEmail = async () => {
    if (!onVerifyEmail) return;
    try {
      setIsVerifying("email");
      await onVerifyEmail();
    } finally {
      setIsVerifying(null);
    }
  };

  const handleVerifyPhone = async () => {
    if (!onVerifyPhone || !onRequestPhonePIN) return;
    try {
      setIsVerifying("phone");
      const pinValid = await onRequestPhonePIN();
      if (pinValid) {
        await onVerifyPhone();
        setPinVerified(true);
        setShowPhone(true);
      }
    } finally {
      setIsVerifying(null);
    }
  };

  const handleTogglePhoneVisibility = async () => {
    if (!showPhone && !pinVerified) {
      const pinValid = onRequestPhonePIN ? await onRequestPhonePIN() : false;
      if (!pinValid) return;
      setPinVerified(true);
    }
    setShowPhone(!showPhone);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-full border border-gray-200">
              <FiMail className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-5">
              <h2 className="text-xl font-semibold text-gray-900">
                Contact Information
              </h2>
              <p className="py-1 text-sm text-gray-500">
                Manage and verify your contact details
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Email & Phone Cards */}
      <div className="grid grid-cols-1 gap-6">
        {/* Email */}
        <ContactInfoCard
          type="email"
          value={profileData.email ?? ""}
          verified={!!profileData.emailVerified}
          isVerifying={isVerifying === "email"}
          onVerify={handleVerifyEmail}
        />

        {/* Phone */}
        <ContactInfoCard
          type="phone"
          value={profileData.phone ?? ""}
          verified={!!profileData.phoneVerified}
          masked={!pinVerified || !showPhone}
          isVerifying={isVerifying === "phone"}
          onVerify={handleVerifyPhone}
          onToggleVisibility={handleTogglePhoneVisibility}
        />
      </div>

      {/* Verification Status */}
      <VerificationStatus status={verificationStatus} />

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <FiLock className="h-4 w-4 text-gray-400" />
          </div>
          <div className="ml-3">
            <p className="text-xs text-gray-500">
              {verificationStatus.verified
                ? "Your contact information is fully verified and secure."
                : verificationStatus.pendingFields?.length
                  ? `Pending verification: ${verificationStatus.pendingFields.join(
                      ", "
                    )}`
                  : "Complete all verification steps for full account security."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ContactInfoCard
interface ContactInfoCardProps {
  type: "email" | "phone";
  value: string;
  verified: boolean;
  masked?: boolean;
  isVerifying?: boolean;
  onVerify?: () => void;
  onToggleVisibility?: () => void;
}

function ContactInfoCard({
  type,
  value,
  verified,
  masked,
  isVerifying,
  onVerify,
  onToggleVisibility,
}: ContactInfoCardProps) {
  const maskData = (data: string, visibleChars = 2) => {
    if (!data) return "";
    if (data.length <= visibleChars * 2) return "•".repeat(data.length);
    return `${data.substring(0, visibleChars)}${"•".repeat(
      data.length - visibleChars * 2
    )}${data.substring(data.length - visibleChars)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
      <div className="px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {type === "email" ? (
              <FiMail className="h-5 w-5 text-gray-600" />
            ) : (
              <FiPhone className="h-5 w-5 text-gray-600" />
            )}
            <h3 className="ml-3 text-base font-medium text-gray-900">
              {type === "email" ? "Email Address" : "Phone Number"}
            </h3>
          </div>

          <div className="flex gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <FiShield className="mr-1 h-3 w-3" />
              Protected
            </span>
            {verified ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <FiCheckCircle className="mr-1 h-3 w-3" />
                Verified
              </span>
            ) : (
              <button
                onClick={onVerify}
                disabled={isVerifying}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200 disabled:opacity-50"
              >
                {isVerifying ? (
                  <span className="animate-spin mr-1">↻</span>
                ) : (
                  <FiAlertTriangle className="mr-1 h-3 w-3" />
                )}
                {isVerifying ? "Verifying..." : "Verify"}
              </button>
            )}
          </div>
        </div>

        {/* Value section */}
        {type === "phone" && onToggleVisibility && (
          <div className="mt-4 flex items-center justify-between">
            <div className="p-3 bg-gray-50 rounded-md flex-1 mr-4">
              <p className="text-gray-900">
                {masked ? maskData(value) : value}
              </p>
            </div>
            <button
              onClick={onToggleVisibility}
              disabled={isVerifying}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {masked ? (
                <>
                  <FiEye className="mr-2 h-4 w-4" />
                  Show
                </>
              ) : (
                <>
                  <FiEyeOff className="mr-2 h-4 w-4" />
                  Hide
                </>
              )}
            </button>
          </div>
        )}

        {type === "email" && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-gray-900">{value}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// VerificationStatus
function VerificationStatus({
  status,
}: {
  status: ReturnType<typeof getVerificationStatus>;
}) {
  return (
    <div className="bg-blue-50 px-6 py-4 border-t border-b border-gray-200">
      <div className="flex items-start">
        <div className="flex-shrink-0 p-3">
          {status.verified ? (
            <FiCheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <FiAlertTriangle className="h-5 w-5 text-yellow-500" />
          )}
        </div>
        <div className="ml-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900">
              Contact Verification Status
            </p>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                status.verified
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {status.level}
            </span>
          </div>
          <div className="mt-1 text-sm text-gray-500">
            {status.verified ? (
              <>
                Verified on {new Date(status.date).toLocaleDateString()}
                <p className="py-1">
                  All contact methods are verified and secure.
                </p>
              </>
            ) : (
              <>
                Last updated {new Date(status.date).toLocaleDateString()}
                <p className="py-1">
                  {status.pendingFields?.length
                    ? `Pending verification: ${status.pendingFields.join(", ")}`
                    : "No verification data available"}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
