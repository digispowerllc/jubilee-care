// File: src/app/agent/profile/components/tabs/OverviewTab.tsx
"use client";

import { TabType } from "../../types";
import {
  FiCheckCircle,
  FiClipboard,
  FiShield,
  FiFileText,
  FiSettings,
  FiCreditCard,
  FiMail,
  FiUser,
  FiAlertTriangle,
  FiPhone,
  FiArrowUp,
  FiArrowDown,
  FiMinus,
  FiChevronRight,
} from "react-icons/fi";
import { AgentData } from "../../types";

interface OverviewTabProps {
  profileData: Partial<AgentData>;
  controller?: {
    switchTab: (tab: TabType) => void;
  };
  switchTab?: (tab: TabType) => void;
}

export function OverviewTab({
  profileData,
  controller,
  switchTab,
}: OverviewTabProps) {
  const handleNavigate = (tab: TabType) => {
    if (controller?.switchTab) controller.switchTab(tab);
    else if (switchTab) switchTab(tab);
  };

  const quickActions: {
    name: string;
    tab?: TabType;
    icon: React.ElementType;
    description: string;
    secure?: boolean;
    color?: string;
  }[] = [
    {
      name: "Update Profile",
      tab: "personal",
      icon: FiUser,
      description: "Edit your personal details",
      secure: true,
      color: "text-blue-600 bg-blue-100",
    },
    {
      name: "Verify Contact",
      tab: "contact",
      icon: FiMail,
      description: "Confirm your email or phone",
      secure: true,
      color: "text-green-600 bg-green-100",
    },
    {
      name: "View ID",
      tab: "identification",
      icon: FiCreditCard,
      description: "View your identification documents (NIN & BVN)",
      secure: true,
      color: "text-purple-600 bg-purple-100",
    },
    {
      name: "Security Settings",
      tab: "security",
      icon: FiShield,
      description: "Manage passwords & PIN",
      secure: true,
      color: "text-red-600 bg-red-100",
    },
    {
      name: "Documents",
      tab: "identification",
      icon: FiFileText,
      description: "Upload required files",
      secure: true,
      color: "text-amber-600 bg-amber-100",
    },
    {
      name: "Preferences",
      tab: "preferences",
      icon: FiSettings,
      description: "Customize your experience",
      secure: true,
      color: "text-gray-600 bg-gray-100",
    },
  ];

  const accountMetrics = [
    {
      name: "Tasks Completed",
      value: "24",
      icon: FiClipboard,
      trend: "up" as const,
      change: "+12%",
      description: "From last week",
    },
    {
      name: "Active Sessions",
      value: "1",
      icon: FiShield,
      trend: "stable" as const,
      change: "0%",
      description: "No change",
    },
    {
      name: "Pending Actions",
      value: "3",
      icon: FiFileText,
      trend: "down" as const,
      change: "-2",
      description: "Since yesterday",
    },
  ];

  // Aggregate verification flags
  const verificationFlags = [
    { label: "Email", verified: !!profileData.emailVerified, icon: FiMail },
    { label: "Phone", verified: !!profileData.phoneVerified, icon: FiPhone },
    { label: "NIN", verified: !!profileData.ninVerified, icon: FiCreditCard },
    { label: "BVN", verified: !!profileData.bvnVerified, icon: FiCreditCard },
    {
      label: "Documents",
      verified: !!profileData.documentVerified,
      icon: FiFileText,
    },
    { label: "DOB", verified: !!profileData.dobVerified, icon: FiUser },
    { label: "Gender", verified: !!profileData.genderVerified, icon: FiUser },
  ];

  const verifiedCount = verificationFlags.filter((f) => f.verified).length;
  const totalFlags = verificationFlags.length;
  const verificationPercentage = Math.round((verifiedCount / totalFlags) * 100);

  const verificationStatus = {
    verified: verifiedCount === totalFlags,
    level:
      verifiedCount === totalFlags
        ? "Full"
        : verifiedCount > 0
          ? "Partial"
          : "No",
    pendingFlags: verificationFlags.filter((f) => !f.verified),
    date: new Date().toISOString(),
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <FiArrowUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <FiArrowDown className="h-4 w-4 text-red-500" />;
      default:
        return <FiMinus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600 bg-green-100";
      case "down":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Verification Status Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-xl bg-white shadow-sm border border-blue-200">
              <FiShield
                className={`h-6 w-6 ${
                  verificationStatus.verified
                    ? "text-green-600"
                    : "text-amber-600"
                }`}
              />
            </div>
            <div className="ml-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Verification Status
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {verifiedCount} of {totalFlags} verifications complete
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {verificationPercentage}%
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
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
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                verificationStatus.verified
                  ? "bg-green-500"
                  : verificationStatus.level === "Partial"
                    ? "bg-amber-500"
                    : "bg-red-500"
              }`}
              style={{ width: `${verificationPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {accountMetrics.map((metric) => (
          <div
            key={metric.name}
            className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`p-3 rounded-xl ${getTrendColor(metric.trend)}`}
                >
                  <metric.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {metric.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metric.value}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end">
                  {getTrendIcon(metric.trend)}
                  <span
                    className={`ml-1 text-sm font-medium ${
                      metric.trend === "up"
                        ? "text-green-600"
                        : metric.trend === "down"
                          ? "text-red-600"
                          : "text-gray-600"
                    }`}
                  >
                    {metric.change}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {metric.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account with one click
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => (
              <button
                key={action.name}
                type="button"
                onClick={() => action.tab && handleNavigate(action.tab)}
                className="group relative flex items-center space-x-4 rounded-xl p-4 border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <div
                  className={`flex-shrink-0 p-3 rounded-xl ${action.color} group-hover:scale-110 transition-transform`}
                >
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {action.name}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {action.description}
                  </p>
                </div>
                <FiChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Verification Overview */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Verification Details
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Complete all verifications for full account access
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4">
            {verificationFlags.map((flag) => (
              <div
                key={flag.label}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-lg ${
                      flag.verified
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <flag.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {flag.label}
                    </p>
                    <p className="text-sm text-gray-500">
                      {flag.verified ? "Verified" : "Pending verification"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {flag.verified ? (
                    <FiCheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <button
                      onClick={() => handleNavigate("contact")}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
                    >
                      Verify
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
