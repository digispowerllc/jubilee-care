"use client";

import React from "react";
import { AvatarUpload } from "@/components/global/AvatarUpload";
import LogoutButton from "../LogoutButton";
import {
  FiShield,
  FiCheckCircle,
  FiAlertTriangle,
  FiUser,
  FiCalendar,
  FiMail,
  FiPhone,
  FiCreditCard,
} from "react-icons/fi";
import { FileStack } from "lucide-react";

interface ProfileHeaderProps {
  agent: {
    surname: string;
    firstName: string;
    otherName?: string | null;
    emailVerified?: boolean;
    phoneVerified?: boolean;
    ninVerified?: boolean;
    dobVerified?: boolean;
    genderVerified?: boolean;
    avatarUrl?: string | null;
    agentId: string;
    fieldId?: string | null;
    memberSince?: string | null;
      };
}

export default function ProfileHeader({ agent }: ProfileHeaderProps) {
  // Determine verification status
  const verifiedFlags = [
    agent.ninVerified,
    agent.dobVerified,
    agent.emailVerified,
    agent.phoneVerified,
    agent.genderVerified,
  ];

  const verifiedCount = verifiedFlags.filter(Boolean).length;
  const totalFlags = verifiedFlags.length;
  const verificationPercentage = Math.round((verifiedCount / totalFlags) * 100);

  let statusText = "Unverified";
  let statusColor = "text-red-600 bg-red-100";
  let statusIcon = FiAlertTriangle;

  if (verifiedFlags.every(Boolean)) {
    statusText = "Fully Verified";
    statusColor = "text-green-600 bg-green-100";
    statusIcon = FiCheckCircle;
  } else if (verifiedFlags.some(Boolean)) {
    statusText = "Partially Verified";
    statusColor = "text-amber-600 bg-amber-100";
  }

  const verificationDetails = [
    { label: "NIN", verified: agent.ninVerified, icon: FiCreditCard },
    { label: "DOB", verified: agent.dobVerified, icon: FiCalendar },
    { label: "Email", verified: agent.emailVerified, icon: FiMail },
    { label: "Phone", verified: agent.phoneVerified, icon: FiPhone },
    { label: "Gender", verified: agent.genderVerified, icon: FiUser },
  ];

  const agentFullName = `${agent.surname} ${agent.firstName.slice(0, 1)}${agent.otherName?.slice(0, 1) ?? ""}`;

  return (
    <header className="relative mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
        {/* Avatar */}
        <div className="relative">
          <AvatarUpload
            initialAvatarUrl={agent.avatarUrl ?? undefined}
            initials={`${agent.surname?.charAt(0)}${agent.firstName?.charAt(0)}`}
            fullName={agentFullName}
            agentId={agent.agentId}
          />
        </div>

        {/* Name & Status */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                  {/* {agent.surname} {agent.firstName}
                  {agent.otherName && ` ${agent.otherName}`} */}
                  {agentFullName}
                </h1>

                {/* Verification status */}
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${statusColor}`}
                >
                  {React.createElement(statusIcon, { className: "h-4 w-4" })}
                  {statusText}
                </span>
              </div>

              {/* Agent ID */}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm">
                  Agent ID:{" "}
                  <span className="font-semibold">
                    {agent.fieldId ?? agent.agentId}
                  </span>
                </span>

                {/* Member since */}
                {agent.memberSince && (
                  <span className="flex items-center gap-1">
                    <FiCalendar className="h-4 w-4" />
                    Member since:{" "}
                    {new Date(agent.memberSince).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Verification Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Verification Progress
              </span>
              <span className="text-sm text-gray-600">
                {verifiedCount}/{totalFlags} complete
              </span>
            </div>

            <div className="w-full bg-white rounded-full h-2 shadow-inner">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${verificationPercentage}%`,
                  backgroundColor:
                    verificationPercentage === 100
                      ? "#10B981"
                      : verificationPercentage > 0
                        ? "#F59E0B"
                        : "#EF4444",
                }}
              />
            </div>

            {/* Verification Details */}
            <div className="flex flex-wrap gap-3 mt-3">
              {verificationDetails.map((detail) => (
                <span
                  key={detail.label}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                    detail.verified
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                  title={
                    detail.verified
                      ? `${detail.label} Verified`
                      : `${detail.label} Pending`
                  }
                >
                  <detail.icon className="h-3 w-3" />
                  {detail.label}
                  {detail.verified && (
                    <FiCheckCircle className="h-3 w-3 ml-1" />
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="absolute top-4 right-4">
          <LogoutButton />
        </div>
      </div>

      {/* Quick Stats (Optional) */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">24</div>
          <div className="text-xs text-gray-600">Tasks Completed</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
          <div className="text-2xl font-bold text-green-600">12</div>
          <div className="text-xs text-gray-600">Active Leads</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
          <div className="text-2xl font-bold text-amber-600">3</div>
          <div className="text-xs text-gray-600">Pending</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">98%</div>
          <div className="text-xs text-gray-600">Success Rate</div>
        </div>
      </div>
    </header>
  );
}
