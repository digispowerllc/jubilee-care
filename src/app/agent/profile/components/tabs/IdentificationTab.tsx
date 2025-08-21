// File: src/components/profile/tabs/IdentificationTab.tsx
"use client";

import {
  FiCreditCard,
  FiUser,
  FiShield,
  FiAlertCircle,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiAlertTriangle,
  FiUpload,
  FiFileText,
  FiLock,
  FiClock,
} from "react-icons/fi";
import { AgentData } from "../../types";
import { useRef, useState } from "react";

interface IdentificationTabProps {
  profileData: AgentData;
  controller: {
    handleAddNIN: () => void;
    handleViewNIN: () => void;
    handleUploadDocuments: (files: FileList) => void;
    setActiveTab?: (tab: string) => void;
  };
  documentStatus?: "verified" | "pending" | "rejected";
  hasUploadedDocuments?: boolean;
}

export function IdentificationTab({
  profileData,
  controller,
  documentStatus = "pending",
  hasUploadedDocuments = false,
}: IdentificationTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showNIN, setShowNIN] = useState(false);
  const [showBVN, setShowBVN] = useState(false);

  const statusConfig = {
    verified: {
      color: "green",
      icon: FiCheckCircle,
      text: "Verified",
      description: "Your documents have been successfully verified",
      bgColor: "bg-green-100 text-green-800",
    },
    pending: {
      color: "amber",
      icon: FiClock,
      text: "Pending Review",
      description: "We're reviewing your submitted documents",
      bgColor: "bg-amber-100 text-amber-800",
    },
    rejected: {
      color: "red",
      icon: FiAlertTriangle,
      text: "Verification Failed",
      description: "Please submit valid documents",
      bgColor: "bg-red-100 text-red-800",
    },
  };

  const currentStatus = hasUploadedDocuments ? documentStatus : "pending";
  const documentStatusUI = statusConfig[currentStatus];

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      controller.handleUploadDocuments(e.target.files);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const verificationStatus = {
    verified:
      profileData.ninVerified &&
      profileData.documentVerified &&
      profileData.bvnVerified,
    level:
      profileData.ninVerified &&
      profileData.documentVerified &&
      profileData.bvnVerified
        ? "Full"
        : profileData.ninVerified ||
            profileData.documentVerified ||
            profileData.bvnVerified
          ? "Partial"
          : "None",
    date:
      profileData.ninVerifiedDate ??
      profileData.documentVerifiedDate ??
      profileData.bvnVerifiedDate ??
      new Date().toISOString(),
  };

  const maskSensitiveData = (data: string, show: boolean) =>
    show ? data : `${"•".repeat(data.length - 4)}${data.slice(-4)}`;

  const getStatusIcon = () => {
    switch (verificationStatus.level) {
      case "Full":
        return <FiCheckCircle className="h-6 w-6 text-green-500" />;
      case "Partial":
        return <FiAlertCircle className="h-6 w-6 text-amber-500" />;
      default:
        return <FiAlertTriangle className="h-6 w-6 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (verificationStatus.level) {
      case "Full":
        return "bg-green-50 border-green-200";
      case "Partial":
        return "bg-amber-50 border-amber-200";
      default:
        return "bg-red-50 border-red-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center">
          <div className="flex-shrink-0 p-3 rounded-xl bg-white shadow-sm border border-blue-200">
            <FiCreditCard className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Identity Verification
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Secured government-issued identification documents
            </p>
          </div>
        </div>
      </div>

      {/* Verification Progress */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Verification Progress
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: "NIN",
              verified: profileData.ninVerified,
              icon: FiCreditCard,
              date: profileData.ninVerifiedDate,
            },
            {
              label: "Documents",
              verified: profileData.documentVerified,
              icon: FiFileText,
              date: profileData.documentVerifiedDate,
            },
            {
              label: "BVN",
              verified: profileData.bvnVerified,
              icon: FiCreditCard,
              date: profileData.bvnVerifiedDate,
            },
          ].map((step) => (
            <div
              key={step.label}
              className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div
                className={`p-3 rounded-xl ${
                  step.verified
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <step.icon className="h-5 w-5" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {step.label}
                </p>
                <p className="text-sm text-gray-500">
                  {step.verified ? "Verified" : "Pending"}
                </p>
                {step.verified && step.date && (
                  <p className="text-xs text-green-600 mt-1">
                    Verified {new Date(step.date).toLocaleDateString()}
                  </p>
                )}
              </div>
              {step.verified ? (
                <FiCheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <FiClock className="h-5 w-5 text-amber-500" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* NIN Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100">
                <FiCreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="ml-3 text-base font-semibold text-gray-900">
                National Identification Number (NIN)
              </h3>
            </div>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                profileData.ninVerified
                  ? "bg-green-100 text-green-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {profileData.ninVerified ? (
                <>
                  <FiCheckCircle className="mr-1 h-3 w-3" /> Verified
                </>
              ) : (
                <>
                  <FiAlertCircle className="mr-1 h-3 w-3" /> Not Verified
                </>
              )}
            </span>
          </div>

          {profileData.nin ? (
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <div className="flex-1">
                <p className="text-gray-900 font-mono text-sm">
                  {maskSensitiveData(profileData.nin, showNIN)}
                </p>
                {profileData.ninVerifiedDate && (
                  <p className="text-xs text-green-600 mt-1">
                    Verified{" "}
                    {new Date(profileData.ninVerifiedDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowNIN(!showNIN)}
                className="ml-3 inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                title={showNIN ? "Hide NIN" : "Reveal NIN"}
              >
                {showNIN ? (
                  <FiEyeOff className="h-4 w-4" />
                ) : (
                  <FiEye className="h-4 w-4" />
                )}
              </button>
            </div>
          ) : (
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <p className="text-amber-800 text-sm">
                No NIN added yet. Please add your National Identification
                Number.
              </p>
            </div>
          )}

          <div className="mt-4 flex gap-3">
            <button
              onClick={controller.handleAddNIN}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <FiCreditCard className="mr-2 h-4 w-4" />
              {profileData.nin ? "Update NIN" : "Add NIN"}
            </button>
            {profileData.nin && (
              <button
                onClick={controller.handleViewNIN}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <FiEye className="mr-2 h-4 w-4" />
                View Details
              </button>
            )}
          </div>
        </div>
      </div>

      {/* BVN Card */}
      {profileData.bvn && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-purple-100">
                  <FiCreditCard className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="ml-3 text-base font-semibold text-gray-900">
                  Bank Verification Number (BVN)
                </h3>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  profileData.bvnVerified
                    ? "bg-green-100 text-green-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {profileData.bvnVerified ? (
                  <>
                    <FiCheckCircle className="mr-1 h-3 w-3" /> Verified
                  </>
                ) : (
                  <>
                    <FiAlertCircle className="mr-1 h-3 w-3" /> Pending
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <div className="flex-1">
                <p className="text-gray-900 font-mono text-sm">
                  {maskSensitiveData(profileData.bvn, showBVN)}
                </p>
                {profileData.bvnVerifiedDate && (
                  <p className="text-xs text-green-600 mt-1">
                    Verified{" "}
                    {new Date(profileData.bvnVerifiedDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowBVN(!showBVN)}
                className="ml-3 inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                title={showBVN ? "Hide BVN" : "Reveal BVN"}
              >
                {showBVN ? (
                  <FiEyeOff className="h-4 w-4" />
                ) : (
                  <FiEye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Upload Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-amber-100">
                <FiFileText className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="ml-3 text-base font-semibold text-gray-900">
                Document Verification
              </h3>
            </div>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${documentStatusUI.bgColor}`}
            >
              <documentStatusUI.icon className="mr-1 h-3 w-3" />
              {documentStatusUI.text}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            {documentStatusUI.description}
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.heic,.heif"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-3">
              Supported formats: PDF, JPG, PNG, HEIC (Max: 10MB per file)
            </p>
            <button
              onClick={triggerFileInput}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              <FiUpload className="mr-2 h-4 w-4" />
              Upload Documents
            </button>
          </div>
        </div>
      </div>

      {/* Verification Status Summary */}
      <div className={`rounded-xl p-6 border ${getStatusColor()}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0 p-2">{getStatusIcon()}</div>
          <div className="ml-4">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Identity Verification Status
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  verificationStatus.verified
                    ? "bg-green-100 text-green-800"
                    : verificationStatus.level === "Partial"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {verificationStatus.level} Verification
              </span>
            </div>

            <div className="mt-2 text-sm text-gray-600">
              {verificationStatus.verified ? (
                <div>
                  <p>
                    All identity documents verified on{" "}
                    {new Date(verificationStatus.date).toLocaleDateString()}
                  </p>
                  <div className="mt-2 flex items-center text-green-600">
                    <FiCheckCircle className="h-4 w-4 mr-1" />
                    Your identity is fully verified and secure
                  </div>
                </div>
              ) : (
                <div>
                  <p>
                    Last updated{" "}
                    {new Date(verificationStatus.date).toLocaleDateString()}
                  </p>
                  <div className="mt-2">
                    <p className="font-medium">Pending verification:</p>
                    <ul className="mt-1 space-y-1">
                      {!profileData.ninVerified && (
                        <li className="flex items-center text-amber-600">
                          <FiAlertCircle className="h-3 w-3 mr-2" />
                          NIN
                        </li>
                      )}
                      {!profileData.documentVerified && (
                        <li className="flex items-center text-amber-600">
                          <FiAlertCircle className="h-3 w-3 mr-2" />
                          Documents
                        </li>
                      )}
                      {!profileData.bvnVerified && (
                        <li className="flex items-center text-amber-600">
                          <FiAlertCircle className="h-3 w-3 mr-2" />
                          BVN
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Security Footer */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="flex items-start">
          <div className="flex-shrink-0 p-2">
            <FiLock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="ml-4">
            <h4 className="text-sm font-medium text-gray-900">
              Security Information
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              Your identification documents are encrypted and stored securely.
              We use bank-level security measures to protect your personal
              information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
