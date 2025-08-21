import { prisma } from "@/lib/utils/prisma";
import { getAgentFromSession } from "@/lib/utils/auth-utils";
import { cookies } from "next/headers";
import { AgentSchema } from "./agentSchema";

type AgentInput = {
  nin: string;
  email: string;
  phone: string;
};

export async function validateAgent(data: AgentInput) {
  // console.log("🔍 Starting agent validation with data:", data);

  // Step 1: Zod validation
  const validation = AgentSchema.pick({
    nin: true,
    email: true,
    phone: true,
  }).safeParse(data);

  if (!validation.success) {
    const errorMsg = validation.error.issues[0]?.message || "Invalid input";
    // console.log("❌ Zod validation failed:", errorMsg);
    return { valid: false, message: errorMsg };
  }

  // console.log("✅ Zod validation passed");

  // Step 2: Normalize input
  const { nin, email, phone } = {
    nin: data.nin.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
  };

  console.log("📦 Checking for existing agent in database...");
  const existingAgent = await prisma.agent.findFirst({
    where: {
      OR: [{ nin }, { email }, { phone }],
    },
  });

  // Step 3: Conflict resolution
  if (existingAgent) {
    // console.log("⚠️ Conflict found with existing agent:", existingAgent);

    const conflicts = [];

    if (existingAgent.nin === nin) conflicts.push("NIN");
    if (existingAgent.email === email) conflicts.push("Email");
    if (existingAgent.phone === phone) conflicts.push("Phone");

    if (conflicts.length > 0) {
      return {
        valid: false,
        message: "Email address, phone number or NIN already been used.",
      };
    }
  }

  // if (existingAgent) {
  //     console.log("⚠️ Conflict found with existing agent:", existingAgent);

  //     if (existingAgent.nin === nin) {
  //         return { valid: false, message: "NIN already registered" };
  //     }
  //     if (existingAgent.email === email) {
  //         return { valid: false, message: "Email already registered" };
  //     }
  //     if (existingAgent.phone === phone) {
  //         return { valid: false, message: "Phone already registered" };
  //     }
  // }

  // console.log("✅ Agent data is valid and unique");
  return { valid: true };
}

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
