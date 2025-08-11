import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
    protectData,
    unprotectData,
    verifyHash
} from "@/lib/security/dataProtection";
import { z } from "zod";

const signInSchema = z.object({
    identifier: z.string().min(1, "Identifier is required"),
    credential: z.string().min(1, "Credential is required"),
    usePassword: z.boolean().optional().default(false),
});

export async function POST(req: Request) {
    try {
        // Validate content type
        const contentType = req.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
            return NextResponse.json(
                { success: false, error: "Content-Type must be application/json" },
                { status: 415 }
            );
        }

        const body = await req.json();
        const parseResult = signInSchema.safeParse(body);

        if (!parseResult.success) {
            return NextResponse.json(
                { success: false, error: parseResult.error.flatten() },
                { status: 400 }
            );
        }

        const { identifier, credential, usePassword } = parseResult.data;

        // Find agent by any identifier (agentId, email, or phone)
        const agent = await prisma.agent.findFirst({
            where: {
                OR: [
                    { profile: { agentId: identifier } },
                    { email: identifier }, // Compare with already encrypted email
                    { phone: identifier }  // Compare with already encrypted phone
                ]
            },
            include: {
                profile: true
            }
        });

        if (!agent?.profile) {
            console.log('No agent found for identifier:', identifier);
            return NextResponse.json(
                { success: false, error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Authentication logic
        let isAuthenticated = false;

        if (usePassword) {
            // Password authentication (hashed comparison)
            isAuthenticated = await verifyHash(credential, agent.profile.passwordHash);
            console.log('Password verification:', isAuthenticated);
        } else {
            // Access code authentication (plain text comparison)
            isAuthenticated = credential === agent.profile.accessCode;
            console.log('Access code comparison:', {
                input: credential,
                stored: agent.profile.accessCode,
                match: isAuthenticated
            });

            // Special case: If default access code is used
            if (isAuthenticated && agent.profile.accessCode === "N0Acc355C0d3") {
                return NextResponse.json({
                    success: true,
                    requiresPassword: true,
                    message: "Please authenticate with your password"
                });
            }
        }

        if (!isAuthenticated) {
            console.log('Authentication failed for agent:', agent.profile.agentId);
            return NextResponse.json(
                { success: false, error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Decrypt user data
        const [firstName, surname, email] = await Promise.all([
            unprotectData(agent.firstName, 'name'),
            unprotectData(agent.surname, 'name'),
            unprotectData(agent.email, 'email'),
        ]);

        return NextResponse.json({
            success: true,
            token: "generated-auth-token",
            user: {
                id: agent.id,
                agentId: agent.profile.agentId,
                firstName,
                surname,
                email
            }
        });

    } catch (error) {
        console.error("SignIn error:", error);
        return NextResponse.json(
            { success: false, error: "Authentication failed. Please try again." },
            { status: 500 }
        );
    }
}

// Placeholder for your actual token generation
function generateAuthToken(agentId: string): string {
    // Implement your JWT or session token generation here
    return "generated-auth-token";
}