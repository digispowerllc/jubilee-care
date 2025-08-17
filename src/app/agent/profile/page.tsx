// File: src/app/agent/profile/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAgentFromSession } from "@/lib/auth-utils";
import { prepareProfileData } from "./services/profileService";
import AgentProfileClient from "./AgentProfileClient";

export default async function AgentProfilePage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("agent_session")?.value;

  if (!sessionToken) {
    redirect("/agent/signin");
  }

  const session = await getAgentFromSession(sessionToken);
  if (!session) {
    redirect("/agent/signin");
  }

  const profileData = await prepareProfileData(session.id);
  if (!profileData) {
    redirect("/agent/signin");
  }

  return <AgentProfileClient profileData={profileData} />;
}
