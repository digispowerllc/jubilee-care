import { FiMapPin, FiHome } from "react-icons/fi";
import { TabController } from "./TabController";
import { AddressTabProps } from "../../types";

export function AddressTab({ profileData, controller }: AddressTabProps) {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 p-3 rounded-full border border-gray-200">
            <FiHome className="h-6 w-6 text-gray-600" />
          </div>
          <div className="ml-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Address Information
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Your verified residential details
            </p>
          </div>
        </div>
      </div>

      {/* Address Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* State & LGA Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div className="px-6 py-5 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Administrative Region
              </h3>
              <div className="mt-2 space-y-4">
                <div>
                  <p className="text-xs font-medium text-gray-500">State</p>
                  <p className="mt-1 text-base font-medium text-gray-900 p-3 bg-gray-50 rounded-md">
                    {profileData.state}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Local Government Area
                  </p>
                  <p className="mt-1 text-base font-medium text-gray-900 p-3 bg-gray-50 rounded-md">
                    {profileData.lga}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Address Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div className="px-6 py-5 h-full">
            <div className="flex items-center">
              <FiMapPin className="h-5 w-5 text-gray-600" />
              <h3 className="ml-3 text-base font-medium text-gray-900">
                Full Residential Address
              </h3>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-md h-[calc(100%-50px)]">
              <p className="text-gray-900 whitespace-pre-line">
                {profileData.address || "No address provided"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Notice */}
      <div className="bg-blue-50 rounded-lg shadow-sm p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiMapPin className="h-5 w-5 text-gray-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Address Verification
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                This address may be used for official documentation and service
                delivery. Please ensure it&#39;s current and accurate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
