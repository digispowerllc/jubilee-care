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
  FiUsers,
  FiDollarSign,
  FiX,
  FiChevronRight,
  FiCheckCircle,
  FiPhone,
  FiLogOut,
  FiCreditCard,
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
  avatarUrl?: string;
  clients?: Array<{
    id: string;
    name: string;
    joinedDate: Date;
    status: "active" | "inactive";
  }>;
  transactions?: Array<{
    id: string;
    amount: number;
    date: Date;
    type: "deposit" | "withdrawal" | "transfer";
  }>;
}

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full animate-fade-in">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <FiX size={24} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

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
  const [showPINModal, setShowPINModal] = useState(false);
  const [pinModalPurpose, setPinModalPurpose] = useState<
    "viewNIN" | "viewPhone" | ""
  >("");
  const [activeTab, setActiveTab] = useState("Overview");

  const maskData = (data: string, visibleChars = 2) => {
    if (!data) return "";
    if (data.length <= visibleChars * 2) return "•".repeat(data.length);
    return `${data.substring(0, visibleChars)}${"•".repeat(data.length - visibleChars * 2)}${data.substring(data.length - visibleChars)}`;
  };

  const verifyPIN = (enteredPin: string) => {
    // Mock verification - in production, verify against hashed PIN
    if (enteredPin === "1234") {
      // Example PIN
      setPinVerified(true);
      return true;
    }
    return false;
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Add actual password update logic here
    setIsEditingPassword(false);
    router.refresh();
  };

  const handlePINUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Add actual PIN update logic here
    setIsEditingPIN(false);
    setPinVerified(true);
    router.refresh();
  };

  const requestPINVerification = (purpose: "viewNIN" | "viewPhone") => {
    setPinModalPurpose(purpose);
    setShowPINModal(true);
  };

  const handlePINSubmit = () => {
    if (verifyPIN(pin)) {
      setShowPINModal(false);
      if (pinModalPurpose === "viewNIN") setShowNIN(true);
      if (pinModalPurpose === "viewPhone") setShowPhone(true);
    } else {
      alert("Invalid PIN. Please try again.");
      setPin("");
    }
  };

  // Enhanced data for demonstration
  const demoClients = [
    {
      id: "1",
      name: "John Doe",
      joinedDate: new Date(),
      status: "active" as const,
    },
    {
      id: "2",
      name: "Jane Smith",
      joinedDate: new Date(Date.now() - 86400000),
      status: "active" as const,
    },
    {
      id: "3",
      name: "Robert Johnson",
      joinedDate: new Date(Date.now() - 172800000),
      status: "inactive" as const,
    },
  ];

  const demoTransactions = [
    { id: "1", amount: 1500, date: new Date(), type: "deposit" as const },
    {
      id: "2",
      amount: 500,
      date: new Date(Date.now() - 86400000),
      type: "withdrawal" as const,
    },
    {
      id: "3",
      amount: 2000,
      date: new Date(Date.now() - 172800000),
      type: "deposit" as const,
    },
  ];

  const clients = unprotectedData.clients || demoClients;
  const transactions = unprotectedData.transactions || demoTransactions;

  return (
    <>
      {/* PIN Verification Modal */}
      <Modal
        isOpen={showPINModal}
        onClose={() => {
          setShowPINModal(false);
          setPin("");
        }}
        title={`Enter PIN to View ${pinModalPurpose === "viewNIN" ? "NIN" : "Phone Number"}`}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            For security reasons, please enter your 4-digit PIN to continue.
          </p>
          <div className="relative">
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pin}
              onChange={(e) =>
                setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              className="w-full p-3 border border-gray-300 rounded-md text-center text-xl tracking-widest focus:ring-2 focus:ring-primary focus:border-transparent"
              maxLength={4}
              autoFocus
              aria-label="Enter your PIN"
            />
            {pin.length > 0 && (
              <button
                onClick={() => setPin("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear PIN"
              >
                <FiX size={18} />
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "←"].map((num) => (
              <button
                key={num}
                onClick={() => {
                  if (num === "←") {
                    setPin(pin.slice(0, -1));
                  } else if (typeof num === "number") {
                    if (pin.length < 4) {
                      setPin(pin + num.toString());
                    }
                  }
                }}
                className={`p-3 rounded-md flex items-center justify-center ${
                  typeof num === "number"
                    ? "bg-gray-100 hover:bg-gray-200"
                    : num === "←"
                      ? "bg-red-50 hover:bg-red-100 text-red-500"
                      : ""
                }`}
                disabled={num === ""}
              >
                {num === "←" ? <FiChevronRight className="rotate-180" /> : num}
              </button>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => {
                setShowPINModal(false);
                setPin("");
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePINSubmit}
              disabled={pin.length !== 4}
              className={`px-4 py-2 rounded-md transition-colors ${
                pin.length === 4
                  ? "bg-primary text-white hover:bg-primary-dark"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              Verify
            </button>
          </div>
        </div>
      </Modal>

      <TabGroup
        onChange={(index) => {
          const tabs = [
            "Overview",
            "Personal",
            "Contact",
            "Address",
            "Security",
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
          {/* Overview Tab */}
          <TabPanel className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg flex flex-col">
                      <div className="flex items-center mb-2">
                        <FiUsers className="text-blue-500 mr-2" />
                        <span className="text-sm text-gray-600">
                          Total Clients
                        </span>
                      </div>
                      <span className="text-2xl font-bold">
                        {clients.length}
                      </span>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg flex flex-col">
                      <div className="flex items-center mb-2">
                        <FiUser className="text-green-500 mr-2" />
                        <span className="text-sm text-gray-600">Active</span>
                      </div>
                      <span className="text-2xl font-bold">
                        {clients.filter((c) => c.status === "active").length}
                      </span>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg flex flex-col">
                      <div className="flex items-center mb-2">
                        <FiDollarSign className="text-purple-500 mr-2" />
                        <span className="text-sm text-gray-600">
                          This Month
                        </span>
                      </div>
                      <span className="text-2xl font-bold">
                        $
                        {transactions
                          .filter(
                            (tx) =>
                              new Date(tx.date).getMonth() ===
                              new Date().getMonth()
                          )
                          .reduce(
                            (sum, tx) =>
                              sum +
                              (tx.type === "deposit" ? tx.amount : -tx.amount),
                            0
                          )
                          .toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg flex flex-col">
                      <div className="flex items-center mb-2">
                        <FiCreditCard className="text-amber-500 mr-2" />
                        <span className="text-sm text-gray-600">
                          Total Volume
                        </span>
                      </div>
                      <span className="text-2xl font-bold">
                        $
                        {transactions
                          .reduce((sum, tx) => sum + tx.amount, 0)
                          .toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Account Summary */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">
                    Account Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status</span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Member Since</span>
                      <span className="font-medium">
                        {unprotectedData.memberSince?.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Email Verified</span>
                      {unprotectedData.emailVerified ? (
                        <FiCheckCircle className="text-green-500" />
                      ) : (
                        <button className="text-primary text-sm font-medium">
                          Verify Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Clients */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Recent Clients</h3>
                    <button className="text-primary text-sm font-medium flex items-center">
                      View All <FiChevronRight className="ml-1" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {clients.slice(0, 4).map((client) => (
                      <div
                        key={client.id}
                        className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <FiUser className="text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{client.name}</p>
                          <p className="text-sm text-gray-500">
                            Joined {client.joinedDate.toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            client.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {client.status}
                        </span>
                      </div>
                    ))}
                    {clients.length === 0 && (
                      <div className="text-center py-6 text-gray-500">
                        No clients found
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      Recent Transactions
                    </h3>
                    <button className="text-primary text-sm font-medium flex items-center">
                      View All <FiChevronRight className="ml-1" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {transactions.slice(0, 4).map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div
                          className={`p-2 rounded-full mr-3 ${
                            tx.type === "deposit"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {tx.type === "deposit" ? (
                            <FiDollarSign />
                          ) : (
                            <FiCreditCard />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium capitalize">{tx.type}</p>
                          <p className="text-sm text-gray-500">
                            {tx.date.toLocaleDateString()}
                          </p>
                        </div>
                        <p
                          className={`font-medium ${
                            tx.type === "deposit"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {tx.type === "deposit" ? "+" : "-"}$
                          {tx.amount.toLocaleString()}
                        </p>
                      </div>
                    ))}
                    {transactions.length === 0 && (
                      <div className="text-center py-6 text-gray-500">
                        No transactions found
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>

          {/* Personal Info Tab */}
          <TabPanel className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {unprotectedData.firstName}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Surname
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {unprotectedData.surname}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Other Name
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {unprotectedData.otherName || "Not provided"}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIN
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
                    {pinVerified && showNIN ? (
                      <span>{unprotectedData.nin}</span>
                    ) : (
                      <span>{maskData(unprotectedData.nin)}</span>
                    )}
                    <button
                      onClick={() => requestPINVerification("viewNIN")}
                      className="text-primary hover:text-primary-dark transition-colors"
                      aria-label={
                        pinVerified && showNIN ? "Hide NIN" : "Show NIN"
                      }
                    >
                      {pinVerified && showNIN ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member Since
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {unprotectedData.memberSince?.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>

          {/* Contact Info Tab */}
          <TabPanel className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-6">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
                    <span>{unprotectedData.email}</span>
                    {unprotectedData.emailVerified ? (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Verified
                      </span>
                    ) : (
                      <button className="text-primary text-sm font-medium">
                        Verify
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
                    {pinVerified && showPhone ? (
                      <span>{unprotectedData.phone}</span>
                    ) : (
                      <span>{maskData(unprotectedData.phone)}</span>
                    )}
                    <button
                      onClick={() => requestPINVerification("viewPhone")}
                      className="text-primary hover:text-primary-dark transition-colors"
                      aria-label={
                        pinVerified && showPhone ? "Hide phone" : "Show phone"
                      }
                    >
                      {pinVerified && showPhone ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>

          {/* Address Tab */}
          <TabPanel className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-6">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {unprotectedData.state}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LGA
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {unprotectedData.lga}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Address
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[100px]">
                    {unprotectedData.address}
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>

          {/* Security Tab */}
          <TabPanel className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-6">Security Settings</h3>
            <div className="space-y-6">
              {/* Password Update */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
                  <div>
                    <h4 className="font-medium">Password</h4>
                    <p className="text-sm text-gray-600">
                      Last changed 3 months ago
                    </p>
                  </div>
                  {!isEditingPassword ? (
                    <button
                      onClick={() => setIsEditingPassword(true)}
                      className="text-primary text-sm font-medium flex items-center gap-1"
                    >
                      <FiEdit2 size={14} /> Change
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditingPassword(false)}
                      className="text-gray-500 text-sm font-medium"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {isEditingPassword ? (
                  <form
                    onSubmit={handlePasswordUpdate}
                    className="p-4 space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                        minLength={8}
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                        placeholder="Confirm new password"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-primary text-white px-4 py-3 rounded-md hover:bg-primary-dark transition font-medium"
                    >
                      Update Password
                    </button>
                  </form>
                ) : (
                  <div className="p-4 text-sm text-gray-600">
                    Ensure your password is strong and unique. We recommend
                    using a mix of letters, numbers, and symbols.
                  </div>
                )}
              </div>

              {/* PIN Update */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
                  <div>
                    <h4 className="font-medium">Transaction PIN</h4>
                    <p className="text-sm text-gray-600">
                      {pinVerified ? "PIN is set" : "No PIN set"}
                    </p>
                  </div>
                  {!isEditingPIN ? (
                    <button
                      onClick={() => setIsEditingPIN(true)}
                      className="text-primary text-sm font-medium flex items-center gap-1"
                    >
                      <FiEdit2 size={14} /> {pinVerified ? "Change" : "Set"} PIN
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditingPIN(false)}
                      className="text-gray-500 text-sm font-medium"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {isEditingPIN ? (
                  <form onSubmit={handlePINUpdate} className="p-4 space-y-4">
                    {pinVerified && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
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
                          className="w-full p-3 border border-gray-300 rounded-md text-center text-xl tracking-widest focus:ring-2 focus:ring-primary focus:border-transparent"
                          maxLength={4}
                          required
                          placeholder="Enter current PIN"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {pinVerified ? "New PIN" : "Set PIN"}
                      </label>
                      <input
                        type="password"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={newPIN}
                        onChange={(e) =>
                          setNewPIN(e.target.value.replace(/\D/g, ""))
                        }
                        className="w-full p-3 border border-gray-300 rounded-md text-center text-xl tracking-widest focus:ring-2 focus:ring-primary focus:border-transparent"
                        maxLength={4}
                        required
                        placeholder="Enter 4-digit PIN"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm {pinVerified ? "New PIN" : "PIN"}
                      </label>
                      <input
                        type="password"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={confirmPIN}
                        onChange={(e) =>
                          setConfirmPIN(e.target.value.replace(/\D/g, ""))
                        }
                        className="w-full p-3 border border-gray-300 rounded-md text-center text-xl tracking-widest focus:ring-2 focus:ring-primary focus:border-transparent"
                        maxLength={4}
                        required
                        placeholder="Confirm 4-digit PIN"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-primary text-white px-4 py-3 rounded-md hover:bg-primary-dark transition font-medium"
                    >
                      {pinVerified ? "Update PIN" : "Set PIN"}
                    </button>
                  </form>
                ) : (
                  <div className="p-4 text-sm text-gray-600">
                    Your PIN is used to authorize sensitive actions. Never share
                    your PIN with anyone.
                  </div>
                )}
              </div>

              {/* 2FA */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">
                      {is2FAEnabled ? "Enabled" : "Disabled"} - Add an extra
                      layer of security
                    </p>
                  </div>
                  <button
                    onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      is2FAEnabled ? "bg-primary" : "bg-gray-200"
                    }`}
                    aria-label={`${is2FAEnabled ? "Disable" : "Enable"} two-factor authentication`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        is2FAEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <div className="p-4">
                  {is2FAEnabled ? (
                    <div className="text-sm text-green-600">
                      Two-factor authentication is currently active on your
                      account.
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">
                      Enhance your account security by enabling two-factor
                      authentication.
                    </div>
                  )}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="border border-red-200 rounded-lg overflow-hidden bg-red-50">
                <div className="p-4 border-b border-red-200">
                  <h4 className="font-medium text-red-800">Danger Zone</h4>
                  <p className="text-sm text-red-600">
                    These actions are irreversible. Proceed with caution.
                  </p>
                </div>
                <div className="p-4 space-y-3">
                  <button className="w-full text-left p-3 bg-white rounded-md border border-red-200 text-red-600 hover:bg-red-100 transition-colors flex justify-between items-center">
                    <span>Deactivate Account</span>
                    <FiChevronRight />
                  </button>
                  <button className="w-full text-left p-3 bg-white rounded-md border border-red-200 text-red-600 hover:bg-red-100 transition-colors flex justify-between items-center">
                    <span>Request Data Deletion</span>
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </>
  );
}
