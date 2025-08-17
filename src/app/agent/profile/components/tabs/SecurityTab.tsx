// File: app/agent/profile/tabs/SecurityTab.tsx
"use client";

import {
  FiLock,
  FiShield,
  FiKey,
  FiPhone,
  FiTrash2,
  FiEdit2,
} from "react-icons/fi";
import { DangerZone } from "@/app/agent/profile/components/DangerZone";
import { TabController } from "./TabController";
import { AgentProfileData } from "../../types";

interface SecurityTabProps {
  profileData: AgentProfileData;
  controller: TabController;
}

export function SecurityTab({ profileData, controller }: SecurityTabProps) {
  const state = controller.state;

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
            {!state.isEditingPassword && (
              <button
                onClick={controller.openPasswordCard}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 rounded p-1"
              >
                <FiEdit2 className="h-5 w-5" />
              </button>
            )}
          </div>

          {state.isEditingPassword ? (
            <form onSubmit={controller.handlePasswordUpdate} className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                value={state.currentPassword}
                onChange={(e) =>
                  controller.setState({ currentPassword: e.target.value })
                }
                className="w-full px-3 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={state.newPassword}
                onChange={(e) =>
                  controller.setState({ newPassword: e.target.value })
                }
                className="w-full px-3 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={state.confirmPassword}
                onChange={(e) =>
                  controller.setState({ confirmPassword: e.target.value })
                }
                className="w-full px-3 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() =>
                    controller.setState({
                      isEditingPassword: false,
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    })
                  }
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
            {state.pinVerified && !state.isEditingPIN && (
              <button
                onClick={controller.openPINCard}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 rounded p-1"
              >
                <FiEdit2 className="h-5 w-5" />
              </button>
            )}
          </div>

          {state.isEditingPIN && (
            <form onSubmit={controller.handlePINUpdate} className="space-y-4">
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="New 6-digit PIN"
                value={state.newPIN}
                onChange={(e) =>
                  controller.setState({ newPIN: e.target.value })
                }
                className="w-full px-3 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="Confirm 6-digit PIN"
                value={state.confirmPIN}
                onChange={(e) =>
                  controller.setState({ confirmPIN: e.target.value })
                }
                className="w-full px-3 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() =>
                    controller.setState({
                      isEditingPIN: false,
                      newPIN: "",
                      confirmPIN: "",
                    })
                  }
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
          {!state.isEditingPIN && (
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

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={state.is2FAEnabled}
                onChange={controller.toggle2FA}
              />
              <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-green-600 transition-colors duration-300"></div>
              <span className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 peer-checked:translate-x-6"></span>
            </label>
          </div>

          <p className="text-sm text-gray-500 mt-1">
            {state.is2FAEnabled
              ? "2FA is currently enabled via SMS"
              : "Add an extra layer of security to your account"}
          </p>
          {state.is2FAEnabled && (
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
