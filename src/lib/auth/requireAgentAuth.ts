import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAgentFromSession } from "@/lib/utils/auth-utils";
import { getAgentFullData } from "@/app/agent/profile/services/profileService";
import { AgentFullDataExtended } from "@/app/agent/profile/types";

const SESSION_COOKIE = "session-token";

export async function requireAgentAuth(): Promise<AgentFullDataExtended> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionToken) {
    console.warn("[Auth] No session token, redirecting.");
    return redirect("/agent/signin");
  }

  const session = await getAgentFromSession(sessionToken);
  if (!session || !session.id) {
    console.warn("[Auth] Invalid/expired session, force-signout.");
    redirect("/api/agent/auth/force-signout"); // 🔥 hits your signout route
  }

  const profileData = await getAgentFullData(session.id);
  if (!profileData) {
    console.warn("[Auth] No profile found, force-signout.");
    redirect("/api/agent/auth/force-signout"); // 🔥 hits your signout route
  }

  console.info(`[Auth] Authenticated agentId=${session.id}`);
  return profileData;
}
