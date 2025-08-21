"use client";

import { AvatarUpload } from "@/components/global/AvatarUpload";
import LogoutButton from "../LogoutButton";

interface ProfileHeaderProps {
  agent: {
    surname: string;
    firstName: string;
    emailVerified?: boolean;
    avatarUrl?: string | null;
    agentId: string;
    fieldId?: string | null;
    memberSince?: string | null;
  };
}

export default function ProfileHeader({ agent }: ProfileHeaderProps) {
  return (
    <header className="relative mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
      {/* Avatar */}
      <div className="relative">
        <AvatarUpload
          initialAvatarUrl={agent.avatarUrl ?? undefined}
          initials={`${agent.surname?.charAt(0)}${agent.firstName?.charAt(0)}`}
          fullName={`${agent.surname} ${agent.firstName}`}
          agentId={agent.agentId}
        />
      </div>

      <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-medium text-gray-900 tracking-tight">
              {agent.surname} {agent.firstName}
            </h1>
            {agent.emailVerified ? (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Verified
              </span>
            ) : (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                Unverified
              </span>
            )}
          </div>

          <p className="text-sm text-gray-500 font-light">
            Agent ID:{" "}
            <span className="font-medium">
              {agent.fieldId ?? agent.agentId}
            </span>
          </p>

          {agent.memberSince && (
            <p className="text-sm text-gray-500 font-light">
              Member since:{" "}
              {new Date(agent.memberSince).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>
      </div>

      {/* Logout button fixed to top-right of header */}
      <div className="absolute top-0 right-0">
        <LogoutButton />
      </div>
    </header>
  );
}
