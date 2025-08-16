// File: src/app/agent/profile/ProfileTabs.tsx
"use client";

import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { OverviewTab } from "@/components/profile/tabs/OverviewTab";
import { PersonalTab } from "@/components/profile/tabs/PersonalTab";
import { ContactTab } from "@/components/profile/tabs/ContactTab";
import { AddressTab } from "@/components/profile/tabs/AddressTab";
import { SecurityTab } from "@/components/profile/tabs/SecurityTab";
import { PreferencesTab } from "@/components/profile/tabs/PreferencesTab";
import { IdentificationTab } from "@/components/profile/tabs/IdentificationTab";
import { PINModal } from "@/components/profile/modals/PINModal";
import { UnprotectedData } from "@/lib/types/profileTypes";
import {
  FiActivity,
  FiUser,
  FiMail,
  FiMapPin,
  FiShield,
  FiCreditCard,
  FiSettings,
} from "react-icons/fi";

export function ProfileTabs({
  unprotectedData,
}: {
  unprotectedData: UnprotectedData;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const [showPINModal, setShowPINModal] = useState(false);
  const [pinModalPurpose, setPinModalPurpose] = useState<
    "viewNIN" | "viewPhone" | ""
  >("");

  return (
    <>
      <PINModal
        isOpen={showPINModal}
        onClose={() => setShowPINModal(false)}
        purpose={pinModalPurpose}
      />

      <TabGroup
        onChange={(index) => {
          const tabs = [
            "Overview",
            "Personal",
            "Identification",
            "Contact",
            "Address",
            "Security",
            "Preferences",
          ];
          setActiveTab(tabs[index]);
        }}
      >
        <TabList className="flex overflow-x-auto py-2 space-x-1 rounded-xl bg-gray-100 p-1 mb-6 scrollbar-hide">
          {[
            {
              name: "Overview",
              icon: (
                <FiActivity className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
              ),
            },
            {
              name: "Personal",
              icon: <FiUser className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />,
            },
            {
              name: "Identification",
              icon: (
                <FiCreditCard className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
              ),
            },
            {
              name: "Contact",
              icon: <FiMail className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />,
            },
            {
              name: "Address",
              icon: <FiMapPin className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />,
            },
            {
              name: "Security",
              icon: <FiShield className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />,
            },
            {
              name: "Preferences",
              icon: (
                <FiSettings className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
              ),
            },
          ].map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                `flex-shrink-0 py-2 px-3 md:py-3 md:px-4 rounded-lg text-xs md:text-sm font-medium leading-5 flex items-center justify-center outline-none transition-all duration-200 ${
                  selected
                    ? "bg-white text-primary shadow-lg ring-2 ring-primary ring-opacity-60"
                    : "text-gray-600 hover:bg-white/[0.12] hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                }`
              }
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.name}</span>
            </Tab>
          ))}
        </TabList>

        <TabPanels className="mt-2">
          <TabPanel>
            <OverviewTab data={unprotectedData} />
          </TabPanel>
          <TabPanel>
            <PersonalTab data={unprotectedData} />
          </TabPanel>
          <TabPanel>
            <IdentificationTab
              data={unprotectedData}
              onRequestPINVerification={() => {
                setPinModalPurpose("viewNIN");
                setShowPINModal(true);
              }}
            />
          </TabPanel>
          <TabPanel>
            <ContactTab
              data={unprotectedData}
              onRequestPINVerification={(purpose) => {
                setPinModalPurpose(purpose);
                setShowPINModal(true);
              }}
            />
          </TabPanel>
          <TabPanel>
            <AddressTab data={unprotectedData} />
          </TabPanel>
          <TabPanel>
            <SecurityTab router={router} />
          </TabPanel>
          <TabPanel>
            <PreferencesTab />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </>
  );
}
