// pages/api/agent/enroll.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/app/lib/prisma";
import { agentSchema } from "@/app/lib/agentValidation/agentSchema";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const parsed = agentSchema.safeParse(req.body);
        if (!parsed.success) {
            const errorMessages = parsed.error.issues.map(err => err.message).join(", ");
            return res.status(400).json({ message: `Invalid input: ${errorMessages}` });
        }

        const agentData = parsed.data;

        const newAgent = await prisma.agent.create({
            data: {
                ...agentData,
                email: agentData.email.toLowerCase(), // normalize email
            },
        });

        return res.status(201).json({ message: "Agent enrolled successfully", agentId: newAgent.id });
    } catch (error: unknown) {
        console.error("Enrollment error:", error);
        return res.status(500).json({ message: "Failed to enroll agent." });
    }
}
