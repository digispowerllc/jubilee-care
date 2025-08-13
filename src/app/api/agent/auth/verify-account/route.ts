// File: src/app/api/auth/verify-account/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyResetToken, markTokenAsUsed } from "@/lib/auth-utils";
import { writeToLogger } from "@/lib/logger";

export async function POST(req: Request) {
    try {
        const body: { token?: string; email?: string } = await req.json();
        const { token, email } = body;

        if (!token || !email) {
            return NextResponse.json({ success: false, message: "Missing token or email" }, { status: 400 });
        }

        const { isValid, userId, email: tokenEmail, error } = await verifyResetToken(token);

        if (!isValid) {
            return NextResponse.json({ success: false, message: error || "Invalid token" }, { status: 400 });
        }

        if (tokenEmail !== email.toLowerCase()) {
            return NextResponse.json({ success: false, message: "Token does not match the provided email" }, { status: 400 });
        }

        await markTokenAsUsed(token);

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
