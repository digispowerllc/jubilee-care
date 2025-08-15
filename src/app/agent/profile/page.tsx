// File: src/app/agent/profile/page.tsx
import { cookies } from "next/headers";
import { getAgentFromSession } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { unprotectData } from "@/lib/security/dataProtection";
import { prisma } from "@/lib/prisma";
import { ProfileTabs } from "./ProfileTabs";
import LogoutButton from "./LogoutButton";
import { AgentProfileData } from "@/lib/types/agent";
import { FiUser } from "react-icons/fi";
import Image from "next/image";

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

    // Generate initials for avatar fallback
    const getInitials = () => {
      let initials = surname?.charAt(0) || "";
      initials += firstName?.charAt(0) || "";
      // if (otherName) {
      //   initials += otherName.charAt(0);
      // }
      return initials.toUpperCase();
    };

    const fullName = `${surname} ${firstName.slice(0, 1)}${otherName ? otherName.slice(0, 1) : ""}`;

    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <header className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-100 overflow-hidden border-2 border-primary flex items-center justify-center">
            {unprotectedData.avatarUrl ? (
              <Image
                src={unprotectedData.avatarUrl}
                alt={fullName}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 80px, 96px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                <span className="text-2xl sm:text-3xl font-bold text-primary">
                  {getInitials()}
                </span>
              </div>
            )}
            <button className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full">
              <FiUser className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>

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
