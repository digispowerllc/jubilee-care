// File: src/app/agent/profile/page.tsx
import { cookies } from "next/headers";
import { getAgentFromSession } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { unprotectData } from "@/lib/security/dataProtection";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { FiUser, FiLogOut } from "react-icons/fi";
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

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <header className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-100 overflow-hidden border-2 border-primary">
          {unprotectedData.avatarUrl ? (
            <Image
              src={unprotectedData.avatarUrl}
              alt="Profile"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 80px, 96px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl sm:text-3xl text-gray-400">
              <FiUser />
            </div>
          )}
          <button className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full">
            <FiUser className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {unprotectedData.firstName} {unprotectedData.surname}
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
            {/* Logout Button */}
            <LogoutButton />
          </div>
        </div>
      </header>

      <ProfileTabs unprotectedData={unprotectedData} />
    </div>
  );
}
