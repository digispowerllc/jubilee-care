import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHash } from "crypto";
import { verifyResetToken, markTokenAsUsed } from "@/lib/auth";
import { writeToLogger } from "@/lib/logger";

export async function POST(req: Request) {
    try {
        const body: { token?: string; email?: string } = await req.json();
        const { token, email } = body;

        if (!token || !email) {
            return NextResponse.json({ success: false, message: "Missing token or email" }, { status: 400 });
        }

        // Verify token
        const { isValid, userId, email: tokenEmail, error } = await verifyResetToken(token);

        if (!isValid) {
            return NextResponse.json({ success: false, message: error || "Invalid token" }, { status: 400 });
        }

        // Ensure email matches
        if (tokenEmail !== email.toLowerCase()) {
            return NextResponse.json({ success: false, message: "Token does not match the provided email" }, { status: 400 });
        }

        // Mark token as used
        await markTokenAsUsed(token);

        // Mark account as verified
        await prisma.agentProfile.update({
            where: { id: userId },
            data: { emailVerified: true },
        });

        return NextResponse.json({ success: true, message: "Account verified successfully" });
    } catch (err) {
        writeToLogger("error", `Verify account error: ${err}`);
        return NextResponse.json({ success: false, message: "Server error occurred" }, { status: 500 });
    }
}
