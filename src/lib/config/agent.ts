// File: src/lib/actions/agent.ts
"use server";

import { prisma } from "@/lib/utils/prisma";
import { getAgentFromSession } from "@/lib/utils/auth-utils";
import { cookies } from "next/headers";

export const updateAgentAvatar = async (avatarUrl: string) => {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("agent_session")?.value;
    const session = await getAgentFromSession(sessionToken);

    if (!session) {
      throw new Error("Unauthorized");
    }

    await prisma.agentProfile.update({
      where: { agentId: session.id },
      data: { avatarUrl },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to update avatar:", error);
    throw error;
  }
};
