// File: src/components/profile/tabs/PersonalTab.tsx
"use client";

import {
  FiUser,
  FiLock,
  FiCheckCircle,
  FiAlertTriangle,
  FiEdit2,
  FiClock,
  FiShield,
} from "react-icons/fi";
import { AgentData } from "../../types";

interface PersonalTabProps {
  profileData: AgentData;
}

export function PersonalTab({ profileData }: PersonalTabProps) {
  // Check if name is verified (either nameVerified is true or nameVerificationDate exists)
  const isNameVerified =
    profileData.nameVerified || !!profileData.nameVerificationDate;

  // Use verification status directly from profileData
  const verificationFields = {
    name: isNameVerified,
    dob: profileData.dobVerified || false,
    gender: profileData.genderVerified || false,
  };

  const lastVerifiedDate =
    profileData.nameVerificationDate ??
    profileData.dobVerifiedDate ??
    profileData.genderVerifiedDate ??
    new Date().toISOString();

  const verifiedCount =
    Object.values(verificationFields).filter(Boolean).length;
  const totalFields = Object.keys(verificationFields).length;
  const verificationPercentage = Math.round(
    (verifiedCount / totalFields) * 100
  );

  const verificationStatusObj = {
    verified: verifiedCount === totalFields,
    level:
      verifiedCount === totalFields
        ? "Full"
        : verifiedCount > 0
          ? "Partial"
          : "None",
    date: lastVerifiedDate,
    pendingFields: Object.entries(verificationFields)
      .filter(([_, verified]) => !verified)
      .map(([field]) => field),
  };

  // Check if individual name fields should show verification
  const shouldShowNameVerification = (
    fieldValue: string | null | undefined
  ) => {
    // If name is verified overall, show check for all name fields
    if (isNameVerified) return true;
    // Otherwise, only show check if the field has content
    return fieldValue !== null && fieldValue !== undefined && fieldValue !== "";
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center">
          <div className="flex-shrink-0 p-3 rounded-xl bg-white shadow-sm border border-blue-200">
            <FiUser className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Personal Information
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Your verified identification details
            </p>
          </div>
        </div>
      </div>

      {/* Verification Status Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className={`p-3 rounded-xl ${
                verificationStatusObj.verified
                  ? "bg-green-100 text-green-600"
                  : "bg-amber-100 text-amber-600"
              }`}
            >
              <FiShield className="h-6 w-6" />
            </div>
            <div className="ml-5">
              <h3 className="text-lg font-semibold text-gray-900">
                Identity Verification
              </h3>
              <p className="text-sm text-gray-600">
                {verifiedCount} of {totalFields} fields verified
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {verificationPercentage}%
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                verificationStatusObj.verified
                  ? "bg-green-100 text-green-800"
                  : verificationStatusObj.level === "Partial"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {verificationStatusObj.level} Verification
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                verificationStatusObj.verified
                  ? "bg-green-500"
                  : verificationStatusObj.level === "Partial"
                    ? "bg-amber-500"
                    : "bg-red-500"
              }`}
              style={{ width: `${verificationPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Information Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="px-6 py-5 space-y-6">
          {/* Legal Name Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Legal Name
              </h3>
              <button
                type="button"
                className="inline-flex items-center text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-not-allowed"
                title="Editing disabled"
                disabled
              >
                <FiEdit2 className="h-3.5 w-3.5 mr-1" />
                Edit
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <InfoField
                label="Surname"
                value={profileData.surname}
                verified={shouldShowNameVerification(profileData.surname)}
                required
                fullyVerified={isNameVerified}
              />
              <InfoField
                label="First Name"
                value={profileData.firstName}
                verified={shouldShowNameVerification(profileData.firstName)}
                required
                fullyVerified={isNameVerified}
              />
              <InfoField
                label="Other Names"
                value={profileData.otherName || "—"}
                verified={shouldShowNameVerification(profileData.otherName)}
                required={false}
                fullyVerified={isNameVerified}
              />
            </div>
          </div>

          <div className="border-t border-gray-200"></div>

          {/* Date of Birth / Gender Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Date of Birth & Gender
              </h3>
              <button
                type="button"
                className="inline-flex items-center text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-not-allowed"
                title="Editing disabled"
                disabled
              >
                <FiEdit2 className="h-3.5 w-3.5 mr-1" />
                Edit
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              <InfoField
                label="Date of Birth"
                value={
                  profileData.dob
                    ? new Date(profileData.dob).toLocaleDateString()
                    : "—"
                }
                verified={verificationFields.dob}
                required
                fullyVerified={verificationFields.dob}
              />
              <InfoField
                label="Gender"
                value={profileData.gender || "—"}
                verified={verificationFields.gender}
                required
                fullyVerified={verificationFields.gender}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Verification Details */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Verification Details
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Status of your personal information verification
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(verificationFields).map(([field, verified]) => (
              <div
                key={field}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-lg ${
                      verified
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <FiUser className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {field === "name" ? "Full Name" : field}
                    </p>
                    <p className="text-sm text-gray-500">
                      {verified ? "Verified" : "Pending verification"}
                    </p>
                    {field === "name" &&
                      isNameVerified &&
                      profileData.nameVerificationDate && (
                        <p className="text-xs text-green-600 mt-1">
                          Verified on{" "}
                          {new Date(
                            profileData.nameVerificationDate
                          ).toLocaleDateString()}
                        </p>
                      )}
                  </div>
                </div>
                <div className="flex items-center">
                  {verified ? (
                    <FiCheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      <FiClock className="h-3 w-3 mr-1" />
                      Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="flex items-start">
          <div className="flex-shrink-0 p-2">
            <FiLock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="ml-4">
            <h4 className="text-sm font-medium text-gray-900">
              Security Notice
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {verificationStatusObj.verified
                ? "Your personal information is fully verified and secure. All required details have been confirmed."
                : verificationStatusObj.pendingFields.length
                  ? `Pending verification for: ${verificationStatusObj.pendingFields.map((f) => (f === "name" ? "Full Name" : f.charAt(0).toUpperCase() + f.slice(1))).join(", ")}. Complete verification for full account security.`
                  : "Please complete all required verification steps to ensure your account security."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// InfoField component
function InfoField({
  label,
  value,
  verified,
  required,
  fullyVerified,
}: {
  label: string;
  value: string | null;
  verified: boolean;
  required: boolean;
  fullyVerified?: boolean;
}) {
  return (
    <div className="relative group">
      <div className="flex items-center">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {required && <span className="ml-1 text-sm text-red-500">*</span>}
      </div>
      <div className="mt-1 flex items-center justify-between">
        <p className="text-base font-semibold text-gray-900">{value}</p>
        <div className="flex items-center ml-3">
          {verified ? (
            <span
              className="inline-flex items-center text-green-600"
              title={fullyVerified ? "Fully verified" : "Field completed"}
            >
              <FiCheckCircle className="h-5 w-5" />
              {fullyVerified && (
                <span className="ml-1 text-xs text-green-600">Verified</span>
              )}
            </span>
          ) : required ? (
            <span
              className="inline-flex items-center text-amber-500"
              title="Pending verification"
            >
              <FiAlertTriangle className="h-4 w-4" />
            </span>
          ) : (
            <span
              className="inline-flex items-center text-gray-400"
              title="Optional field"
            >
              <FiCheckCircle className="h-4 w-4" />
            </span>
          )}
        </div>
      </div>
      {!verified && required && (
        <p className="mt-1 text-xs text-amber-600">Verification pending</p>
      )}
      {verified && fullyVerified && (
        <p className="mt-1 text-xs text-green-600">Fully verified</p>
      )}
    </div>
  );
}
