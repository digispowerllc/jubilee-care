import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import {
    unprotectData,
    generateSearchableHash,
    verifyHash,
} from "@/lib/security/dataProtection";
import { z } from "zod";

const signInSchema = z.object({
    identifier: z.string().min(1, "Email or phone is required"),
    credential: z.string().min(1, "Password is required"),
    usePassword: z.boolean().optional().default(true), // force password usage
});

export async function POST(req: Request) {
    try {
        const contentType = req.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
            return NextResponse.json(
                { success: false, error: "Content-Type must be application/json" },
                { status: 415 }
            );
        }

        const body = await req.json();
        const parseResult = signInSchema.safeParse(body);

        if (!parseResult.success) {
            return NextResponse.json(
                { success: false, error: z.treeifyError(parseResult.error) },
                { status: 400 }
            );
        }

        const { identifier, credential } = parseResult.data;
        const idHash = await generateSearchableHash(identifier);

        // Find agent by emailHash or phoneHash ONLY
        const agent = await prisma.agent.findFirst({
            where: {
                OR: [{ emailHash: idHash }, { phoneHash: idHash }],
            },
            include: { profile: true },
        });

        if (!agent?.profile) {
            return NextResponse.json(
                { success: false, error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Verify password (hashed)
        const isPasswordValid = await verifyHash(
            credential,
            agent.profile.passwordHash
        );

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // // Check if password is default and require change
        // const isDefaultPassword =
        //     credential === DEFAULT_PASSWORD; // or compare hashes if you store hashed default

        // if (isDefaultPassword) {
        //     return NextResponse.json({
        //         success: false,
        //         requiresPassword: true,
        //         message:
        //             "Default password in use. Please log in with your password.",
        //         statusCode: 403,
        //     });
        // }

        // Decrypt profile info
        const [firstName, surname, email] = await Promise.all([
            unprotectData(agent.firstName, "name"),
            unprotectData(agent.surname, "name"),
            unprotectData(agent.email, "email"),
        ]);

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

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

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
