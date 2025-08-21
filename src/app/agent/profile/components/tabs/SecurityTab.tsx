// File: app/agent/profile/tabs/SecurityTab.tsx
"use client";

import { useState } from "react";
import {
  FiLock,
  FiShield,
  FiKey,
  FiPhone,
  FiTrash2,
  FiEdit2,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
} from "react-icons/fi";
import { DangerZone } from "@/app/agent/profile/components/DangerZone";
import { AgentData } from "../../types";

interface SecurityTabProps {
  profileData: AgentData;
  onEditPassword?: () => void;
  onEditPIN?: () => void;
  onToggle2FA?: (enable: boolean) => void;
}

export function SecurityTab({
  profileData,
  onEditPassword,
  onEditPIN,
  onToggle2FA,
}: SecurityTabProps) {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [pinVerified] = useState(true); // Assume PIN already exists

  const toggle2FA = () => {
    const newValue = !is2FAEnabled;
    setIs2FAEnabled(newValue);
    if (onToggle2FA) onToggle2FA(newValue);
  };

  const securityFeatures = [
    {
      id: "password",
      title: "Password",
      description: "Last changed 3 months ago",
      icon: FiKey,
      status: "secure",
      action: onEditPassword,
      actionLabel: "Change Password",
    },
    {
      id: "pin",
      title: "Security PIN",
      description: "PIN is set and active",
      icon: FiLock,
      status: "secure",
      action: onEditPIN,
      actionLabel: "Change PIN",
    },
    {
      id: "2fa",
      title: "Two-Factor Authentication",
      description: is2FAEnabled
        ? "2FA is currently enabled via SMS"
        : "Add an extra layer of security",
      icon: FiPhone,
      status: is2FAEnabled ? "enabled" : "disabled",
      action: toggle2FA,
      actionLabel: is2FAEnabled ? "Disable 2FA" : "Enable 2FA",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "secure":
        return "text-green-600 bg-green-100";
      case "enabled":
        return "text-blue-600 bg-blue-100";
      case "disabled":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "secure":
        return <FiCheckCircle className="h-4 w-4" />;
      case "enabled":
        return <FiCheckCircle className="h-4 w-4" />;
      case "disabled":
        return <FiAlertCircle className="h-4 w-4" />;
      default:
        return <FiClock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center">
          <div className="flex-shrink-0 p-3 rounded-xl bg-white shadow-sm border border-blue-200">
            <FiShield className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Security Center
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Manage your account security settings and preferences
            </p>
          </div>
        </div>
      </div>

      {/* Security Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {securityFeatures.map((feature) => (
          <div
            key={feature.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <feature.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="ml-3 text-base font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(feature.status)}`}
                >
                  {getStatusIcon(feature.status)}
                  <span className="ml-1 capitalize">{feature.status}</span>
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                {feature.description}
              </p>

              {feature.id === "2fa" ? (
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-medium text-gray-700">
                    {is2FAEnabled ? "Enabled" : "Disabled"}
                  </span>
                  <div className="relative inline-flex items-center">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={is2FAEnabled}
                      onChange={toggle2FA}
                    />
                    <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-300"></div>
                    <span className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 peer-checked:translate-x-6"></span>
                  </div>
                </label>
              ) : (
                <button
                  onClick={feature.action}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <FiEdit2 className="h-4 w-4 mr-2" />
                  {feature.actionLabel}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Security Status Overview */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center">
          <div className="flex-shrink-0 p-2">
            <FiShield className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Security Status
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Your account security is{" "}
              {pinVerified ? "strong" : "requires attention"}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
              <FiCheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-900 mt-2">Password</p>
            <p className="text-xs text-gray-500">Secure</p>
          </div>

          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
              <FiCheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-900 mt-2">PIN</p>
            <p className="text-xs text-gray-500">Set</p>
          </div>

          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-amber-100 rounded-full">
              <FiAlertCircle className="h-5 w-5 text-amber-600" />
            </div>
            <p className="text-sm font-medium text-gray-900 mt-2">2FA</p>
            <p className="text-xs text-gray-500">Recommended</p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-xl p-6 border border-red-200">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 p-2">
            <FiTrash2 className="h-6 w-6 text-red-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
            <p className="text-sm text-red-700 mt-1">
              Irreversible actions that affect your account
            </p>
          </div>
        </div>
        <DangerZone />
      </div>

      {/* Security Tips */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="flex items-start">
          <div className="flex-shrink-0 p-2">
            <FiShield className="h-5 w-5 text-gray-400" />
          </div>
          <div className="ml-4">
            <h4 className="text-sm font-medium text-gray-900">
              Security Best Practices
            </h4>
            <ul className="text-sm text-gray-600 mt-2 space-y-1">
              <li>• Use a unique, strong password for your account</li>
              <li>• Enable two-factor authentication for extra security</li>
              <li>• Never share your PIN or password with anyone</li>
              <li>• Regularly update your security settings</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
