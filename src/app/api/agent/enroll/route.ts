// pages/api/agent/enroll.ts

import { prisma } from "@/app/lib/prisma";
import { agentSchema } from "@/app/lib/agentValidation/agentSchema";

export async function POST(req: Request) {
    if (req.method !== "POST") {
        return new Response(JSON.stringify({ message: "Method not allowed" }), { status: 405 });
    }

    try {
        const parsed = agentSchema.safeParse(req.body);
        if (!parsed.success) {
            const errorMessages = parsed.error.issues.map(err => err.message).join(", ");
            return new Response(JSON.stringify({ message: `Invalid input: ${errorMessages}` }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const agentData = parsed.data;

        const newAgent = await prisma.agent.create({
            data: {
                ...agentData,
                email: agentData.email.toLowerCase(), // normalize email
            },
        });

        return new Response(JSON.stringify({
            message: "Agent enrolled successfully",
            agentId: newAgent.id,
        }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: unknown) {
        console.error("Enrollment error:", error);
        return new Response(JSON.stringify({ message: "Failed to enroll agent." }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
