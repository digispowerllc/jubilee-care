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
  FiClock,
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

  const emailVerifiedDate = profileData.emailVerifiedDate;
  const phoneVerifiedDate = profileData.phoneVerifiedDate;

  const verificationDates = [
    emailVerifiedDate ? new Date(emailVerifiedDate) : null,
    phoneVerifiedDate ? new Date(phoneVerifiedDate) : null,
  ].filter(Boolean) as Date[];

  const lastVerifiedDate = verificationDates.length
    ? new Date(
        Math.max(...verificationDates.map((d) => d.getTime()))
      ).toISOString()
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
    emailVerifiedDate,
    phoneVerifiedDate,
  };
}

export function ContactTab({
  profileData,
  onVerifyEmail,
  onVerifyPhone,
  onRequestPhonePIN,
}: ContactTabProps) {
  const [showPhone, setShowPhone] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
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

  const handleTogglePhoneVisibility = () => {
    setShowPhone(!showPhone);
  };

  const handleToggleEmailVisibility = () => {
    setShowEmail(!showEmail);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center">
          <div className="flex-shrink-0 p-3 rounded-xl bg-white shadow-sm border border-blue-200">
            <FiMail className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Contact Verification
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Secure and verify your contact information for account protection
            </p>
          </div>
        </div>
      </div>

      {/* Email & Phone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email */}
        <ContactInfoCard
          type="email"
          value={profileData.email ?? ""}
          verified={!!profileData.emailVerified}
          verificationDate={verificationStatus.emailVerifiedDate}
          masked={!showEmail}
          isVerifying={isVerifying === "email"}
          onVerify={handleVerifyEmail}
          onToggleVisibility={handleToggleEmailVisibility}
        />

        {/* Phone */}
        <ContactInfoCard
          type="phone"
          value={profileData.phone ?? ""}
          verified={!!profileData.phoneVerified}
          verificationDate={verificationStatus.phoneVerifiedDate}
          masked={!showPhone}
          isVerifying={isVerifying === "phone"}
          onVerify={handleVerifyPhone}
          onToggleVisibility={handleTogglePhoneVisibility}
        />
      </div>

      {/* Verification Status */}
      <VerificationStatus status={verificationStatus} />

      {/* Security Tips */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
        <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
          <FiLock className="h-4 w-4 mr-2" />
          Security Tips
        </h3>
        <ul className="text-sm text-blue-700 space-y-2">
          <li>• Keep your contact information up to date</li>
          <li>• Verify both email and phone for maximum security</li>
          <li>• Use strong, unique passwords for your accounts</li>
        </ul>
      </div>
    </div>
  );
}

// ContactInfoCard
interface ContactInfoCardProps {
  type: "email" | "phone";
  value: string;
  verified: boolean;
  verificationDate?: Date | string | null;
  masked?: boolean;
  isVerifying?: boolean;
  onVerify?: () => void;
  onToggleVisibility?: () => void;
}

function ContactInfoCard({
  type,
  value,
  verified,
  verificationDate,
  masked,
  isVerifying,
  onVerify,
  onToggleVisibility,
}: ContactInfoCardProps) {
  const maskData = (data: string, dataType: "email" | "phone") => {
    if (!data) return "";

    if (dataType === "email") {
      const [username, domain] = data.split("@");
      if (!username || !domain) return "•".repeat(data.length);

      // Mask username (show first 2 characters)
      const visibleUsernameChars = Math.min(2, username.length);
      const maskedUsername = `${username.substring(0, visibleUsernameChars)}${"•".repeat(
        Math.max(0, username.length - visibleUsernameChars)
      )}`;

      // Mask domain (show first part and TLD, mask middle)
      const domainParts = domain.split(".");
      if (domainParts.length < 2)
        return `${maskedUsername}@${"•".repeat(domain.length)}`;

      const tld = domainParts.pop(); // Get TLD (com, org, etc.)
      const mainDomain = domainParts.join(".");

      const visibleDomainChars = Math.min(2, mainDomain.length);
      const maskedDomain = `${mainDomain.substring(0, visibleDomainChars)}${"•".repeat(
        Math.max(0, mainDomain.length - visibleDomainChars)
      )}.${tld}`;

      return `${maskedUsername}@${maskedDomain}`;
    } else {
      // Phone masking - show last 4 digits only
      if (data.length <= 4) return "•".repeat(data.length);
      return `${"•".repeat(data.length - 4)}${data.substring(data.length - 4)}`;
    }
  };

  const getIcon = () => {
    return type === "email" ? (
      <FiMail className="h-5 w-5 text-blue-600" />
    ) : (
      <FiPhone className="h-5 w-5 text-blue-600" />
    );
  };

  const getTitle = () => {
    return type === "email" ? "Email Address" : "Phone Number";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-50">{getIcon()}</div>
            <h3 className="ml-3 text-base font-semibold text-gray-900">
              {getTitle()}
            </h3>
          </div>

          <div className="flex gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <FiShield className="mr-1 h-3 w-3" />
              Protected
            </span>
            {verified ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <FiCheckCircle className="mr-1 h-3 w-3" />
                Verified
              </span>
            ) : (
              <button
                onClick={onVerify}
                disabled={isVerifying}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 hover:bg-amber-200 disabled:opacity-50 transition-colors"
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
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
          <div className="flex-1">
            <p className="text-gray-900 font-medium text-sm">
              {masked ? maskData(value, type) : value}
            </p>
            {verified && verificationDate && (
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <FiCheckCircle className="h-3 w-3 mr-1" />
                Verified {new Date(verificationDate).toLocaleDateString()}
              </p>
            )}
            {!verified && (
              <p className="text-xs text-amber-600 mt-1 flex items-center">
                <FiClock className="h-3 w-3 mr-1" />
                Pending verification
              </p>
            )}
          </div>

          {onToggleVisibility && (
            <button
              onClick={onToggleVisibility}
              disabled={isVerifying}
              className="ml-3 inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              title={masked ? "Reveal" : "Hide"}
            >
              {masked ? (
                <FiEye className="h-4 w-4" />
              ) : (
                <FiEyeOff className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
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
  const getStatusIcon = () => {
    switch (status.level) {
      case "Full":
        return <FiCheckCircle className="h-6 w-6 text-green-500" />;
      case "Partial":
        return <FiAlertTriangle className="h-6 w-6 text-amber-500" />;
      default:
        return <FiAlertTriangle className="h-6 w-6 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status.level) {
      case "Full":
        return "bg-green-50 border-green-200";
      case "Partial":
        return "bg-amber-50 border-amber-200";
      default:
        return "bg-red-50 border-red-200";
    }
  };

  return (
    <div className={`rounded-xl p-6 border ${getStatusColor()}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 p-2">{getStatusIcon()}</div>
        <div className="ml-4">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Verification Status
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                status.level === "Full"
                  ? "bg-green-100 text-green-800"
                  : status.level === "Partial"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {status.level} Verification
            </span>
          </div>

          <div className="mt-2 text-sm text-gray-600">
            {status.verified ? (
              <div>
                <p>
                  All contact methods verified on{" "}
                  {new Date(status.date).toLocaleDateString()}
                </p>
                <div className="mt-2 flex items-center text-green-600">
                  <FiCheckCircle className="h-4 w-4 mr-1" />
                  Your account is fully secured
                </div>
              </div>
            ) : (
              <div>
                <p>Last updated {new Date(status.date).toLocaleDateString()}</p>
                {status.pendingFields?.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">Pending verification:</p>
                    <ul className="mt-1 space-y-1">
                      {status.pendingFields.map((field) => (
                        <li
                          key={field}
                          className="flex items-center text-amber-600"
                        >
                          <FiAlertTriangle className="h-3 w-3 mr-2" />
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
