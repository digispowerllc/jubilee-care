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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
        <div className="p-3 rounded-full border border-gray-200">
          <FiShield className="h-6 w-6 text-gray-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Security Center
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account security settings
          </p>
        </div>
      </div>

      {/* Password */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 relative p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FiKey className="h-5 w-5 text-gray-600" />
            <h3 className="text-base font-medium text-gray-900">Password</h3>
          </div>
          <button
            onClick={onEditPassword}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 focus:outline-none rounded p-1"
          >
            <FiEdit2 className="h-5 w-5" />
            <span className="text-sm font-medium">Edit</span>
          </button>
        </div>
        <p className="text-sm text-gray-500">Last changed 3 months ago</p>
      </div>

      {/* PIN */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 relative p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FiLock className="h-5 w-5 text-gray-600" />
            <h3 className="text-base font-medium text-gray-900">
              Security PIN
            </h3>
          </div>
          {pinVerified && (
            <button
              onClick={onEditPIN}
              className="flex items-center gap-1 text-gray-500 hover:text-gray-700 focus:outline-none rounded p-1"
            >
              <FiEdit2 className="h-5 w-5" />
              <span className="text-sm font-medium">Edit</span>
            </button>
          )}
        </div>
        <p className="text-sm text-gray-500">PIN is set</p>
      </div>

      {/* 2FA */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FiPhone className="h-5 w-5 text-gray-600" />
            <h3 className="text-base font-medium text-gray-900">
              Two-Factor Authentication
            </h3>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={is2FAEnabled}
              onChange={toggle2FA}
            />
            <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-green-600 transition-colors duration-300"></div>
            <span className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 peer-checked:translate-x-6"></span>
          </label>
        </div>

        <p className="text-sm text-gray-500 mt-1">
          {is2FAEnabled
            ? "2FA is currently enabled via SMS"
            : "Add an extra layer of security to your account"}
        </p>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <div className="flex items-center gap-2 mb-2">
          <FiTrash2 className="h-5 w-5 text-red-600" />
          <h3 className="text-base font-medium text-red-900">Danger Zone</h3>
        </div>
        <DangerZone />
      </div>
    </div>
  );
}
