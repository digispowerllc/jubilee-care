// File: src/app/api/auth/reset-password/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { protectData } from "@/lib/security/dataProtection";
import { z } from "zod";
import { invalidateAllSessions } from "@/lib/auth-utils";

const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token is required"),
    password: z.string().min(1, "Password is required")
        .min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parseResult = resetPasswordSchema.safeParse(body);

        if (!parseResult.success) {
            return NextResponse.json(
                { success: false, error: parseResult.error.flatten() },
                { status: 400 }
            );
        }

        const { token, password } = parseResult.data;

        // Find the valid, non-expired token
        const resetToken = await prisma.passwordResetToken.findFirst({
            where: {
                tokenHash: token,
                expiresAt: { gt: new Date() }, // Not expired
                usedAt: null, // Not already used
            },
        });

        if (!resetToken) {
            return NextResponse.json(
                { success: false, error: "Invalid or expired token" },
                { status: 400 }
            );
        }

        // Hash the new password (using same protection as sign-in)
        const protectedPassword = await protectData(password, "system-code");

        // Update the agent's password
        await prisma.$transaction([
            prisma.agentProfile.update({
                where: { id: resetToken.agentId },
                data: { passwordHash: protectedPassword.encrypted },
            }),
            prisma.passwordResetToken.update({
                where: { id: resetToken.id },
                data: { usedAt: new Date() },
            }),
        ]);

        // Invalidate all sessions if needed (implementation depends on your session management)
        await invalidateAllSessions(resetToken.agentId);

        return NextResponse.json(
            { success: true, message: "Password updated successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to reset password" },
            { status: 500 }
        );
    }
}