import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSearchableHash, verifyProtectedData } from "@/lib/security/dataProtection";
import { z } from "zod";

const signInSchema = z.object({
    identifier: z.string().min(1, "Email or phone is required")
        .refine(val => {
            // Validate as either email or phone number
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
            const isPhone = /^\+?[\d\s-]{10,}$/.test(val);
            return isEmail || isPhone;
        }, "Must be a valid email or phone number"),
    password: z.string().min(1, "Password is required")
        .min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parseResult = signInSchema.safeParse(body);

        if (!parseResult.success) {
            return NextResponse.json(
                { success: false, error: parseResult.error.flatten() },
                { status: 400 }
            );
        }

        const { identifier, password } = parseResult.data;

        // Generate normalized searchable hash for identifier
        const identifierHash = await generateSearchableHash(identifier);

        // Look up by either emailHash or phoneHash
        const agentProfile = await prisma.agentProfile.findFirst({
            where: {
                OR: [
                    { emailHash: identifierHash },
                    { phoneHash: identifierHash }
                ],
            },
            select: {
                id: true,
                agentId: true,
                passwordHash: true,
            },
        });

        if (!agentProfile) {
            return NextResponse.json(
                { success: false, error: "Invalid email/phone or password" },
                { status: 401 }
            );
        }

        // Verify password
        const passwordMatch = await verifyProtectedData(password, agentProfile.passwordHash, "system-code");

        if (!passwordMatch) {
            return NextResponse.json(
                { success: false, error: "Invalid email/phone or password" },
                { status: 401 }
            );
        }

        // ✅ Authentication successful — you can set cookies or return session data here
        return NextResponse.json(
            {
                success: true,
                message: "Login successful",
                agentId: agentProfile.agentId,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Sign in error:", error);
        return NextResponse.json(
            { success: false, error: "Login failed. Please try again." },
            { status: 500 }
        );
    }
}
