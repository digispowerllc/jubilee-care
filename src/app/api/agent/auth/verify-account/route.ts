// File: src/app/api/auth/verify-account/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyResetToken } from "@/lib/auth-utils";
import { writeToLogger } from "@/lib/logger";

export async function POST(req: Request) {
    try {
        const body: { token?: string; sid?: string } = await req.json();
        const { token, sid } = body;

        if (!token || !sid) {
            return NextResponse.json(
                { success: false, message: "Missing token or sid" },
                { status: 400 }
            );
        }

        // Verify token (checks existence, expiry, and usedAt)
        const { isValid, userId, error } = await verifyResetToken(token);

        if (!isValid || !userId || userId !== sid) {
            return NextResponse.json(
                { success: false, message: error || "Invalid token" },
                { status: 400 }
            );
        }

        // Ensure the token belongs to the provided sid
        if (userId !== sid) {
            return NextResponse.json(
                { success: false, message: "Token does not match the provided account" },
                { status: 400 }
            );
        }

        // Delete all tokens for this agent (invalidate all outstanding tokens)
        await prisma.passwordResetToken.deleteMany({
            where: { agentId: userId },
        });

        // Mark account as verified
        await prisma.agentProfile.update({
            where: { id: userId },
            data: { emailVerified: true },
        });

        return NextResponse.json({ success: true, message: "Account verified successfully" });
    } catch (err) {
        writeToLogger("error", `Verify account error: ${err}`);
        return NextResponse.json(
            { success: false, message: "Server error occurred" },
            { status: 500 }
        );
    }
}
