// File: src/app/api/agent/auth/account/lock-status/route.ts
import { NextResponse } from "next/server";
import { getAgentFromSession } from "@/lib/utils/auth-utils";
import { prisma } from "@/lib/utils/prisma";

const SECURITY_CONFIG = {
  WINDOW_HOURS: 1, // time window for counting attempts
  MAX_ATTEMPTS: 3, // max attempts before lockout
};

export async function GET() {
  const now = new Date();

  try {
    const session = await getAgentFromSession();
    if (!session) {
      console.warn(
        `[${now.toISOString()}] Unauthorized lock status check attempt`
      );
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const agentId = session.id;

    // Log start of lock status check
    console.info(
      `[${now.toISOString()}] Fetching lock status for agent ${agentId}`
    );

    // Get all relevant lock information in a single transaction
    const [activeLock, profile, recentAttempts] = await prisma.$transaction([
      prisma.accountLock.findFirst({
        where: {
          agentId,
          expiresAt: { gt: now },
          OR: [
            { action: "ACCOUNT_DELETION" },
            { action: "ACCOUNT_LOCK" }, // Include general account locks
          ],
        },
        orderBy: { expiresAt: "desc" },
      }),
      prisma.agentProfile.findUnique({
        where: { agentId },
        select: {
          deletionLockedUntil: true,
          deletionLockoutCount: true,
          isLocked: true,
          lockedUntil: true,
        },
      }),
      prisma.failedDeletionAttempt.count({
        where: {
          agentId,
          createdAt: {
            gte: new Date(
              now.getTime() - SECURITY_CONFIG.WINDOW_HOURS * 3600 * 1000
            ),
          },
        },
      }),
    ]);

    const systemLockedUntil = profile?.isLocked ? profile?.lockedUntil : null;
    const deletionLockedUntil =
      activeLock?.expiresAt ?? profile?.deletionLockedUntil;
    const lockedUntil = systemLockedUntil || deletionLockedUntil;

    const attemptsRemaining = Math.max(
      SECURITY_CONFIG.MAX_ATTEMPTS - recentAttempts,
      0
    );
    const isLocked = lockedUntil ? new Date(lockedUntil) > now : false;

    // Log the computed status
    console.info(`[${now.toISOString()}] Agent ${agentId} lock status:`, {
      isLocked,
      lockedUntil,
      lockoutCount: profile?.deletionLockoutCount ?? 0,
      recentFailedAttempts: recentAttempts,
      attemptsRemaining,
      lockType:
        activeLock?.action ?? (profile?.isLocked ? "ACCOUNT_LOCK" : null),
    });

    return NextResponse.json({
      isLocked,
      lockedUntil: lockedUntil?.toISOString() ?? null,
      lockoutCount: profile?.deletionLockoutCount ?? 0,
      recentFailedAttempts: recentAttempts,
      attemptsRemaining,
      lockType:
        activeLock?.action ?? (profile?.isLocked ? "ACCOUNT_LOCK" : null),
      nextAttemptAllowed:
        attemptsRemaining <= 0
          ? new Date(
              now.getTime() + SECURITY_CONFIG.WINDOW_HOURS * 3600 * 1000
            ).toISOString()
          : null,
    });
  } catch (error) {
    console.error(`[${now.toISOString()}] Failed to fetch lock status:`, error);
    return NextResponse.json(
      {
        error: "Failed to fetch lock status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
