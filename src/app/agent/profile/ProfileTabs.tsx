"use client";

import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";
import {
  FiUser,
  FiLock,
  FiMail,
  FiMapPin,
  FiShield,
  FiActivity,
  FiEdit2,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface UnprotectedData {
  firstName: string;
  surname: string;
  otherName: string | null;
  email: string;
  phone: string;
  nin: string;
  state: string;
  lga: string;
  address: string;
  emailVerified: boolean;
  memberSince?: Date;
  profilePicture?: string;
}

export function ProfileTabs({
  unprotectedData,
}: {
  unprotectedData: UnprotectedData;
}) {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [pinVerified, setPinVerified] = useState(false);
  const [showNIN, setShowNIN] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingPIN, setIsEditingPIN] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPIN, setNewPIN] = useState("");
  const [confirmPIN, setConfirmPIN] = useState("");

  const maskData = (data: string) => {
    return "•".repeat(data.length);
  };

  const verifyPIN = () => {
    // In a real app, you would verify the PIN against the stored hash
    setPinVerified(true);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Add password update logic here
    setIsEditingPassword(false);
    router.refresh();
  };

  const handlePINUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Add PIN update logic here
    setIsEditingPIN(false);
    setPinVerified(false);
    router.refresh();
  };

  return (
    <TabGroup>
      <TabList className="flex overflow-x-auto py-2 space-x-1 rounded-xl bg-gray-100 p-1 mb-6 scrollbar-hide">
        {[
          {
            name: "Overview",
            icon: <FiActivity className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />,
          },
          {
            name: "Personal",
            icon: <FiUser className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />,
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
        ].map((tab) => (
          <Tab
            key={tab.name}
            className={({ selected }) =>
              `flex-shrink-0 py-2 px-3 md:py-3 md:px-4 rounded-lg text-xs md:text-sm font-medium leading-5 flex items-center justify-center outline-none transition-all duration-200 ${
                selected
                  ? "bg-white text-primary shadow ring-2 ring-primary ring-opacity-60"
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
        {/* Overview Tab */}
        <TabPanel className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 md:mb-4">
                  Account Summary
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">
                      {unprotectedData.firstName} {unprotectedData.surname}
                      {unprotectedData.otherName &&
                        ` ${unprotectedData.otherName}`}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium">
                      {unprotectedData.memberSince?.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 md:mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-start gap-2 md:gap-3">
                    <div className="bg-blue-100 p-1.5 md:p-2 rounded-full">
                      <FiUser className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-medium">
                        Profile updated
                      </p>
                      <p className="text-xs text-gray-500">Today</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 md:mb-4">
                Security Status
              </h3>
              <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email Verification</span>
                    {unprotectedData.emailVerified ? (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Verified
                      </span>
                    ) : (
                      <button className="text-primary text-sm font-medium">
                        Verify Now
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">2FA Status</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        is2FAEnabled
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {is2FAEnabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">PIN Protection</span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>

        {/* Personal Info Tab */}
        <TabPanel className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 md:mb-6">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <div className="p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {unprotectedData.firstName}
                </div>
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Surname
                </label>
                <div className="p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {unprotectedData.surname}
                </div>
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Other Name
                </label>
                <div className="p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {unprotectedData.otherName || "Not provided"}
                </div>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  NIN
                </label>
                <div className="p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
                  {pinVerified && showNIN ? (
                    <span>{unprotectedData.nin}</span>
                  ) : (
                    <span>{maskData(unprotectedData.nin)}</span>
                  )}
                  <button
                    onClick={() => {
                      if (!pinVerified) {
                        const enteredPin = prompt("Enter your PIN to view NIN");
                        if (enteredPin) {
                          verifyPIN();
                          setShowNIN(true);
                        }
                      } else {
                        setShowNIN(!showNIN);
                      }
                    }}
                    className="text-primary hover:text-primary-dark"
                  >
                    {pinVerified && showNIN ? (
                      <FiEyeOff size={16} />
                    ) : (
                      <FiEye size={16} />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Member Since
                </label>
                <div className="p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {unprotectedData.memberSince?.toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </TabPanel>

        {/* Contact Info Tab */}
        <TabPanel className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 md:mb-6">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {unprotectedData.email}
                </div>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
                  {pinVerified && showPhone ? (
                    <span>{unprotectedData.phone}</span>
                  ) : (
                    <span>{maskData(unprotectedData.phone)}</span>
                  )}
                  <button
                    onClick={() => {
                      if (!pinVerified) {
                        const enteredPin = prompt(
                          "Enter your PIN to view phone number"
                        );
                        if (enteredPin) {
                          verifyPIN();
                          setShowPhone(true);
                        }
                      } else {
                        setShowPhone(!showPhone);
                      }
                    }}
                    className="text-primary hover:text-primary-dark"
                  >
                    {pinVerified && showPhone ? (
                      <FiEyeOff size={16} />
                    ) : (
                      <FiEye size={16} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>

        {/* Address Tab */}
        <TabPanel className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 md:mb-6">
            Address Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <div className="p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {unprotectedData.state}
                </div>
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  LGA
                </label>
                <div className="p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {unprotectedData.lga}
                </div>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Full Address
                </label>
                <div className="p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[80px] md:min-h-[100px]">
                  {unprotectedData.address}
                </div>
              </div>
            </div>
          </div>
        </TabPanel>

        {/* Security Tab */}
        <TabPanel className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 md:mb-6">
            Security Settings
          </h3>
          <div className="space-y-4 md:space-y-6">
            {/* Password Update */}
            <div className="p-3 md:p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-1 md:mb-2">
                <h4 className="text-sm md:text-base font-medium">Password</h4>
                {!isEditingPassword ? (
                  <button
                    onClick={() => setIsEditingPassword(true)}
                    className="text-primary text-xs md:text-sm font-medium flex items-center gap-1"
                  >
                    <FiEdit2 size={14} /> Change
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingPassword(false)}
                    className="text-gray-500 text-xs md:text-sm font-medium"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {isEditingPassword ? (
                <form
                  onSubmit={handlePasswordUpdate}
                  className="mt-3 space-y-3"
                >
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                      minLength={8}
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition"
                  >
                    Update Password
                  </button>
                </form>
              ) : (
                <p className="text-xs md:text-sm text-gray-600">
                  Last changed 3 months ago
                </p>
              )}
            </div>

            {/* PIN Update */}
            <div className="p-3 md:p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-1 md:mb-2">
                <h4 className="text-sm md:text-base font-medium">
                  Transaction PIN
                </h4>
                {!isEditingPIN ? (
                  <button
                    onClick={() => setIsEditingPIN(true)}
                    className="text-primary text-xs md:text-sm font-medium flex items-center gap-1"
                  >
                    <FiEdit2 size={14} /> {pinVerified ? "Change" : "Set"} PIN
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingPIN(false)}
                    className="text-gray-500 text-xs md:text-sm font-medium"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {isEditingPIN ? (
                <form onSubmit={handlePINUpdate} className="mt-3 space-y-3">
                  {pinVerified && (
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                        Current PIN
                      </label>
                      <input
                        type="password"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={pin}
                        onChange={(e) =>
                          setPin(e.target.value.replace(/\D/g, ""))
                        }
                        className="w-full p-2 border border-gray-300 rounded-md"
                        maxLength={4}
                        required
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      New PIN
                    </label>
                    <input
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={newPIN}
                      onChange={(e) =>
                        setNewPIN(e.target.value.replace(/\D/g, ""))
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                      maxLength={4}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      Confirm PIN
                    </label>
                    <input
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={confirmPIN}
                      onChange={(e) =>
                        setConfirmPIN(e.target.value.replace(/\D/g, ""))
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                      maxLength={4}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition"
                  >
                    {pinVerified ? "Update PIN" : "Set PIN"}
                  </button>
                </form>
              ) : (
                <p className="text-xs md:text-sm text-gray-600">
                  {pinVerified ? "PIN is set" : "No PIN set"}
                </p>
              )}
            </div>

            {/* 2FA */}
            <div className="p-3 md:p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm md:text-base font-medium">
                    Two-Factor Authentication
                  </h4>
                  <p className="text-xs md:text-sm text-gray-600">
                    {is2FAEnabled ? "Enabled" : "Disabled"} - Add an extra layer
                    of security
                  </p>
                </div>
                <button
                  onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    is2FAEnabled ? "bg-primary" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      is2FAEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              {is2FAEnabled && (
                <div className="mt-3 text-xs md:text-sm text-green-600">
                  Two-factor authentication is currently active on your account.
                </div>
              )}
            </div>

            {/* Danger Zone */}
            <div className="p-3 md:p-4 border border-red-100 bg-red-50 rounded-lg">
              <div className="flex justify-between items-center mb-1 md:mb-2">
                <h4 className="text-sm md:text-base font-medium text-red-800">
                  Danger Zone
                </h4>
              </div>
              <p className="text-xs md:text-sm text-red-600 mb-2 md:mb-3">
                These actions are irreversible
              </p>
              <button className="text-xs md:text-sm font-medium text-red-600 border border-red-200 px-2 py-1.5 md:px-3 md:py-2 rounded-lg hover:bg-red-100">
                Deactivate Account
              </button>
            </div>
          </div>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
