// File: src/components/profile/tabs/IdentificationTab.tsx
"use client";

import {
  FiLock,
  FiCreditCard,
  FiShield,
  FiAlertCircle,
  FiCheckCircle,
  FiEye,
  FiAlertTriangle,
  FiUser,
  FiUpload,
  FiFilePlus,
} from "react-icons/fi";
import { AgentProfileData } from "../../types";
import { useRef } from "react";

interface IdentificationTabProps {
  profileData: AgentProfileData;
  onViewNIN?: () => void;
  onAddNIN?: () => void;
  onUploadDocuments?: (files: FileList) => void;
  documentStatus?: "verified" | "pending" | "rejected" | "not_added";
  hasUploadedDocuments?: boolean;
}

export function IdentificationTab({
  profileData,
  onViewNIN,
  onAddNIN,
  onUploadDocuments,
  documentStatus = "not_added",
  hasUploadedDocuments = false,
}: IdentificationTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const statusConfig = {
    verified: {
      color: "green",
      icon: FiCheckCircle,
      text: "Verified",
      description: "Your documents have been successfully verified",
    },
    pending: {
      color: "yellow",
      icon: FiAlertCircle,
      text: "Pending Review",
      description: "We're reviewing your submitted documents",
    },
    rejected: {
      color: "red",
      icon: FiAlertTriangle,
      text: "Verification Failed",
      description: "Please submit valid documents",
    },
    not_added: {
      color: "orange",
      icon: FiFilePlus,
      text: "Not Added",
      description: "Please upload your verification documents",
    },
  };

  const currentStatus = hasUploadedDocuments
    ? documentStatus === "not_added"
      ? "pending"
      : documentStatus
    : "not_added";

  const status = statusConfig[currentStatus];

  // Add this function right after the component props interface
  const checkIdentityVerification = (
    profileData: AgentProfileData,
    documentStatus: string,
    hasUploadedDocuments: boolean
  ) => {
    // Required fields for full verification
    const hasNIN = !!profileData.nin;
    const hasVerifiedDocuments = documentStatus === "verified";

    // All identity docs verified (NIN + documents)
    const allIdentityVerified = hasNIN && hasVerifiedDocuments;

    return {
      verified: allIdentityVerified,
      level: allIdentityVerified
        ? "Full"
        : hasNIN || hasUploadedDocuments
          ? "Partial"
          : "None",
      date: "2023-11-15", // This would normally come from your backend
    };
  };

  // Then use it in your component like this:
  const verificationStatus = checkIdentityVerification(
    profileData,
    documentStatus,
    hasUploadedDocuments
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onUploadDocuments) {
      onUploadDocuments(e.target.files);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-full border border-gray-200">
              <FiShield className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-5">
              <h2 className="text-xl font-semibold text-gray-900">
                Identity Verification
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Secured government-issued identification
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Progress */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div className="flex items-center justify-between">
          {["NIN", "Documents", "BVN"].map((step, index) => {
            let stepStatus: keyof typeof statusConfig = "not_added";
            if (step === "NIN" && profileData.nin) stepStatus = "verified";
            if (step === "Documents") stepStatus = currentStatus;

            return (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center rounded-full h-8 w-8 ${
                    stepStatus === "verified"
                      ? "bg-green-100 text-green-800"
                      : stepStatus === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : stepStatus === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="mt-2 text-xs text-gray-700">{step}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Identification Cards */}
      <div className="space-y-6">
        {/* NIN Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiCreditCard className="h-5 w-5 text-gray-600" />
                <h3 className="ml-3 text-base font-medium text-gray-900">
                  National Identification Number (NIN)
                </h3>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  profileData.nin
                    ? "bg-green-100 text-green-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {profileData.nin ? (
                  <>
                    <FiCheckCircle className="mr-1 h-3 w-3" />
                    Verified
                  </>
                ) : (
                  <>
                    <FiFilePlus className="mr-1 h-3 w-3" />
                    Not Added
                  </>
                )}
              </span>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500">
                {profileData.nin
                  ? "Your NIN is verified"
                  : "Please add your NIN"}
              </p>

              <div className="mt-4 flex items-center justify-between">
                {profileData.nin ? (
                  <>
                    <div className="flex items-center">
                      <FiLock className="h-4 w-4 text-gray-600 mr-2" />
                      <span className="text-sm text-gray-500">
                        Secured with your PIN
                      </span>
                    </div>
                    <button
                      onClick={onViewNIN}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <FiEye className="mr-2 h-4 w-4" />
                      View NIN
                    </button>
                  </>
                ) : (
                  <button
                    onClick={onAddNIN}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Add NIN
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Document Verification Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiUser className="h-5 w-5 text-gray-600" />
                <h3 className="ml-3 text-base font-medium text-gray-900">
                  Document Verification
                </h3>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  currentStatus === "verified"
                    ? "bg-green-100 text-green-800"
                    : currentStatus === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : currentStatus === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-orange-100 text-orange-800"
                }`}
              >
                <status.icon className="mr-1 h-3 w-3" />
                {status.text}
              </span>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500">{status.description}</p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.heic,.heif"
                onChange={handleFileUpload}
                multiple
                className="hidden"
              />

              <div className="mt-4 flex justify-end">
                <button
                  onClick={triggerFileInput}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-green-600 bg-primary-600 hover:bg-primary-700"
                >
                  <FiUpload className="mr-2 h-4 w-4" />
                  Upload Documents
                </button>
              </div>

              {currentStatus === "pending" && (
                <div className="mt-3 text-xs text-yellow-600 flex items-center">
                  <FiAlertCircle className="mr-2 h-4 w-4" />
                  Your documents are being reviewed (usually within 24-48 hours)
                </div>
              )}
              {currentStatus === "rejected" && (
                <div className="mt-3 text-xs text-red-600 flex items-center">
                  <FiAlertTriangle className="mr-2 h-4 w-4" />
                  Please check the requirements and resubmit
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BVN Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 opacity-75">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiCreditCard className="h-5 w-5 text-gray-600" />
                <h3 className="ml-3 text-base font-medium text-gray-900">
                  Bank Verification Number (BVN)
                </h3>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <FiAlertCircle className="mr-1 h-3 w-3" />
                Coming Soon
              </span>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Secure banking verification will be available soon
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Status Section */}
      <div className="bg-blue-50 px-6 py-4 border-t border-gray-200 rounded-t-lg">
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
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-b-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <FiLock className="h-4 w-4 text-gray-400" />
          </div>
          <div className="ml-3">
            <p className="text-xs text-gray-500">
              {verificationStatus.verified
                ? "Your documents have full verification status. All required information is complete."
                : "Please complete all required document upload and verification steps to achieve full verification status."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
