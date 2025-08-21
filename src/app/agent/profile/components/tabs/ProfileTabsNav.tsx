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
    <div className="mb-8">
      {/* Mobile */}
      <div className="sm:hidden flex justify-between border-b border-gray-100 pb-1">
        {tabs.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => onSwitchTab(value)}
            className={`relative px-3 py-2 text-sm font-medium transition-colors duration-150 ${
              currentTab === value
                ? "text-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            aria-label={label}
          >
            <Icon className="h-5 w-5 mx-auto" />
            {currentTab === value && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Desktop */}
      <div className="hidden sm:block">
        <nav className="flex space-x-8">
          {tabs.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => onSwitchTab(value)}
              className={`group relative px-1 py-3 text-sm font-medium transition-colors duration-200 ${
                currentTab === value
                  ? "text-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </div>
              {currentTab === value && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500 transition-all duration-300" />
              )}
              {currentTab !== value && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-transparent group-hover:bg-gray-200 transition-all duration-300" />
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
