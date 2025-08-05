import { prisma } from "@/app/lib/prisma";
import { AgentSchema } from "@/app/lib/agentSchema";

type AgentInput = {
    nin: string;
    email: string;
    phone: string;
};

export async function validateAgent(data: AgentInput) {
    console.log("🔍 Starting agent validation with data:", data);

    // Step 1: Zod validation
    const validation = AgentSchema.pick({
        nin: true,
        email: true,
        phone: true,
    }).safeParse(data);

    if (!validation.success) {
        const errorMsg = validation.error.issues[0]?.message || "Invalid input";
        console.log("❌ Zod validation failed:", errorMsg);
        return { valid: false, message: errorMsg };
    }

    console.log("✅ Zod validation passed");

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
        console.log("⚠️ Conflict found with existing agent:", existingAgent);

        if (existingAgent.nin === nin) {
            return { valid: false, message: "NIN already registered" };
        }
        if (existingAgent.email === email) {
            return { valid: false, message: "Email already registered" };
        }
        if (existingAgent.phone === phone) {
            return { valid: false, message: "Phone already registered" };
        }
    }

    console.log("✅ Agent data is valid and unique");
    return { valid: true };
}
