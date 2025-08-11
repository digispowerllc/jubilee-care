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
                    { profile: { agentId: identifier } }, // agentId is unencrypted
                    { email: await protectData(identifier, 'email') }, // email is strongly encrypted
                    { phone: await protectData(identifier, 'phone') } // phone is strongly encrypted
                ]
            },
            include: {
                profile: true
            }
        });

        if (!agent?.profile) {
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
        } else {
            // Access code authentication (plain text comparison)
            isAuthenticated = credential === agent.profile.accessCode;

            // Special case: If default access code is used, force password auth next time
            if (isAuthenticated && agent.profile.accessCode === "N0Acc355C0d3") {
                return NextResponse.json({
                    success: true,
                    requiresPassword: true,
                    message: "Please authenticate with your password"
                });
            }
        }

        if (!isAuthenticated) {
            return NextResponse.json(
                { success: false, error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Decrypt sensitive user data according to their protection tiers
        const [firstName, surname, email, phone] = await Promise.all([
            unprotectData(agent.firstName, 'name'), // basic encryption
            unprotectData(agent.surname, 'name'), // basic encryption
            unprotectData(agent.email, 'email'), // strong encryption
            unprotectData(agent.phone, 'phone'), // strong encryption
        ]);

        // Generate session token (placeholder - implement your actual token generation)
        const authToken = generateAuthToken(agent.id);

        return NextResponse.json({
            success: true,
            token: authToken,
            user: {
                id: agent.id,
                agentId: agent.profile.agentId,
                firstName,
                surname,
                email,
                phone,
                // Include other necessary decrypted fields
            }
        });

    } catch (error) {
        console.error("SignIn error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Authentication failed. Please try again."
            },
            { status: 500 }
        );
    }
}

// Placeholder for your actual token generation
function generateAuthToken(agentId: string): string {
    // Implement your JWT or session token generation here
    return "generated-auth-token";
}