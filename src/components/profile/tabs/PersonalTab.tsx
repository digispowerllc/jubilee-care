// File: src/components/profile/tabs/PersonalTab.tsx
"use client";

import { UnprotectedData } from "@/lib/types/profileTypes";
import { FiUser } from "react-icons/fi";

interface PersonalTabProps {
  data: UnprotectedData;
}

export function PersonalTab({ data }: PersonalTabProps) {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 p-3 rounded-full border border-gray-200">
            <FiUser className="h-6 w-6 text-primary-600" />
          </div>
          <div className="ml-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Personal Information
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Your verified identification details
            </p>
          </div>
        </div>
      </div>

      {/* Details Card */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-5 space-y-6">
          {/* Name Group */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Legal Name
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Surname */}
              <div>
                <p className="text-xs font-medium text-gray-500">Surname</p>
                <p className="mt-1 text-base font-medium text-gray-900">
                  {data.surname}
                </p>
              </div>

              {/* First Name */}
              <div>
                <p className="text-xs font-medium text-gray-500">First Name</p>
                <p className="mt-1 text-base font-medium text-gray-900">
                  {data.firstName}
                </p>
              </div>

              {/* Other Name */}
              <div>
                <p className="text-xs font-medium text-gray-500">Other Names</p>
                <p className="mt-1 text-base font-medium text-gray-900">
                  {data.otherName || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Verification Status */}
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <svg
                className="h-5 w-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                Verified Identity
              </p>
              <p className="text-sm text-gray-500">
                Your name information has been officially verified and cannot be
                changed
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4">
          <p className="text-xs text-gray-500">
            For legal name changes, please contact support with official
            documentation
          </p>
        </div>
      </div>
    </div>
  );
}
