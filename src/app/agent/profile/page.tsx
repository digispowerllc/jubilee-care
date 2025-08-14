// File: src/app/agent/profile/page.tsx
import { cookies } from "next/headers";
import { getAgentFromSession } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { unprotectData } from "@/lib/security/dataProtection";
import { prisma } from "@/lib/prisma";
import UserAvatar from "@/components/UserAvatar";
import { ProfileTabs } from "./ProfileTabs";
import LogoutButton from "./LogoutButton";

export default async function AgentProfilePage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("agent_session")?.value;

  // Verify session and get agent ID
  const session = await getAgentFromSession(sessionToken);
  if (!session) redirect("/agent/signin");

  // Fetch and unprotect agent data
  const agentData = await prisma.agent.findUnique({
    where: { id: session.id },
    select: {
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
  });

  if (!agentData) {
    redirect("/agent/signin");
  }

  // Unprotect sensitive data
  const unprotectedData = {
    surname: await unprotectData(agentData.surname, "name"),
    firstName: await unprotectData(agentData.firstName, "name"),
    otherName: agentData.otherName
      ? await unprotectData(agentData.otherName, "name")
      : null,
    email: await unprotectData(agentData.email, "email"),
    phone: await unprotectData(agentData.phone, "phone"),
    nin: await unprotectData(agentData.nin, "government"),
    state: await unprotectData(agentData.state, "location"),
    lga: await unprotectData(agentData.lga, "location"),
    address: await unprotectData(agentData.address, "location"),
    emailVerified: !!agentData.profile?.emailVerified,
    memberSince: agentData.profile?.createdAt,
    avatarUrl: agentData.profile?.avatarUrl,
  };

  const fullName = `${unprotectedData.firstName} ${unprotectedData.surname}`;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <header className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <UserAvatar
          fullName={fullName}
          size={96}
          profilePicture={unprotectedData.avatarUrl}
          className="w-20 h-20 sm:w-24 sm:h-24"
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
              Member since {unprotectedData.memberSince?.toLocaleDateString()}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <ProfileTabs unprotectedData={unprotectedData} />
    </div>
  );
}
