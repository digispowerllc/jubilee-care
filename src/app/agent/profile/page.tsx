// File: src/app/agent/profile/page.tsx
import { cookies } from "next/headers";
import { getAgentFromSession } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { unprotectData } from "@/lib/security/dataProtection";
import { prisma } from "@/lib/prisma";

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
    emailVerified: agentData.profile?.emailVerified,
    memberSince: agentData.profile?.createdAt,
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {unprotectedData.firstName} {unprotectedData.surname}
        </h1>
        <p className="text-gray-600">
          {unprotectedData.emailVerified
            ? "Verified Account"
            : "Account Not Verified"}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">
                {unprotectedData.firstName} {unprotectedData.surname}
                {unprotectedData.otherName && ` ${unprotectedData.otherName}`}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{unprotectedData.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-medium">{unprotectedData.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">NIN</p>
              <p className="font-medium">{unprotectedData.nin}</p>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Address Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">State</p>
              <p className="font-medium">{unprotectedData.state}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">LGA</p>
              <p className="font-medium">{unprotectedData.lga}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Full Address</p>
              <p className="font-medium">{unprotectedData.address}</p>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-medium">
                {unprotectedData.memberSince?.toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Account Status</p>
              <p className="font-medium">
                {unprotectedData.emailVerified
                  ? "Verified"
                  : "Pending Verification"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
