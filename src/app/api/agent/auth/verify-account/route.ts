// File: src/app/api/auth/verify-account/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyResetToken, generateResetToken } from "@/lib/auth-utils";
import { writeToLogger } from "@/lib/logger";


export async function POST(req: Request) {
    try {
        const body: { token?: string; sid?: string } = await req.json();
        const { token, sid } = body;

        if (!token || !sid) {
            return NextResponse.json(
                { success: false, message: "Missing verification token or account identifier" },
                { status: 400 }
            );
        }

        // Verify the existing token first
        const { isValid, userId, error } = await verifyResetToken(token);
        if (!isValid || !userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: error || "Invalid or expired verification token",
                    code: "INVALID_TOKEN"
                },
                { status: 400 }
            );
        }

        // Additional account matching verification
        if (userId !== sid) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Verification token does not exist. It may have been used already or does not match the account.",
                    code: "ACCOUNT_MISMATCH"
                },
                { status: 403 }
            );
        }

        // Invalidate all existing tokens for this user first
        await prisma.passwordResetToken.deleteMany({
            where: {
                agentId: userId,
                // Optional: Add type filter if you have different token types
                // type: 'verification'
            }
        });

        // Generate fresh password reset token (1 hour expiry)
        const { token: formToken, expiresAt } = await generateResetToken(userId);

        // Mark account as verified
        await prisma.agentProfile.update({
            where: { id: sid },
            data: {
                emailVerified: new Date(), // Timestamp verification
                accountLockedUntil: null, // Clear any lockouts
                lockoutCount: 0           // Reset attempt counter
            }
        });

        return NextResponse.json({
            success: true,
            message: "Account verified successfully. You may now reset your password.",
            formToken,    // The new token for password reset
            agentId: sid,  // The verified account ID
            expiresAt: expiresAt.toISOString() // Token expiry
        });

    } catch (err) {
        writeToLogger("error", `Account verification error: ${err}`);
        return NextResponse.json(
            {
                success: false,
                message: "An unexpected error occurred during verification",
                code: "SERVER_ERROR"
            },
            { status: 500 }
        );
    }
}