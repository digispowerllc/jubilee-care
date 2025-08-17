// File: src/app/agent/profile/components/tabs/OverviewTab.tsx
"use client";

import { TabController } from "./TabController";
import { TabType } from "../../types";
import {
  FiCheckCircle,
  FiXCircle,
  FiClipboard,
  FiShield,
  FiFileText,
  FiSettings,
  FiCreditCard,
  FiMail,
  FiUser,
} from "react-icons/fi";

interface OverviewTabProps {
  profileData: {
    emailVerified: boolean;
    // Include other properties used in the component if needed
  };
  controller: TabController;
}

export function OverviewTab({ profileData, controller }: OverviewTabProps) {
  const quickActions: {
    name: string;
    tab?: TabType;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    secure?: boolean;
  }[] = [
    {
      name: "Update Profile",
      tab: "personal",
      icon: FiUser,
      description: "Edit your personal details",
    },
    {
      name: "Verify Contact",
      tab: "contact",
      icon: FiMail,
      description: "Confirm your email or phone",
      secure: true,
    },
    {
      name: "View ID",
      tab: "identification",
      icon: FiCreditCard,
      description: "View your identification documents",
      secure: true,
    },
    {
      name: "View NIN",
      tab: "identification",
      icon: FiCreditCard,
      description: "National Identification Number (NIN)",
      secure: true,
    },
    {
      name: "View BVN",
      tab: "identification",
      icon: FiCreditCard,
      description: "Bank Verification Number (coming soon)",
      secure: true,
    },
    {
      name: "Security Settings",
      tab: "security",
      icon: FiShield,
      description: "Manage passwords & PIN",
      secure: true,
    },
    {
      name: "Documents",
      tab: "identification",
      icon: FiFileText,
      description: "Upload required files",
    },
    {
      name: "Preferences",
      tab: "preferences",
      icon: FiSettings,
      description: "Customize your experience",
    },
    {
      name: "Support",
      tab: "contact",
      icon: FiClipboard,
      description: "Get help or contact support",
    },
  ];

  const accountMetrics = [
    {
      name: "Tasks Completed",
      value: "24",
      icon: FiClipboard,
      trend: "up" as const,
    },
    {
      name: "Active Sessions",
      value: "1",
      icon: FiShield,
      trend: "stable" as const,
    },
    {
      name: "Pending Actions",
      value: "3",
      icon: FiFileText,
      trend: "down" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {accountMetrics.map((metric) => (
          <div key={metric.name} className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center space-x-4">
              <div
                className={`p-3 rounded-lg ${
                  metric.trend === "up"
                    ? "bg-green-100 text-green-600"
                    : metric.trend === "down"
                    ? "bg-red-100 text-red-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                <metric.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {metric.name}
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {metric.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Quick Actions
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account with one click
          </p>
        </div>
        <div className="border-t border-gray-200 px-6 py-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => (
              <button
                key={action.name}
                type="button"
                onClick={() => action.tab && controller.switchTab(action.tab)}
                className="group relative flex items-start space-x-4 rounded-lg p-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                <div
                  className={`flex-shrink-0 p-3 rounded-lg ${
                    action.secure
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600"
                  } group-hover:bg-opacity-80`}
                >
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {action.name}
                    {action.secure && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Secure
                      </span>
                    )}
                  </h4>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Account Status */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Account Status
        </h3>
        <div className="mt-4 space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              {profileData.emailVerified ? (
                <FiCheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <FiXCircle className="h-5 w-5 text-yellow-500" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                Email {profileData.emailVerified ? "Verified" : "Pending Verification"}
              </p>
              <p className="text-sm text-gray-500">
                {profileData.emailVerified
                  ? "Your email address has been confirmed"
                  : "Please verify your email to access all features"}
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <FiShield className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                Account Security
              </p>
              <p className="text-sm text-gray-500">
                Your account has standard protection enabled
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}