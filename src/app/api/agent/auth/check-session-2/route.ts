// src/app/api/auth/check-session-2/route.ts
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("agent_session")?.value;

        if (!sessionToken) {
            console.warn("[check-session-2] No session token in cookies");
            return new Response(JSON.stringify({ valid: false }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

        const session = await prisma.agentSession.findUnique({
            where: { token: sessionToken },
            select: { expiresAt: true, revokedAt: true },
        });

        if (!session) {
            console.warn("[check-session-2] No matching session found in DB");
            return new Response(JSON.stringify({ valid: false }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

        const now = new Date();
        const valid =
            !session.revokedAt &&
            session.expiresAt > now;

        return new Response(JSON.stringify({ valid }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (err) {
        console.error("[check-session-2] Error checking session:", err);
        return new Response(JSON.stringify({ valid: false }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
}
