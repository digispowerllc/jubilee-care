// File: app/agent/profile/tabs/PreferencesTab.tsx
"use client";

import { useState } from "react";
import {
  FiBell,
  FiMoon,
  FiSettings,
  FiEye,
  FiGlobe,
  FiCalendar,
  FiMessageSquare,
  FiShield,
} from "react-icons/fi";

type PreferencesTabProps = object;

const PreferencesTab: React.FC<PreferencesTabProps> = () => {
  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true,
      leads: true,
      transactions: true,
      reminders: false,
    },
    appearance: {
      darkMode: false,
      fontSize: "medium",
      density: "comfortable",
    },
    privacy: {
      profileVisibility: "agents",
      activityStatus: true,
      readReceipts: false,
    },
    language: "english",
    timezone: "UTC+1",
  });

  type PreferenceValue =
    | boolean
    | string;

  const updatePreference = (
    category: string,
    key: string,
    value: PreferenceValue
  ) => {
    setPreferences((prev) => {
      // If the category is an object, spread and update the key
      if (typeof prev[category as keyof typeof prev] === "object" && prev[category as keyof typeof prev] !== null) {
        return {
          ...prev,
          [category]: {
            ...(prev[category as keyof typeof prev] as object),
            [key]: value,
          },
        };
      } else {
        // For primitive values, update directly
        return {
          ...prev,
          [category]: value,
        };
      }
    });
  };

  const preferenceSections = [
    {
      id: "notifications",
      title: "Notification Preferences",
      icon: FiBell,
      description: "Manage how you receive alerts and updates",
      settings: [
        {
          id: "email",
          label: "Email Notifications",
          description: "Receive important updates via email",
          type: "toggle",
          value: preferences.notifications.email,
        },
        {
          id: "sms",
          label: "SMS Alerts",
          description: "Get critical alerts via text message",
          type: "toggle",
          value: preferences.notifications.sms,
        },
        {
          id: "push",
          label: "Push Notifications",
          description: "Enable app notifications on your device",
          type: "toggle",
          value: preferences.notifications.push,
        },
        {
          id: "leads",
          label: "New Lead Alerts",
          description: "Get notified about new potential clients",
          type: "toggle",
          value: preferences.notifications.leads,
        },
        {
          id: "transactions",
          label: "Transaction Updates",
          description: "Stay informed about your deals",
          type: "toggle",
          value: preferences.notifications.transactions,
        },
      ],
    },
    {
      id: "appearance",
      title: "Appearance & Display",
      icon: FiEye,
      description: "Customize how your workspace looks and feels",
      settings: [
        {
          id: "darkMode",
          label: "Dark Mode",
          description: "Switch between light and dark themes",
          type: "toggle",
          value: preferences.appearance.darkMode,
        },
        {
          id: "fontSize",
          label: "Font Size",
          description: "Adjust text size for better readability",
          type: "select",
          value: preferences.appearance.fontSize,
          options: [
            { value: "small", label: "Small" },
            { value: "medium", label: "Medium" },
            { value: "large", label: "Large" },
            { value: "xlarge", label: "Extra Large" },
          ],
        },
        {
          id: "density",
          label: "Interface Density",
          description: "Choose how compact your interface appears",
          type: "select",
          value: preferences.appearance.density,
          options: [
            { value: "compact", label: "Compact" },
            { value: "comfortable", label: "Comfortable" },
            { value: "spacious", label: "Spacious" },
          ],
        },
      ],
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      icon: FiShield,
      description: "Control your privacy settings and data visibility",
      settings: [
        {
          id: "profileVisibility",
          label: "Profile Visibility",
          description: "Who can see your profile information",
          type: "select",
          value: preferences.privacy.profileVisibility,
          options: [
            { value: "public", label: "Everyone" },
            { value: "agents", label: "Agents Only" },
            { value: "private", label: "Only Me" },
          ],
        },
        {
          id: "activityStatus",
          label: "Show Activity Status",
          description: "Let others see when you're active",
          type: "toggle",
          value: preferences.privacy.activityStatus,
        },
        {
          id: "readReceipts",
          label: "Read Receipts",
          description: "Send read receipts for messages",
          type: "toggle",
          value: preferences.privacy.readReceipts,
        },
      ],
    },
    {
      id: "language",
      title: "Language & Region",
      icon: FiGlobe,
      description: "Set your preferred language and timezone",
      settings: [
        {
          id: "language",
          label: "Language",
          description: "Choose your preferred interface language",
          type: "select",
          value: preferences.language,
          options: [
            { value: "english", label: "English" },
            { value: "spanish", label: "Spanish" },
            { value: "french", label: "French" },
          ],
        },
        {
          id: "timezone",
          label: "Timezone",
          description: "Set your local timezone for accurate scheduling",
          type: "select",
          value: preferences.timezone,
          options: [
            { value: "UTC+0", label: "GMT (UTC+0)" },
            { value: "UTC+1", label: "CET (UTC+1)" },
            { value: "UTC-5", label: "EST (UTC-5)" },
            { value: "UTC-8", label: "PST (UTC-8)" },
          ],
        },
      ],
    },
  ];

  const ToggleSwitch = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: (checked: boolean) => void;
  }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-300"></div>
      <span className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 peer-checked:translate-x-5"></span>
    </label>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center">
          <div className="flex-shrink-0 p-3 rounded-xl bg-white shadow-sm border border-blue-200">
            <FiSettings className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Agent Preferences
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Customize your workspace and notification settings
            </p>
          </div>
        </div>
      </div>

      {/* Preferences Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {preferenceSections.map((section) => (
          <div
            key={section.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-blue-100">
                  <section.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-base font-semibold text-gray-900">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                {section.settings.map((setting) => (
                  <div
                    key={setting.id}
                    className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {setting.label}
                      </p>
                      <p className="text-xs text-gray-500">
                        {setting.description}
                      </p>
                    </div>

                    {setting.type === "toggle" ? (
                      <ToggleSwitch
                        checked={setting.value as boolean}
                        onChange={(value) =>
                          updatePreference(section.id, setting.id, value)
                        }
                      />
                    ) : setting.type === "select" ? (
                      <select
                        value={setting.value as string}
                        onChange={(e) =>
                          updatePreference(
                            section.id,
                            setting.id,
                            e.target.value
                          )
                        }
                        className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {setting.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
            <FiCalendar className="h-5 w-5 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">
              Set Availability
            </span>
          </button>
          <button className="p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
            <FiMessageSquare className="h-5 w-5 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">
              Message Templates
            </span>
          </button>
          <button className="p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
            <FiShield className="h-5 w-5 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">
              Privacy Settings
            </span>
          </button>
        </div>
      </div>

      {/* Preferences Summary */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="flex items-start">
          <div className="flex-shrink-0 p-2">
            <FiSettings className="h-5 w-5 text-gray-400" />
          </div>
          <div className="ml-4">
            <h4 className="text-sm font-medium text-gray-900">
              Preferences Summary
            </h4>
            <div className="mt-2 text-sm text-gray-600 space-y-1">
              <p>
                • Notifications:{" "}
                {preferences.notifications.email ? "Email" : ""}{" "}
                {preferences.notifications.sms ? "SMS" : ""}{" "}
                {preferences.notifications.push ? "Push" : ""}
              </p>
              <p>
                • Appearance:{" "}
                {preferences.appearance.darkMode ? "Dark" : "Light"} mode,{" "}
                {preferences.appearance.fontSize} text
              </p>
              <p>
                • Language: {preferences.language}, Timezone:{" "}
                {preferences.timezone}
              </p>
              <p>
                • Privacy: Profile visible to{" "}
                {preferences.privacy.profileVisibility}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PreferencesTab };
