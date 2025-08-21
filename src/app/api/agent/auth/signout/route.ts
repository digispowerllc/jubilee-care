// File: src/app/api/auth/signout/route.ts
import { cookies } from "next/headers";
import { prisma } from "@/lib/utils/prisma";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "session-token";
const AGENT_COOKIE = "agent-id";

function clearCookies(res: NextResponse) {
  const baseOptions = {
    path: "/",
    expires: new Date(0), // expire immediately
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
  };

  res.cookies.set(SESSION_COOKIE, "", {
    ...baseOptions,
    httpOnly: true,
    priority: "high",
  });

  res.cookies.set(AGENT_COOKIE, "", {
    ...baseOptions,
    httpOnly: false,
  });
}

export async function POST() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;

  if (sessionToken) {
    try {
      await prisma.agentSession.delete({
        where: { token: sessionToken },
      });
    } catch (err) {
      console.error("[Signout] Failed to delete current session:", err);
    }
  }

  // Create JSON response instead of redirect
  const response = NextResponse.json(
    { success: true, message: "Signed out successfully" },
    { status: 200 }
  );

  clearCookies(response);
  return response;
}
