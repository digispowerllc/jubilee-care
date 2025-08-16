// File: src/components/profile/tabs/IdentificationTab.tsx
"use client";

import { UnprotectedData } from "@/lib/types/profileTypes";
import { FiLock, FiCreditCard, FiShield, FiAlertCircle } from "react-icons/fi";

interface IdentificationTabProps {
  data: UnprotectedData;
  onRequestPINVerification: (type: "NIN" | "BVN") => void;
}

export function IdentificationTab({
  data,
  onRequestPINVerification,
}: IdentificationTabProps) {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
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

      {/* Identification Cards */}
      <div className="grid grid-cols-1 gap-6">
        {/* NIN Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiCreditCard className="h-5 w-5 text-gray-600" />
                <h3 className="ml-3 text-base font-medium text-gray-900">
                  National Identification Number (NIN)
                </h3>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Verified
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              {data.nin ? (
                <>
                  <div className="flex items-center">
                    <FiLock className="h-4 w-4 text-gray-600 mr-2" />
                    <span className="text-sm font-medium text-gray-500">
                      Secured with your PIN
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRequestPINVerification("NIN")}
                    className="ml-4 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    View NIN
                  </button>
                </>
              ) : (
                <div className="flex items-center text-sm text-yellow-700">
                  <FiAlertCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  Not yet registered
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BVN Card (Future Implementation) */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 opacity-75">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiCreditCard className="h-5 w-5 text-gray-600" />
                <h3 className="ml-3 text-base font-medium text-gray-900">
                  Bank Verification Number (BVN)
                </h3>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Coming Soon
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-500">
                <FiAlertCircle className="mr-2 h-4 w-4 text-gray-400" />
                Secure banking verification will be available soon
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-green-50 rounded-lg shadow-sm p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiShield className="h-5 w-5 text-gray-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Your information is protected
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                All identification numbers are encrypted and require PIN
                verification to view. We never store your complete details in
                readable format.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
