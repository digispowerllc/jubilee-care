// File: src/app/agent/profile/AgentProfileClient.tsx
"use client";

import { useState } from "react";
import { AvatarUpload } from "@/components/global/AvatarUpload";
import { TabController } from "./components/tabs/TabController";
import {
  Overview,
  PersonalTab,
  IdentificationTab,
  ContactTab,
  AddressTab,
  SecurityTab,
  PreferencesTab,
} from "./components/tabs";
import { TabType, AgentProfileData } from "./types";
import { useRouter } from "next/navigation";
import {
  FiHome,
  FiUser,
  FiCreditCard,
  FiMail,
  FiMapPin,
  FiShield,
  FiSettings,
} from "react-icons/fi";

interface Props {
  profileData: AgentProfileData;
}

export default function AgentProfileClient({ profileData }: Props) {
  const [state, setState] = useState({
    activeTab: "overview" as TabType,
    isEditingPassword: false,
    isEditingPIN: false,
    is2FAEnabled: false,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    newPIN: "",
    confirmPIN: "",
    pinVerified: true,
  });

  const router = useRouter();
  const [controller] = useState(() => {
    const tempController = {} as TabController;
    return new TabController(
      state,
      (partialState: Partial<typeof state>) =>
        setState((prev) => ({ ...prev, ...partialState })),
      tempController,
      router
    );
  });

  const tabs: { value: TabType; label: string; icon: React.ElementType }[] = [
    { value: "overview", label: "Overview", icon: FiHome },
    { value: "personal", label: "Personal", icon: FiUser },
    { value: "identification", label: "ID", icon: FiCreditCard },
    { value: "contact", label: "Contact", icon: FiMail },
    { value: "address", label: "Address", icon: FiMapPin },
    { value: "security", label: "Security", icon: FiShield },
    { value: "preferences", label: "Preferences", icon: FiSettings },
  ];

  const renderTab = () => {
    switch (state.activeTab) {
      case "overview":
        return (
          <Overview
            profileData={{
              ...profileData,
              emailVerified: profileData.emailVerified ?? new Date(0),
            }}
            controller={controller}
          />
        );
      case "personal":
        return (
          <PersonalTab profileData={profileData} controller={controller} />
        );
      case "identification":
        return (
          <IdentificationTab
            profileData={profileData}
            controller={controller}
          />
        );
      case "contact":
        return <ContactTab profileData={profileData} controller={controller} />;
      case "address":
        return <AddressTab profileData={profileData} controller={state} />;
      case "security":
        return (
          <SecurityTab
            profileData={profileData}
            controller={controller}
            router={router}
          />
        );
      case "preferences":
        return (
          <PreferencesTab profileData={profileData} controller={controller} />
        );
      default:
        return (
          <Overview
            profileData={{
              ...profileData,
              emailVerified: profileData.emailVerified ?? new Date(0),
            }}
            controller={controller}
          />
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <header className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <AvatarUpload
          initialAvatarUrl={profileData.avatarUrl}
          initials={`${profileData.surname?.charAt(0)}${profileData.firstName?.charAt(0)}`}
          fullName={`${profileData.surname} ${profileData.firstName}`}
          agentId={profileData.agentId}
        />
      </header>

      {/* Tab Navigation */}
      <div className="mb-6">
        {/* Mobile - Icons Only */}
        <div className="sm:hidden flex justify-around border-b border-gray-200 pb-2">
          {tabs.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => controller.switchTab(value)}
              className={`p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                state.activeTab === value
                  ? "text-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              aria-label={label}
            >
              <Icon className="h-6 w-6" />
            </button>
          ))}
        </div>

        {/* Desktop - Icons with Labels */}
        <div className="hidden sm:flex border-b border-gray-200">
          <ul className="flex w-full">
            {tabs.map(({ value, label, icon: Icon }) => (
              <li key={value} className="flex-1">
                <button
                  onClick={() => controller.switchTab(value)}
                  className={`w-full py-3 px-4 border-b-2 font-medium text-sm flex flex-col items-center gap-1 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                    state.activeTab === value
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Active Tab Content */}
      {renderTab()}
    </div>
  );
}
