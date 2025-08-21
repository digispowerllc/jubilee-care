import { requireAgentAuth } from "@/lib/auth/requireAgentAuth";
import AgentProfileClient from "./AgentProfileClient";

export default async function AgentProfilePage() {
  const profileData = await requireAgentAuth();
  return <AgentProfileClient profileData={profileData} />;
}
