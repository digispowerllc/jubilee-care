// src/app/api/agent/auth/get-session/route.ts
import { cookies } from "next/headers";
import { prisma } from "@/lib/utils/prisma";

export async function GET() {
  try {
    console.log("[get-session] Incoming request");

    const cookieStore = await cookies();
    console.log("[get-session] Cookies:", cookieStore.getAll());

    const sessionToken = cookieStore.get("agent_session")?.value;
    console.log("[get-session] Session token:", sessionToken || "None found");

    if (!sessionToken) {
      console.warn("[get-session] No session token provided → invalid");
      return new Response(
        JSON.stringify({ error: "No session token", valid: false }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const session = await prisma.agentSession.findUnique({
      where: { token: sessionToken },
      select: { agentId: true, expiresAt: true, revokedAt: true },
    });
    console.log("[get-session] Session lookup result:", session);

    const now = new Date();
    const isPresent = !!session;
    const notRevoked = !session?.revokedAt;
    const notExpired = !!session && session.expiresAt > now;

    console.log("[get-session] isPresent:", isPresent);
    console.log("[get-session] notRevoked:", notRevoked);
    console.log("[get-session] notExpired:", notExpired);

    const valid = isPresent && notRevoked && notExpired;

    if (!isPresent) {
      console.warn("[get-session] FAIL → No session found for token");
    } else {
      if (!notRevoked) {
        console.warn(
          "[get-session] FAIL → Session revoked at:",
          session.revokedAt
        );
      }
      if (!notExpired) {
        console.warn(
          "[get-session] FAIL → Session expired at:",
          session.expiresAt
        );
      }
    }

    if (!valid) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired session", valid }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log(
      "[get-session] SUCCESS → Valid session for agent:",
      session.agentId
    );

    return new Response(JSON.stringify({ agentId: session.agentId, valid }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[get-session] Error:", err);
    return new Response(
      JSON.stringify({ error: "Server error", valid: false }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
