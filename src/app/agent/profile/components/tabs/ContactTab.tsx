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

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
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

      {/* Contact Cards */}
      <div className="grid grid-cols-1 gap-6">
        {/* Email Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
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
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
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
                onClick={() => controller.setState({ isEditingPIN: true })}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
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

      {/* Security Notice */}
      <div className="bg-blue-50 rounded-lg shadow-sm p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiShield className="h-5 w-5 text-gray-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Your contact information is secure
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Phone numbers require PIN verification to view complete details.
                We recommend keeping your email verified for important
                notifications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
