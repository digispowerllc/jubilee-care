// File: src/app/api/agent/auth/account/verify-credentials/route.ts
import { NextResponse } from "next/server";
import { getAgentFromSession } from "@/lib/utils/auth-utils";
import { prisma } from "@/lib/utils/prisma";
import { verifyHash } from "@/lib/security/dataProtection";
import { verifyAgentPin } from "@/lib/utils/pin-utils";
import { subHours } from "date-fns";

const SECURITY_CONFIG = {
  BASE_LOCK_HOURS: 24,
  MAX_ATTEMPTS: 3, // Maximum allowed attempts before lockout
  WINDOW_HOURS: 1, // Time window for counting attempts
};

export async function POST(req: Request) {
  try {
    const session = await getAgentFromSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check existing lock
    const profile = await prisma.agentProfile.findUnique({
      where: { agentId: session.id },
      select: {
        deletionLockedUntil: true,
        deletionLockoutCount: true,
        passwordHash: true,
      },
    });

    // Check if account is locked
    if (
      profile?.deletionLockedUntil &&
      new Date() < profile.deletionLockedUntil
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Account locked",
          lockedUntil: profile.deletionLockedUntil,
        },
        { status: 403 }
      );
    }

    const { password, pin } = await req.json();

    // Check recent attempts
    const attemptWindowStart = subHours(
      new Date(),
      SECURITY_CONFIG.WINDOW_HOURS
    );
    const recentAttempts = await prisma.failedDeletionAttempt.count({
      where: {
        agentId: session.id,
        createdAt: { gte: attemptWindowStart },
      },
    });

    // Check if maximum attempts reached
    if (recentAttempts >= SECURITY_CONFIG.MAX_ATTEMPTS) {
      const newLockoutUntil = new Date(
        Date.now() + SECURITY_CONFIG.BASE_LOCK_HOURS * 60 * 60 * 1000
      );

      await prisma.agentProfile.update({
        where: { agentId: session.id },
        data: {
          deletionLockedUntil: newLockoutUntil,
          deletionLockoutCount: (profile?.deletionLockoutCount || 0) + 1,
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: "Too many failed attempts",
          lockedUntil: newLockoutUntil,
        },
        { status: 429 }
      );
    }

    // Verify credentials
    const [isPinValid, isPasswordValid] = await Promise.all([
      verifyAgentPin(session.id, pin),
      verifyHash(password, profile?.passwordHash || ""),
    ]);

    if (!isPinValid || !isPasswordValid) {
      // Log failed attempt
      await prisma.failedDeletionAttempt.create({
        data: {
          agentId: session.id,
          ipAddress: req.headers.get("x-forwarded-for") || "unknown",
          userAgent: req.headers.get("user-agent") || undefined,
          details: isPasswordValid ? "Invalid PIN" : "Invalid password",
        },
      });

      const remainingAttempts =
        SECURITY_CONFIG.MAX_ATTEMPTS - recentAttempts - 1;
      return NextResponse.json(
        {
          success: false,
          error: isPasswordValid ? "Invalid PIN" : "Invalid password",
          remainingAttempts: Math.max(0, remainingAttempts),
        },
        { status: 403 }
      );
    }

    // Clear failed attempts on successful verification
    await prisma.failedDeletionAttempt.deleteMany({
      where: { agentId: session.id },
    });

    return NextResponse.json(
      { success: true, agentId: session.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Credentials verification failed:", error);
    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}
