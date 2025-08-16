// src/app/api/auth/check-session/route.ts
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        console.log("[check-session] Incoming request");

        const cookieStore = await cookies();
        console.log("[check-session] Cookies:", cookieStore.getAll());

        const sessionToken = cookieStore.get("agent_session")?.value;
        console.log("[check-session] Session token:", sessionToken || "None found");

        if (!sessionToken) {
            console.warn("[check-session] No session token found → invalid");
            return new Response(JSON.stringify({ valid: false }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

        const session = await prisma.agentSession.findUnique({
            where: { token: sessionToken },
            select: { expiresAt: true, revokedAt: true },
        });
        console.log("[check-session] Session lookup result:", session);

        const now = new Date();
        const isPresent = !!session;
        const notRevoked = !session?.revokedAt;
        const notExpired = !!session && session.expiresAt > now;

        // Comparison log (same criteria used in get-session)
        console.log("[check-session] isPresent:", isPresent);
        console.log("[check-session] notRevoked:", notRevoked);
        console.log("[check-session] notExpired:", notExpired);

        const valid = isPresent && notRevoked && notExpired;

        if (!isPresent) {
            console.warn("[check-session] FAIL → No session found for token");
        } else {
            if (!notRevoked) {
                console.warn("[check-session] FAIL → Session revoked at:", session.revokedAt);
            }
            if (!notExpired) {
                console.warn("[check-session] FAIL → Session expired at:", session.expiresAt);
            }
        }

        console.log("[check-session] FINAL RESULT:", valid);

        return new Response(JSON.stringify({ valid }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("[check-session] Error:", err);
        return new Response(JSON.stringify({ valid: false, error: "Server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
