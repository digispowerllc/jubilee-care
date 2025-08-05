import { prisma } from "@/app/lib/prisma";
import { AgentSchema } from "@/app/lib/agentSchema";

export async function validateAgent(data: {
  nin: string;
  email: string;
  phone: string;
}) {
  console.log("🔍 Starting agent validation with data:", data);

  // Zod validation
  const zodCheck = AgentSchema.pick({ nin: true, email: true, phone: true }).safeParse(data);
  if (!zodCheck.success) {
    const errorMsg = zodCheck.error.issues[0].message;
    console.log("❌ Zod validation failed:", errorMsg);
    return { valid: false, message: errorMsg };
  }
  console.log("✅ Zod validation passed");

  // Database uniqueness check
  const cleanedData = {
    nin: data.nin.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
  };

  console.log("📦 Checking for existing agent in database with:", cleanedData);
  const existingAgent = await prisma.agent.findFirst({
    where: {
      OR: [
        { nin: cleanedData.nin },
        { email: cleanedData.email },
        { phone: cleanedData.phone },
      ],
    },
  });

  if (existingAgent) {
    console.log("⚠️ Conflict found with existing agent:", existingAgent);
    if (existingAgent.nin === cleanedData.nin) {
      return { valid: false, message: "NIN already registered" };
    }
    if (existingAgent.email === cleanedData.email) {
      return { valid: false, message: "Email already registered" };
    }
    if (existingAgent.phone === cleanedData.phone) {
      return { valid: false, message: "Phone already registered" };
    }
  }

  console.log("✅ Agent data is valid and unique");
  return { valid: true };
}
