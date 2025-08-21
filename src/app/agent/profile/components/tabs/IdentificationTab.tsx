// File: src/components/profile/tabs/IdentificationTab.tsx
"use client";

import {
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
import { AgentData } from "../../types";
import { useRef } from "react";

interface IdentificationTabProps {
  profileData: AgentData;
  controller: {
    handleAddNIN: () => void;
    handleViewNIN: () => void;
    handleUploadDocuments: (files: FileList) => void;
    setActiveTab?: (tab: string) => void;
    state?: Record<string, unknown>;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 flex items-center">
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

      {/* Verification Steps */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 flex justify-between">
        {[
          { label: "NIN", verified: profileData.ninVerified },
          { label: "Documents", verified: profileData.documentVerified },
          { label: "BVN", verified: profileData.bvnVerified },
        ].map((step, index) => {
          const stepStatus = step.verified ? "verified" : "pending";
          const stepColor =
            stepStatus === "verified"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800";
          return (
            <div key={step.label} className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center rounded-full h-8 w-8 ${stepColor}`}
              >
                {index + 1}
              </div>
              <span className="mt-2 text-xs text-gray-700">{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* NIN Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FiCreditCard className="h-5 w-5 text-gray-600" />
            <h3 className="ml-3 text-base font-medium text-gray-900">
              National Identification Number (NIN)
            </h3>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs text-center font-medium ${
              profileData.ninVerified
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {profileData.ninVerified ? (
              <>
                <FiCheckCircle className="mr-1 h-3 w-3" />
                Verified
              </>
            ) : (
              <>
                <FiAlertCircle className="mr-1 h-3 w-3" />
                Not Verified
              </>
            )}
          </span>
        </div>

        {/* Masked NIN display */}
        {profileData.nin && (
          <p className="mt-2 text-sm text-gray-600">
            {`${"*".repeat(profileData.nin.length - 4)}${profileData.nin.slice(
              -4
            )}`}
          </p>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={controller.handleViewNIN}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <FiEye className="mr-2 h-4 w-4" />
            View NIN
          </button>
        </div>
      </div>

      {/* Document Upload Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FiUser className="h-5 w-5 text-gray-600" />
            <h3 className="ml-3 text-base font-medium text-gray-900">
              Document Verification
            </h3>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              documentStatusUI.color === "green"
                ? "bg-green-100 text-green-800"
                : documentStatusUI.color === "yellow"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            <documentStatusUI.icon className="mr-1 h-3 w-3" />
            {documentStatusUI.text}
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-500">
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

        <div className="flex justify-center mt-4">
          <button
            onClick={triggerFileInput}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            <FiUpload className="mr-2 h-5 w-5" />
            Upload Documents
          </button>
        </div>
      </div>

      {/* BVN Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 opacity-75">
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
        <p className="mt-2 text-sm text-gray-500">
          Secure banking verification will be available soon
        </p>
      </div>
    </div>
  );
}
