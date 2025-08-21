"use client";

import { TabType } from "../../types";

interface ProfileTabsNavProps {
  tabs: { value: TabType; label: string; icon: React.ElementType }[];
  currentTab: TabType;
  onSwitchTab: (tab: TabType) => void;
}

export default function ProfileTabsNav({
  tabs,
  currentTab,
  onSwitchTab,
}: ProfileTabsNavProps) {
  return (
    <div className="mb-6">
      {/* Mobile - Horizontal Scroll */}
      {/* Alternative: Grid Layout for Mobile */}
      <div className="sm:hidden grid grid-cols-3 gap-2">
        {tabs.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => onSwitchTab(value)}
            className={`relative flex flex-col items-center p-2 text-xs font-medium transition-all duration-200 rounded-lg ${
              currentTab === value
                ? "bg-blue-50 text-blue-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
            aria-label={label}
          >
            <Icon
              className={`h-4 w-4 mb-1 ${
                currentTab === value ? "text-blue-600" : "text-gray-500"
              }`}
            />
            <span className="text-xs font-medium truncate">{label}</span>
            {currentTab === value && (
              <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Desktop */}
      <div className="hidden sm:block">
        <nav className="flex space-x-1 bg-white rounded-xl p-2 border border-gray-200 shadow-sm">
          {tabs.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => onSwitchTab(value)}
              className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg ${
                currentTab === value
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Icon
                className={`h-4 w-4 ${
                  currentTab === value ? "text-blue-600" : "text-gray-500"
                }`}
              />
              <span>{label}</span>
              {currentTab === value && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 h-0.5 bg-blue-500 rounded-full transition-all duration-300" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Progress Indicator for Desktop */}
      <div className="mt-3 hidden sm:block">
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div
            className="bg-blue-500 h-1 rounded-full transition-all duration-300"
            style={{
              width: `${((tabs.findIndex((tab) => tab.value === currentTab) + 1) / tabs.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
