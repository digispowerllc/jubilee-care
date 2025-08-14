"use client";

import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";
import { FiUser, FiLock, FiMail, FiMapPin, FiShield, FiActivity } from "react-icons/fi";

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

export function ProfileTabs({ unprotectedData }: { unprotectedData: UnprotectedData }) {
  return (
    <TabGroup>
      <TabList className="flex overflow-x-auto py-2 space-x-1 rounded-xl bg-gray-100 p-1 mb-6">
        {[
          { name: "Overview", icon: <FiActivity className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" /> },
          { name: "Personal", icon: <FiUser className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" /> },
          { name: "Contact", icon: <FiMail className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" /> },
          { name: "Address", icon: <FiMapPin className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" /> },
          { name: "Security", icon: <FiShield className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" /> },
        ].map((tab) => (
          <Tab
            key={tab.name}
            className="flex-shrink-0 py-2 px-3 md:py-3 md:px-4 rounded-lg text-xs md:text-sm font-medium leading-5 flex items-center justify-center ui-selected:bg-white ui-selected:text-primary ui-selected:shadow ui-not-selected:text-gray-600 ui-not-selected:hover:bg-white/[0.12] ui-not-selected:hover:text-gray-800"
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
                <h3 className="text-lg font-semibold mb-3 md:mb-4">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="bg-blue-50 p-3 md:p-4 rounded-lg">
                    <p className="text-xs md:text-sm text-gray-600">Transactions</p>
                    <p className="text-xl md:text-2xl font-bold">24</p>
                  </div>
                  <div className="bg-green-50 p-3 md:p-4 rounded-lg">
                    <p className="text-xs md:text-sm text-gray-600">Clients</p>
                    <p className="text-xl md:text-2xl font-bold">12</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 md:mb-4">Recent Activity</h3>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-start gap-2 md:gap-3">
                    <div className="bg-blue-100 p-1.5 md:p-2 rounded-full">
                      <FiUser className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-medium">New client registered</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 md:gap-3">
                    <div className="bg-green-100 p-1.5 md:p-2 rounded-full">
                      <FiMail className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-medium">Password updated</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 md:mb-4">Account Status</h3>
              <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                <div className="mb-3 md:mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs md:text-sm font-medium">Profile Completion</span>
                    <span className="text-xs md:text-sm font-medium">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 md:h-2.5">
                    <div className="bg-primary h-full rounded-full" style={{width: '85%'}}></div>
                  </div>
                </div>
                
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm">Email Verification</span>
                    {unprotectedData.emailVerified ? (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Verified</span>
                    ) : (
                      <button className="text-primary text-xs md:text-sm font-medium">Verify Now</button>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm">2FA Enabled</span>
                    <button className="text-primary text-xs md:text-sm font-medium">Enable</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm">PIN Set</span>
                    <button className="text-primary text-xs md:text-sm font-medium">Set PIN</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
        
        {/* Personal Info Tab */}
        <TabPanel className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 md:mb-6">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">First Name</label>
                <div className="p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {unprotectedData.firstName}
                </div>
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Surname</label>
                <div className="p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {unprotectedData.surname}
                </div>
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Other Name</label>
                <div className="p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {unprotectedData.otherName || "Not provided"}
                </div>
              </div>
            </div>
            
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">NIN</label>
                <div className="p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {unprotectedData.nin}
                </div>
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Member Since</label>
                <div className="p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {unprotectedData.memberSince?.toLocaleDateString()}
                </div>
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Account Status</label>
                <div className="p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {unprotectedData.emailVerified ? "Verified" : "Pending Verification"}
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
        
        {/* Contact Info Tab */}
        <TabPanel className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 md:mb-6">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
                  <span className="text-xs md:text-sm">{unprotectedData.email}</span>
                  {unprotectedData.emailVerified ? (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Verified</span>
                  ) : (
                    <button className="text-primary text-xs md:text-sm font-medium">Verify</button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {unprotectedData.phone}
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
        
        {/* Address Tab */}
        <TabPanel className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 md:mb-6">Address Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">State</label>
                <div className="p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {unprotectedData.state}
                </div>
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">LGA</label>
                <div className="p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {unprotectedData.lga}
                </div>
              </div>
            </div>
            
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Full Address</label>
                <div className="p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[80px] md:min-h-[100px]">
                  {unprotectedData.address}
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
        
        {/* Security Tab */}
        <TabPanel className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 md:mb-6">Security Settings</h3>
          <div className="space-y-4 md:space-y-6">
            <div className="p-3 md:p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-1 md:mb-2">
                <h4 className="text-sm md:text-base font-medium">Password</h4>
                <button className="text-primary text-xs md:text-sm font-medium">Change Password</button>
              </div>
              <p className="text-xs md:text-sm text-gray-600">Last changed 3 months ago</p>
            </div>
            
            <div className="p-3 md:p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-1 md:mb-2">
                <h4 className="text-sm md:text-base font-medium">Transaction PIN</h4>
                <button className="text-primary text-xs md:text-sm font-medium">Set PIN</button>
              </div>
              <p className="text-xs md:text-sm text-gray-600">No PIN set</p>
            </div>
            
            <div className="p-3 md:p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-1 md:mb-2">
                <h4 className="text-sm md:text-base font-medium">Two-Factor Authentication</h4>
                <button className="text-primary text-xs md:text-sm font-medium">Enable 2FA</button>
              </div>
              <p className="text-xs md:text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            
            <div className="p-3 md:p-4 border border-red-100 bg-red-50 rounded-lg">
              <div className="flex justify-between items-center mb-1 md:mb-2">
                <h4 className="text-sm md:text-base font-medium text-red-800">Danger Zone</h4>
              </div>
              <p className="text-xs md:text-sm text-red-600 mb-2 md:mb-3">These actions are irreversible</p>
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