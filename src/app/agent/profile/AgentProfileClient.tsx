"use client";

import { useState, useMemo } from "react";
import { createTabController } from "./controllers/TabController";
import {
  OverviewTab,
  PersonalTab,
  IdentificationTab,
  ContactTab,
  AddressTab,
  SecurityTab,
  PreferencesTab,
} from "./components/tabs";
import {
  TabType,
  SecurityHandlers,
  PasswordChangeRequest,
  PINChangeRequest,
  TwoFARequest,
  AgentFullDataExtended,
} from "./types";
import {
  FiHome,
  FiUser,
  FiCreditCard,
  FiMail,
  FiMapPin,
  FiShield,
  FiSettings,
} from "react-icons/fi";

import ProfileHeader from "./components/tabs/ProfileHeader";
import ProfileTabsNav from "./components/tabs/ProfileTabsNav";

interface Props {
  profileData: AgentFullDataExtended;
  useController?: boolean;
}

const DEFAULT_TAB: TabType = "overview";

export default function AgentProfileClient({
  profileData,
  useController = true,
}: Props) {
  const { profile: agentRaw } = profileData;
  const agent = {
    ...agentRaw,
    surname: agentRaw.surname ?? "",
    firstName: agentRaw.firstName ?? "",
    memberSince: agentRaw.memberSince
      ? typeof agentRaw.memberSince === "string"
        ? agentRaw.memberSince
        : (agentRaw.memberSince as Date).toISOString()
      : undefined,
  };
  const [activeTab, setActiveTab] = useState<TabType>(DEFAULT_TAB);

  // Create controller
  const controller = useMemo(() => createTabController(setActiveTab), []);

  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

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
    ...agent,
    emailVerified: !!agent.emailVerified,
    phoneVerified: !!agent.phoneVerified,
    memberSince:
      agentRaw.memberSince instanceof Date
        ? agentRaw.memberSince
        : agentRaw.memberSince
          ? new Date(agentRaw.memberSince)
          : new Date(), // fallback to current date if undefined
  };

  const securityHandlers: SecurityHandlers = {
    onPasswordChange: (req: PasswordChangeRequest) =>
      console.log("Password change request:", req),
    onPINChange: (req: PINChangeRequest) =>
      console.log("PIN change request:", req),
    onToggle2FA: (req: TwoFARequest) => setIs2FAEnabled(req.enable),
  };

  const commonProps = { agent, ...securityHandlers };

  const currentTab: TabType = activeTab;

  // Add required handlers for IdentificationTab
  const handleAddNIN = () => {
    console.log("Add NIN clicked");
  };

  const handleViewNIN = () => {
    console.log("View NIN clicked");
  };

  const handleUploadDocuments = (files: FileList) => {
    console.log("Upload documents:", files);
  };

  const unifiedController = useController
    ? {
        ...controller,
        handleAddNIN,
        handleViewNIN,
        handleUploadDocuments,
      }
    : {
        switchTab: setActiveTab,
        handleAddNIN,
        handleViewNIN,
        handleUploadDocuments,
      };

  const renderTab = () => {
    switch (currentTab) {
      case "overview":
        return <OverviewTab profileData={overviewData} />;
      case "personal":
        return <PersonalTab profileData={overviewData} />;
      case "identification":
        return (
          <IdentificationTab
            profileData={overviewData}
            controller={unifiedController}
          />
        );
      case "contact":
        return <ContactTab profileData={overviewData} />;
      case "address":
        return <AddressTab profileData={overviewData} />;
      case "security":
        return <SecurityTab profileData={overviewData} />;
      case "preferences":
        return (
          <PreferencesTab
            profileData={overviewData}
            controller={unifiedController}
          />
        );
      default:
        return <OverviewTab profileData={overviewData} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Profile Header */}
      <ProfileHeader agent={agent} />

      {/* Tab Navigation */}
      <ProfileTabsNav
        tabs={tabs}
        currentTab={currentTab}
        onSwitchTab={unifiedController.switchTab}
      />

      {/* Active Tab Content */}
      <div className="transition-opacity duration-300 ease-in-out">
        {renderTab()}
      </div>
    </div>
  );
}
