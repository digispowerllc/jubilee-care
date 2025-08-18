// File: src/components/profile/tabs/PersonalTab.tsx
"use client";

import { TabController } from "./TabController";
import {
  FiUser,
  FiEdit2,
  FiLock,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import { AgentProfileData } from "../../types";

interface PersonalTabProps {
  profileData: AgentProfileData;
  controller: TabController;
}

export function PersonalTab({ profileData, controller }: PersonalTabProps) {
  // Required fields for full verification
  const requiredFields = [
    profileData.surname,
    profileData.firstName,
    profileData.dob,
    profileData.gender,
  ];

  // Check if all required fields are filled
  const allRequiredFieldsVerified = requiredFields.every(
    (field) => field !== null && field !== undefined && field !== ""
  );

  const verificationStatus = {
    verified: allRequiredFieldsVerified,
    level: allRequiredFieldsVerified ? "Full" : "Partial",
    date: "2023-11-15",
  };

  // Helper function to determine if a field should show verification
  const shouldShowVerification = (value: string | null | undefined) => {
    return value !== null && value !== undefined && value !== "";
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-xl bg-primary-50 text-primary-600">
              <FiUser className="h-6 w-6" />
            </div>
            <div className="ml-5">
              <h2 className="text-xl font-semibold text-gray-900">
                Personal Information
              </h2>
              <p className="py-1 text-sm text-gray-500">
                Your verified identification details
              </p>
            </div>
          </div>

          <button
            onClick={() => controller.setState({ isEditingPersonal: true })}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FiEdit2 className="mr-2 h-4 w-4" />
            Edit
          </button>
        </div>
      </div>

      {/* Main Information Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        {/* Name Section */}
        <div className="px-6 py-5 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Legal Name
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <InfoField
                label="Surname"
                value={profileData.surname}
                showCheck={shouldShowVerification(profileData.surname)}
                required={true}
              />
              <InfoField
                label="First Name"
                value={profileData.firstName}
                showCheck={shouldShowVerification(profileData.firstName)}
                required={true}
              />
              <InfoField
                label="Other Names"
                value={profileData.otherName}
                showCheck={shouldShowVerification(profileData.otherName)}
                required={false}
              />
            </div>
          </div>

          <div className="border-t border-gray-200"></div>

          {/* Personal Details Section */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <InfoField
              label="Date of Birth"
              value={
                profileData.dob
                  ? new Date(profileData.dob).toLocaleDateString()
                  : "—"
              }
              showCheck={shouldShowVerification(
                profileData.dob ? profileData.dob.toString() : null
              )}
              required={true}
            />
            <InfoField
              label="Gender"
              value={profileData.gender || "—"}
              showCheck={shouldShowVerification(profileData.gender)}
              required={true}
            />
          </div>
        </div>
      </div>
      {/* Verification Status Section */}
      <div className="bg-blue-50 px-6 py-4 border-t border-gray-200 rounded-t-xl">
        <div className="flex items-start">
          <div className="flex-shrink-0 p-3">
            {verificationStatus.verified ? (
              <FiCheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <FiAlertTriangle className="h-5 w-5 text-yellow-500" />
            )}
          </div>
          <div className="ml-5">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-gray-900">
                Identity Verification Status
              </p>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  verificationStatus.verified
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {verificationStatus.level} Verification
              </span>
            </div>
            <div className="mt-1 text-sm text-gray-500">
              <p>
                {verificationStatus.verified ? (
                  <>
                    Verified on{" "}
                    {new Date(verificationStatus.date).toLocaleDateString()}
                    <p className="mt-1">
                      All required information has been successfully verified.
                    </p>
                  </>
                ) : (
                  <>
                    Last updated{" "}
                    {new Date(verificationStatus.date).toLocaleDateString()}
                    <p className="mt-1">
                      Some required information is missing or incomplete.
                    </p>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-xl">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <FiLock className="h-4 w-4 text-gray-400" />
          </div>
          <div className="ml-3">
            <p className="text-xs text-gray-500">
              {verificationStatus.verified
                ? "Your account has full verification status. All required information is complete."
                : "Please complete all required document upload and verification steps to achieve full verification status."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced InfoField component
function InfoField({
  label,
  value,
  showCheck,
  required,
}: {
  label: string;
  value: string | null;
  showCheck: boolean;
  required: boolean;
}) {
  return (
    <div className="relative">
      <div className="flex items-center">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        {required && <span className="ml-1 text-xs text-red-500">*</span>}
      </div>
      <div className="py-1 flex items-center">
        <p className="text-base font-medium text-gray-900">{value || "—"}</p>
        {showCheck ? (
          <span className="ml-2 inline-flex items-center text-green-500">
            <FiCheckCircle className="h-4 w-4" />
          </span>
        ) : (
          required && (
            <span className="ml-2 inline-flex items-center text-yellow-500">
              <FiAlertTriangle className="h-4 w-4" />
            </span>
          )
        )}
      </div>
    </div>
  );
}
