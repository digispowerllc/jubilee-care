"use client";

import { useState } from "react";
import {
  FiMail,
  FiPhone,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiShield,
  FiUser,
  FiLock,
  FiAlertTriangle,
} from "react-icons/fi";
import { TabController } from "./TabController";
import { AgentProfileData } from "../../types";

interface ContactTabProps {
  profileData: AgentProfileData;
  controller: TabController;
}

export function ContactTab({ profileData, controller }: ContactTabProps) {
  const [showPhone, setShowPhone] = useState(false);
  const [pinVerified, setPinVerified] = useState(false);

  const maskData = (data: string, visibleChars = 2) => {
    if (!data) return "";
    if (data.length <= visibleChars * 2) return "•".repeat(data.length);
    return `${data.substring(0, visibleChars)}${"•".repeat(data.length - visibleChars * 2)}${data.substring(data.length - visibleChars)}`;
  };

  // Verification status for contact information
  const verificationStatus = {
    verified: profileData.emailVerified && profileData.phoneVerified,
    level: profileData.emailVerified && profileData.phoneVerified 
      ? "Full" 
      : profileData.emailVerified || profileData.phoneVerified 
        ? "Partial" 
        : "None",
    date: "2023-11-15",
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
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
              <p className="mt-1 text-sm text-gray-500">
                Your verified contact details
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 gap-6">
        {/* Email Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiMail className="h-5 w-5 text-gray-600" />
                <h3 className="ml-3 text-base font-medium text-gray-900">
                  Email Address
                </h3>
              </div>
              {profileData.emailVerified ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <FiCheckCircle className="mr-1 h-3 w-3" />
                  Verified
                </span>
              ) : (
                <button className="text-sm font-medium text-primary hover:text-primary-dark">
                  Verify
                </button>
              )}
            </div>

            <div className="mt-4">
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-gray-900">{profileData.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Phone Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiPhone className="h-5 w-5 text-gray-600" />
                <h3 className="ml-3 text-base font-medium text-gray-900">
                  Phone Number
                </h3>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Protected
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="p-3 bg-gray-50 rounded-md flex-1 mr-4">
                <p className="text-gray-900">
                  {pinVerified && showPhone
                    ? profileData.phone
                    : maskData(profileData.phone)}
                </p>
              </div>
              <button
                onClick={() => setShowPhone(!showPhone)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {pinVerified && showPhone ? (
                  <FiEyeOff className="mr-2 h-4 w-4" />
                ) : (
                  <FiEye className="mr-2 h-4 w-4" />
                )}
                {pinVerified && showPhone ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Status Section */}
      <div className="bg-blue-50 px-6 py-4 border-t border-b border-gray-200">
        <div className="flex items-start">
          <div className="flex-shrink-0 p-3">
            {verificationStatus.verified ? (
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
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                verificationStatus.verified 
                  ? "bg-green-100 text-green-800" 
                  : "bg-yellow-100 text-yellow-800"
              }`}>
                {verificationStatus.level}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {verificationStatus.verified
                ? `Verified on ${new Date(verificationStatus.date).toLocaleDateString()}`
                : `Last updated ${new Date(verificationStatus.date).toLocaleDateString()}`}
            </p>
          </div>
        </div>
      </div>

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
                : "Complete all verification steps for full account security."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}