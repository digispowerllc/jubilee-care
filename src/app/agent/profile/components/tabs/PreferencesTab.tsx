"use client";

import { useState } from "react";
import {
  FiBell,
  FiMoon,
  FiEye,
  FiCalendar,
  FiDollarSign,
  FiSettings,
} from "react-icons/fi";
import { AgentProfileData } from "../../types";
import { TabController } from "./TabController";

// PreferencesTab component
interface PreferencesTabProps {
  profileData: AgentProfileData;
  controller: TabController;
}

export { PreferencesTab };

const PreferencesTab: React.FC<PreferencesTabProps> = ({
  profileData,
  controller,
}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [defaultView, setDefaultView] = useState("dashboard");
  const [commissionDisplay, setCommissionDisplay] = useState("percentage");

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 p-3 rounded-full border border-gray-200">
            <FiSettings className="h-6 w-6 text-gray-600" />
          </div>
          <div className="ml-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Agent Preferences
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Customize your workspace
            </p>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiBell className="h-5 w-5 text-gray-600" />
              <h3 className="ml-3 text-base font-medium text-gray-900">
                Activity Notifications
              </h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notificationsEnabled}
                onChange={() => setNotificationsEnabled(!notificationsEnabled)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              {notificationsEnabled
                ? "You'll receive alerts for new leads and transactions"
                : "Notifications are disabled"}
            </p>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiMoon className="h-5 w-5 text-gray-600" />
              <h3 className="ml-3 text-base font-medium text-gray-900">
                Dark Mode
              </h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={darkModeEnabled}
                onChange={() => setDarkModeEnabled(!darkModeEnabled)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
