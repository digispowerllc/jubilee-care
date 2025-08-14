// src/app/api/auth/logout/route.ts
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("agent_session")?.value;

    if (sessionToken) {
        // Find the session and its user
        const session = await prisma.agentSession.findUnique({
            where: { token: sessionToken },
            select: { agentId: true },
        });

        if (session?.agentId) {
            // Delete ALL sessions for that user
            await prisma.agentSession.deleteMany({
                where: { agentId: session.agentId },
            });
        }
    }

    // Expire cookie
    cookieStore.set("agent_session", "", {
        path: "/",
        expires: new Date(0),
        httpOnly: true,
        secure: true,
    });

    return new Response(null, { status: 204 });
}
