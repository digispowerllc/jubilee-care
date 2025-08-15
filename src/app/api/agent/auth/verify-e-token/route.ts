// File: src/app/api/auth/verify-account/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyResetToken, generateResetToken } from "@/lib/auth-utils";
import { writeToLogger } from "@/lib/logger";

export async function POST(req: Request) {
    try {
        const { token, sid }: { token?: string; sid?: string } = await req.json();
        if (!token || !sid) {
            return NextResponse.json({ success: false, message: "Missing token or agent ID" }, { status: 400 });
        }

        // 1️⃣ Verify token
        const { isValid, agentId, error } = await verifyResetToken(token, sid);
        if (!isValid || !agentId) {
            return NextResponse.json({ success: false, message: error || "Invalid token. Request a new reset link." }, { status: 400 });
        }

        // 2️⃣ Generate fresh password reset token
        const { token: formToken, expiresAt } = await generateResetToken(agentId);

        // 3️⃣ Mark account verified
        await prisma.agentProfile.update({
            where: { id: agentId },
            data: { emailVerified: new Date(), accountLockedUntil: null, lockoutCount: 0 },
        });

        writeToLogger("info", `Verified account: ${agentId}, generated reset token`);

        return NextResponse.json({
            success: true,
            message: "Account verified successfully",
            formToken,
            agentId: agentId,
            expiresAt: expiresAt.toISOString(),
        });
    } catch (err) {
        writeToLogger("error", `Account verification error: ${err}`);
        return NextResponse.json({ success: false, message: "Server error", code: "SERVER_ERROR" }, { status: 500 });
    }
}
