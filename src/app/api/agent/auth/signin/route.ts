import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import {
    unprotectData,
    verifyHash,
    generateSearchableHash
} from "@/lib/security/dataProtection";
import { z } from "zod";

const DEFAULT_ACCESS_CODE = "N0Acc355C0d3";

const signInSchema = z.object({
    identifier: z.string().min(1, "Identifier is required"),
    credential: z.string().min(1, "Credential is required"),
    usePassword: z.boolean().optional().default(false),
});

export async function POST(req: Request) {
    try {
        // --- Validate content type ---
        const contentType = req.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
            return NextResponse.json(
                { success: false, error: "Content-Type must be application/json" },
                { status: 415 }
            );
        }

        // --- Parse body ---
        const body = await req.json();
        const parseResult = signInSchema.safeParse(body);

        if (!parseResult.success) {
            return NextResponse.json(
                { success: false, error: parseResult.error.flatten() },
                { status: 400 }
            );
        }

        const { identifier, credential, usePassword } = parseResult.data;

        // --- Searchable hash for email/phone ---
        const idHash = await generateSearchableHash(identifier);

        // --- Find agent by identifier ---
        const agent = await prisma.agent.findFirst({
            where: {
                OR: [
                    { profile: { agentId: identifier } },
                    { emailHash: idHash },
                    { phoneHash: idHash },
                ],
            },
            include: { profile: true },
        });

        if (!agent?.profile) {
            return NextResponse.json(
                { success: false, error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // --- Authentication ---
        let isAuthenticated = false;

        if (usePassword) {
            // Compare with hashed password
            isAuthenticated = await verifyHash(
                credential,
                agent.profile.passwordHash
            );
        } else {
            // Compare hashed access code
            const credentialHash = await generateSearchableHash(credential);
            isAuthenticated =
                Boolean(agent.profile.accessCodeHash) &&
                credentialHash === agent.profile.accessCodeHash;

            // If access code matches and it's the default one — warn
            if (isAuthenticated && agent.profile.accessCode === DEFAULT_ACCESS_CODE) {
                return NextResponse.json({
                    success: true,
                    requiresPassword: true,
                    message: "Default access code in use. Please change your access code before continuing.",
                    user: {
                        id: agent.id,
                        agentId: agent.profile.agentId
                    }
                });
            }
        }

        if (!isAuthenticated) {
            return NextResponse.json(
                { success: false, error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // --- Decrypt data ---
        const [firstName, surname, email] = await Promise.all([
            unprotectData(agent.firstName, "name"),
            unprotectData(agent.surname, "name"),
            unprotectData(agent.email, "email"),
        ]);

        // --- Create token ---
        const token = await generateAuthToken(agent.id, req);

        return NextResponse.json({
            success: true,
            token,
            user: {
                id: agent.id,
                agentId: agent.profile.agentId,
                firstName,
                surname,
                email,
            },
        });
    } catch (error) {
        console.error("SignIn error:", error);
        return NextResponse.json(
            { success: false, error: "Authentication failed. Please try again." },
            { status: 500 }
        );
    }
}

export async function generateAuthToken(agentId: string, req?: Request) {
    const plainToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(plainToken).digest("hex");

    let ipAddress: string | undefined;
    let userAgent: string | undefined;
    if (req) {
        ipAddress = req.headers.get("x-forwarded-for") || undefined;
        userAgent = req.headers.get("user-agent") || undefined;
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.agentSession.create({
        data: {
            agentId,
            token: tokenHash,
            ipAddress,
            userAgent,
            expiresAt,
        },
    });

    return plainToken;
}
