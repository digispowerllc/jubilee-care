// File: src/app/agent/profile/page.tsx

import { cookies } from "next/headers";
import { getAgentFromSession } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { unprotectData } from "@/lib/security/dataProtection";
import { prisma } from "@/lib/prisma";
import { ProfileTabs } from "./ProfileTabs";
import LogoutButton from "./LogoutButton";
import { AvatarUpload } from "@/components/global/AvatarUpload";

export type AgentProfileData = {
  surname: string;
  firstName: string;
  otherName: string | null;
  email: string;
  phone: string;
  nin: string;
  state: string;
  lga: string;
  address: string;
  emailVerified: boolean;
  memberSince?: Date;
  avatarUrl?: string; // Changed to only string | undefined
  agentId: string;
};

export default async function AgentProfilePage() {
  try {
    // Get and validate session
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("agent_session")?.value;
    const session = await getAgentFromSession(sessionToken);

    if (!session) {
      redirect("/agent/signin");
    }

    // Fetch agent data
    const [agentData, unprotectedFields] = await Promise.all([
      prisma.agent.findUnique({
        where: { id: session.id },
        select: {
          id: true,
          surname: true,
          firstName: true,
          otherName: true,
          email: true,
          phone: true,
          nin: true,
          state: true,
          lga: true,
          address: true,
          profile: {
            select: {
              emailVerified: true,
              createdAt: true,
              avatarUrl: true,
            },
          },
        },
      }),
      // Pre-fetch all unprotected data
      (async () => {
        const data = await prisma.agent.findUnique({
          where: { id: session.id },
          select: {
            id: true,
            surname: true,
            firstName: true,
            otherName: true,
            email: true,
            phone: true,
            nin: true,
            state: true,
            lga: true,
            address: true,
          },
        });

        if (!data) return null;

        return Promise.all([
          unprotectData(data.surname, "name"),
          unprotectData(data.firstName, "name"),
          data.otherName ? unprotectData(data.otherName, "name") : null,
          unprotectData(data.email, "email"),
          unprotectData(data.phone, "phone"),
          unprotectData(data.nin, "government"),
          unprotectData(data.state, "location"),
          unprotectData(data.lga, "location"),
          unprotectData(data.address, "location"),
        ]);
      })(),
    ]);

    if (!agentData || !unprotectedFields) {
      redirect("/agent/signin");
    }

    // Destructure unprotected data
    const [
      surname,
      firstName,
      otherName,
      email,
      phone,
      nin,
      state,
      lga,
      address,
    ] = unprotectedFields;

    // Handle avatarUrl conversion from null to undefined
    const avatarUrl = agentData.profile?.avatarUrl ?? undefined;

    const unprotectedData: AgentProfileData = {
      surname: surname ?? "",
      firstName: firstName ?? "",
      otherName: otherName,
      email: email ?? "",
      phone: phone ?? "",
      nin: nin ?? "",
      state: state ?? "",
      lga: lga ?? "",
      address: address ?? "",
      emailVerified: !!agentData.profile?.emailVerified,
      memberSince: agentData.profile?.createdAt,
      avatarUrl: avatarUrl, // This is now either string or undefined
      agentId: agentData.id,
    };

    // Generate initials
    const getInitials = () => {
      let initials = surname?.charAt(0) || "";
      initials += firstName?.charAt(0) || "";
      return initials.toUpperCase();
    };

    const fullName = `${surname} ${firstName}${otherName ? " " + otherName : ""}`;

    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <header className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <AvatarUpload
            initialAvatarUrl={unprotectedData.avatarUrl}
            initials={getInitials()}
            fullName={fullName}
            agentId={unprotectedData.agentId}
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {fullName}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1 sm:mt-2">
              <span
                className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${
                  unprotectedData.emailVerified
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {unprotectedData.emailVerified
                  ? "Verified"
                  : "Pending Verification"}
              </span>
              <span className="text-gray-500 text-xs sm:text-sm">
                Member since{" "}
                {unprotectedData.memberSince?.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <LogoutButton />
            </div>
          </div>
        </header>

        <ProfileTabs unprotectedData={unprotectedData} />
      </div>
    );
  } catch (error) {
    console.error("Profile page error:", error);
    redirect("/agent/signin?error=profile_load_failed");
  }
}
