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
import LogoutButton from "./components/LogoutButton";

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

  const [controller] = useState(
    () =>
      new TabController(
        state,
        (partialState: Partial<typeof state>) =>
          setState((prev) => ({ ...prev, ...partialState })),
        {} as TabController,
        router
      )
  );

  const tabs: { value: TabType; label: string; icon: React.ElementType }[] = [
    { value: "overview", label: "Overview", icon: FiHome },
    { value: "personal", label: "Personal", icon: FiUser },
    { value: "identification", label: "ID", icon: FiCreditCard },
    { value: "contact", label: "Contact", icon: FiMail },
    { value: "address", label: "Address", icon: FiMapPin },
    { value: "security", label: "Security", icon: FiShield },
    { value: "preferences", label: "Preferences", icon: FiSettings },
  ];

  const overviewData = {
    ...profileData,
    emailVerified: Boolean(profileData.emailVerified),
  };

  const renderTab = () => {
    switch (state.activeTab) {
      case "overview":
        return <Overview profileData={overviewData} controller={controller} />;
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
        return <AddressTab profileData={profileData} controller={controller} />;
      case "security":
        return (
          <SecurityTab profileData={profileData} controller={controller} />
        );
      case "preferences":
        return (
          <PreferencesTab profileData={profileData} controller={controller} />
        );
      default:
        return <Overview profileData={overviewData} controller={controller} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Profile Header */}
      <header className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <AvatarUpload
          initialAvatarUrl={profileData.avatarUrl}
          initials={`${profileData.surname?.charAt(0)}${profileData.firstName?.charAt(0)}`}
          fullName={`${profileData.surname} ${profileData.firstName}`}
          agentId={profileData.agentId} // Internal use
        />

        <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-medium text-gray-900 tracking-tight">
                {profileData.surname} {profileData.firstName}
              </h1>
              {profileData.emailVerified ? (
                <span
                  className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800"
                  title="Verified Account"
                >
                  Verified
                </span>
              ) : (
                <span
                  className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800"
                  title="Unverified Account"
                >
                  Unverified
                </span>
              )}
            </div>

            <p className="text-sm text-gray-500 font-light">
              Agent ID:{" "}
              <span className="font-medium">
                {profileData.fieldId ?? profileData.agentId}
              </span>
            </p>

            {profileData.memberSince && (
              <p className="text-sm text-gray-500 font-light">
                Member since:{" "}
                {new Date(profileData.memberSince).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>

          <div className="self-start sm:self-center">
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="mb-8">
        {/* Mobile */}
        <div className="sm:hidden flex justify-between border-b border-gray-100 pb-1">
          {tabs.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => controller.switchTab(value)}
              className={`relative px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                state.activeTab === value
                  ? "text-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              aria-label={label}
            >
              <Icon className="h-5 w-5 mx-auto" />
              {state.activeTab === value && (
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
                onClick={() => controller.switchTab(value)}
                className={`group relative px-1 py-3 text-sm font-medium transition-colors duration-200 ${
                  state.activeTab === value
                    ? "text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </div>
                {state.activeTab === value && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500 transition-all duration-300" />
                )}
                {state.activeTab !== value && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-transparent group-hover:bg-gray-200 transition-all duration-300" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Active Tab Content */}
      <div className="transition-opacity duration-300 ease-in-out">
        {renderTab()}
      </div>
    </div>
  );
}
