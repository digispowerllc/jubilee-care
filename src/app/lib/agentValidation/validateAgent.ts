// lib/validateAgent.ts
import { prisma } from "../prisma";
import { z } from "zod";

const agentSchema = z.object({
    nin: z.string().min(11, "NIN must be at least 11 characters"),
    email: z.string().email("Invalid email format"),
    phone: z.string().min(11, "Phone number must be valid"),
});

export async function validateAgentUniqueness(input: { nin: string; email: string; phone: string }) {
    const parsed = agentSchema.safeParse(input);
    if (!parsed.success) {
        const errorMessages = parsed.error.issues.map(err => err.message).join(", ");
        throw new Error(`Validation failed: ${errorMessages}`);
    }

    const { nin, email, phone } = parsed.data;

    const existing = await prisma.agent.findFirst({
        where: {
            OR: [
                { nin },
                { email: email.toLowerCase() },
                { phone },
            ],
        },
    });

    if (existing) {
        const conflictField =
            existing.nin === nin ? "NIN" :
                existing.email.toLowerCase() === email.toLowerCase() ? "email" :
                    existing.phone === phone ? "phone number" :
                        "one of the fields";

        throw new Error(`Agent already exists with this ${conflictField}.`);
    }
}
