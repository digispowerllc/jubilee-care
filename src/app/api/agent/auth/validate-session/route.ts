// File: src/app/api/auth/validate-session/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";

const SESSION_COOKIE = "session-token";

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(
      new RegExp(`${SESSION_COOKIE}=([^;]+)`)
    );
    const token = tokenMatch?.[1];

    if (!token) {
      return NextResponse.json({ valid: false });
    }

    const session = await prisma.agentSession.findUnique({
      where: { token },
      include: { agent: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ valid: false });
    }

    return NextResponse.json({
      valid: true,
      agentId: session.agentId,
      expiresAt: session.expiresAt,
    });
  } catch (err) {
    console.error("Validate session error:", err);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
