// src/app/api/auth/check-session/route.ts
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const cookieStore = await cookies(); // ✅ no await
    const sessionToken = cookieStore.get("agent_session")?.value;

    if (!sessionToken) {
        return new Response(JSON.stringify({ valid: false }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }

    const session = await prisma.agentSession.findUnique({
        where: { token: sessionToken },
        select: { expiresAt: true, revokedAt: true },
    });

    const now = new Date();
    const valid =
        session &&
        (!session.revokedAt || session.revokedAt === null) &&
        session.expiresAt > now;

    return new Response(JSON.stringify({ valid }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
