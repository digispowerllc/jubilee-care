// File: src/app/agent/profile/page.tsx
import { cookies } from "next/headers";
import { getAgentFromSession } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { unprotectData } from "@/lib/security/dataProtection";
import { prisma } from "@/lib/prisma";
import { ProfileTabs } from "./ProfileTabs";
import LogoutButton from "./LogoutButton";
import { AgentProfileData } from "@/lib/types/agent";

export default async function AgentProfilePage() {
  try {
    // Get and validate session
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("agent_session")?.value;
    const session = await getAgentFromSession(sessionToken);

    if (!session) {
      redirect("/agent/signin");
    }

    // Fetch agent data in parallel with session validation
    const [agentData, unprotectedFields] = await Promise.all([
      prisma.agent.findUnique({
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
      }),
      // Pre-fetch all unprotected data in parallel
      (async () => {
        const data = await prisma.agent.findUnique({
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

    const unprotectedData: AgentProfileData = {
      surname,
      firstName,
      otherName,
      email,
      phone,
      nin,
      state,
      lga,
      address,
      emailVerified: !!agentData.profile?.emailVerified,
      memberSince: agentData.profile?.createdAt,
      avatarUrl: agentData.profile?.avatarUrl,
    };

    const fullName = `${firstName} ${surname}`;

    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <header className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
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
