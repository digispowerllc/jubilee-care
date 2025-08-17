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
import { NextRouter } from "next/router";
import { TabController } from "./TabController";
import { AgentProfileData } from "../../types";

interface SecurityTabProps {
  router: NextRouter;
  profileData: AgentProfileData;
  controller: TabController;
}

export function SecurityTab({ router, profileData, controller }: SecurityTabProps) {
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingPIN, setIsEditingPIN] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPIN, setNewPIN] = useState("");
  const [confirmPIN, setConfirmPIN] = useState("");
  const [pinVerified, setPinVerified] = useState(true);

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingPassword(false);
    router.reload();
  };

  const handlePINUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingPIN(false);
    setPinVerified(true);
    router.reload();
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

      <div className="space-y-6">
        {/* Password Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 relative p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FiKey className="h-5 w-5 text-gray-600" />
              <h3 className="text-base font-medium text-gray-900">Password</h3>
            </div>
            {!isEditingPassword && (
              <button
                onClick={() => {
                  setIsEditingPassword(true);
                  setIsEditingPIN(false); // close PIN card
                  setNewPIN("");
                  setConfirmPIN("");
                }}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 rounded p-1"
              >
                <FiEdit2 className="h-5 w-5" />
              </button>
            )}
          </div>

          {isEditingPassword ? (
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingPassword(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-40 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <p className="text-sm text-gray-500 mt-2">
              Last changed 3 months ago
            </p>
          )}
        </div>

        {/* PIN Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 relative p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FiLock className="h-5 w-5 text-gray-600" />
              <h3 className="text-base font-medium text-gray-900">
                Security PIN
              </h3>
            </div>
            {pinVerified && !isEditingPIN && (
              <button
                onClick={() => {
                  setIsEditingPIN(true);
                  setIsEditingPassword(false); // close Password card
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 rounded p-1"
              >
                <FiEdit2 className="h-5 w-5" />
              </button>
            )}
          </div>

          {isEditingPIN && (
            <form onSubmit={handlePINUpdate} className="space-y-4">
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="New 6-digit PIN"
                value={newPIN}
                onChange={(e) => setNewPIN(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="Confirm 6-digit PIN"
                value={confirmPIN}
                onChange={(e) => setConfirmPIN(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingPIN(false);
                    setNewPIN("");
                    setConfirmPIN("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-40 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  Save
                </button>
              </div>
            </form>
          )}
          {!isEditingPIN && (
            <p className="text-sm text-gray-500 mt-2">PIN is set</p>
          )}
        </div>

        {/* 2FA Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FiPhone className="h-5 w-5 text-gray-600" />
              <h3 className="text-base font-medium text-gray-900">
                Two-Factor Authentication
              </h3>
            </div>

            {/* iOS-style toggle */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={is2FAEnabled}
                onChange={() => setIs2FAEnabled(!is2FAEnabled)}
              />
              <div className="w-12 h-6 bg-gray-300 rounded-full peer-focus:outline-none peer-focus:ring-0 peer-focus:ring-green-400 peer-checked:bg-green-600 transition-colors duration-300"></div>
              <span className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 peer-checked:translate-x-6"></span>
            </label>
          </div>

          <p className="text-sm text-gray-500 mt-1">
            {is2FAEnabled
              ? "2FA is currently enabled via SMS"
              : "Add an extra layer of security to your account"}
          </p>
          {is2FAEnabled && (
            <button className="mt-2 text-sm font-medium text-green-600 hover:text-green-800">
              Change 2FA Method
            </button>
          )}
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
    </div>
  );
}
