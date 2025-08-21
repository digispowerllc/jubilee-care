// File: app/agent/profile/tabs/AddressTab.tsx
"use client";

import {
  FiMapPin,
  FiHome,
  FiEdit2,
  FiShield,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import { AgentData } from "../../types";

interface AddressTabProps {
  profileData: AgentData;
}

export function AddressTab({ profileData }: AddressTabProps) {
  // Check if address is complete
  const isAddressComplete =
    profileData.state && profileData.lga && profileData.address;

  const verificationStatus = {
    verified: isAddressComplete,
    level: isAddressComplete ? "Complete" : "Incomplete",
    missingFields: [
      ...(!profileData.state ? ["State"] : []),
      ...(!profileData.lga ? ["LGA"] : []),
      ...(!profileData.address ? ["Address"] : []),
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center">
          <div className="flex-shrink-0 p-3 rounded-xl bg-white shadow-sm border border-blue-200">
            <FiMapPin className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Address Information
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Your verified residential details
            </p>
          </div>
        </div>
      </div>

      {/* Verification Status */}
      <div
        className={`rounded-xl p-6 border ${
          verificationStatus.verified
            ? "bg-green-50 border-green-200"
            : "bg-amber-50 border-amber-200"
        }`}
      >
        <div className="flex items-center">
          <div className="flex-shrink-0 p-2">
            {verificationStatus.verified ? (
              <FiCheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <FiAlertTriangle className="h-6 w-6 text-amber-500" />
            )}
          </div>
          <div className="ml-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Address Status
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  verificationStatus.verified
                    ? "bg-green-100 text-green-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {verificationStatus.level}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {verificationStatus.verified
                ? "Your address information is complete and ready for verification."
                : `Missing: ${verificationStatus.missingFields.join(", ")}`}
            </p>
          </div>
        </div>
      </div>

      {/* Address Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* State & LGA Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-blue-100">
                  <FiMapPin className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="ml-3 text-base font-semibold text-gray-900">
                  Administrative Region
                </h3>
              </div>
              <button
                type="button"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                onClick={() =>
                  console.log("Edit Administrative Region clicked")
                }
              >
                <FiEdit2 className="h-4 w-4 mr-1" />
                Edit
              </button>
            </div>

            <div className="space-y-4">
              <InfoField
                label="State"
                value={profileData.state}
                verified={!!profileData.state}
              />
              <InfoField
                label="Local Government Area"
                value={profileData.lga}
                verified={!!profileData.lga}
              />
            </div>
          </div>
        </div>

        {/* Full Address Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-green-100">
                  <FiHome className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="ml-3 text-base font-semibold text-gray-900">
                  Residential Address
                </h3>
              </div>
              <button
                type="button"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                onClick={() => console.log("Edit Address clicked")}
              >
                <FiEdit2 className="h-4 w-4 mr-1" />
                Edit
              </button>
            </div>

            <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-900 whitespace-pre-line text-sm leading-relaxed">
                {profileData.address || (
                  <span className="text-gray-400 italic">
                    No address provided
                  </span>
                )}
              </p>
              {profileData.address && (
                <div className="mt-3 flex items-center text-green-600">
                  <FiCheckCircle className="h-4 w-4 mr-1" />
                  <span className="text-xs">Address provided</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Verification Notice */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start">
          <div className="flex-shrink-0 p-2">
            <FiShield className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-semibold text-blue-900">
              Address Verification
            </h3>
            <div className="mt-2 text-sm text-blue-700 space-y-2">
              <p>
                • This address may be used for official documentation and
                service delivery
              </p>
              <p>• Please ensure all information is current and accurate</p>
              <p>• Your address helps us provide location-based services</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Footer */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="flex items-start">
          <div className="flex-shrink-0 p-2">
            <FiShield className="h-5 w-5 text-gray-400" />
          </div>
          <div className="ml-4">
            <h4 className="text-sm font-medium text-gray-900">
              Privacy & Security
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              Your address information is stored securely and only used for
              verification and service delivery purposes. We never share your
              personal details with third parties without your consent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Reusable InfoField for cleaner structure */
function InfoField({
  label,
  value,
  verified,
}: {
  label: string;
  value?: string | null;
  verified?: boolean;
}) {
  return (
    <div className="group">
      <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-base font-semibold text-gray-900">
          {value || <span className="text-gray-400 italic">Not provided</span>}
        </p>
        {verified && value && (
          <FiCheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
        )}
      </div>
    </div>
  );
}
