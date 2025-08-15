// File: src/app/api/agent/auth/verify-password-reset/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyResetToken } from "@/lib/auth-utils";
import { createHash } from 'crypto';

export async function POST(req: Request) {
    try {
        const { token, sid } = await req.json();

        if (!token || !sid) {
            return NextResponse.json(
                { success: false, message: "Missing token or account identifier" },
                { status: 400 }
            );
        }

        // Verify the password reset token
        const { isValid, agentId, error } = await verifyResetToken(token, sid);

        if (!isValid || !agentId) {
            return NextResponse.json(
                {
                    success: false,
                    message: error || "Invalid or expired password reset link",
                    code: "TOKEN_INVALID"
                },
                { status: 400 }
            );
        }

        // Verify token belongs to the specified account
        if (agentId !== sid) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Password reset token does not match account",
                    code: "ACCOUNT_MISMATCH"
                },
                { status: 403 }
            );
        }

        // Additional check that the token hasn't been used already
        const tokenRecord = await prisma.passwordResetToken.findFirst({
            where: {
                tokenHash: createHash('sha256').update(token).digest('hex'),
                usedAt: null
            }
        });

        if (!tokenRecord) {
            return NextResponse.json(
                {
                    success: false,
                    message: "This password reset link has already been used",
                    code: "TOKEN_USED"
                },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Password reset token is valid",
            agentId: agentId
        });

    } catch (err) {
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