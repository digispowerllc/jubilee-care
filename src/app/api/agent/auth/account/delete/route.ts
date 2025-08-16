// File: src/app/api/agent/auth/account/delete/route.ts
import { NextResponse } from 'next/server';
import { getAgentFromSession } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { protectData, verifyHash } from '@/lib/security/dataProtection';
import { verifyAgentPin } from '@/lib/pin-utils';
import { subHours } from 'date-fns';

const SECURITY_CONFIG = {
  BASE_LOCK_HOURS: 24,
  PENALTY_MULTIPLIER: 2,
  MAX_LOCK_DAYS: 30,
  MAX_ATTEMPTS: 3,
  WINDOW_HOURS: 1,
};

export async function POST(req: Request) {
  try {
    const session = await getAgentFromSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check existing lock
    const profile = await prisma.agentProfile.findUnique({
      where: { agentId: session.id },
      select: { 
        deletionLockedUntil: true,
        deletionLockoutCount: true,
        passwordHash: true 
      }
    });

    if (profile?.deletionLockedUntil && new Date() < profile.deletionLockedUntil) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Account locked',
          lockedUntil: profile.deletionLockedUntil,
          lockoutCount: profile.deletionLockoutCount
        },
        { status: 403 }
      );
    }

    const { agentId, password, pin, confirmation } = await req.json();

    // Validate inputs
    if (!/^\d{8,15}$/.test(pin)) {
      return NextResponse.json(
        { success: false, error: 'PIN must be 8-15 digits' },
        { status: 400 }
      );
    }

    if (typeof confirmation !== 'string' || confirmation.toLowerCase() !== 'delete my data') {
      return NextResponse.json(
        { success: false, error: 'Type "delete my data" to confirm' },
        { status: 400 }
      );
    }

    // Check recent attempts
    const attemptWindowStart = subHours(new Date(), SECURITY_CONFIG.WINDOW_HOURS);
    const recentAttempts = await prisma.failedDeletionAttempt.count({
      where: { 
        agentId: session.id,
        createdAt: { gte: attemptWindowStart }
      }
    });

    if (recentAttempts >= SECURITY_CONFIG.MAX_ATTEMPTS) {
      const currentLockoutCount = profile?.deletionLockoutCount || 0;
      const lockHours = SECURITY_CONFIG.BASE_LOCK_HOURS * Math.pow(SECURITY_CONFIG.PENALTY_MULTIPLIER, currentLockoutCount);
      const lockMs = Math.min(
        lockHours * 60 * 60 * 1000,
        SECURITY_CONFIG.MAX_LOCK_DAYS * 24 * 60 * 60 * 1000
      );
      const newLockoutUntil = new Date(Date.now() + lockMs);

      await prisma.$transaction([
        prisma.agentProfile.update({
          where: { agentId: session.id },
          data: { 
            deletionLockedUntil: newLockoutUntil,
            deletionLockoutCount: currentLockoutCount + 1
          }
        }),
        prisma.failedDeletionAttempt.create({
          data: {
            agentId: session.id,
            ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
            userAgent: req.headers.get('user-agent') || undefined,
            details: 'Attempt limit exceeded'
          }
        })
      ]);

      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many failed attempts',
          lockedUntil: newLockoutUntil,
          lockoutCount: currentLockoutCount + 1
        },
        { status: 429 }
      );
    }

    // Verify credentials
    const [isPinValid, isPasswordValid] = await Promise.all([
      verifyAgentPin(session.id, pin),
      verifyHash(password, profile?.passwordHash || '')
    ]);

    if (!isPinValid || !isPasswordValid) {
      // Log failed attempt
      await prisma.failedDeletionAttempt.create({
        data: {
          agentId: session.id,
          ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
          userAgent: req.headers.get('user-agent') || undefined,
          details: isPasswordValid ? 'Invalid PIN' : 'Invalid password'
        }
      });

      const remainingAttempts = SECURITY_CONFIG.MAX_ATTEMPTS - recentAttempts - 1;
      return NextResponse.json(
        { 
          success: false, 
          error: isPasswordValid ? 'Invalid PIN' : 'Invalid password',
          remainingAttempts: Math.max(0, remainingAttempts)
        },
        { status: 403 }
      );
    }

    // Begin deletion process
    const protectedReason = await protectData(
      `Account deletion requested by user ${session.email}`,
      "general"
    );

    await prisma.$transaction([
      // 1. Mark account for deletion
      prisma.agent.update({
        where: { id: session.id },
        data: {
          status: 'PENDING_DELETION',
          deletedAt: new Date(),
          deletionReason: protectedReason.encrypted,
          updatedAt: new Date()
        }
      }),

      // 2. Log the deletion request
      prisma.auditLog.create({
        data: {
          action: "ACCOUNT_DELETION_REQUEST",
          agentId: session.id,
          details: "User initiated permanent deletion",
          ipAddress: req.headers.get('x-forwarded-for') || "unknown",
          userAgent: req.headers.get('user-agent') || "unknown",
          metadata: {
            deletionScheduled: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            confirmationText: confirmation,
            systemsAffected: ["profile", "messages", "subscriptions"]
          }
        }
      }),

      // 3. Schedule actual data purging
      prisma.deletionSchedule.create({
        data: {
          agentId: session.id,
          scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          deletionType: "FULL_ACCOUNT",
        }
      }),

      // 4. Clear failed attempts and locks
      prisma.failedDeletionAttempt.deleteMany({
        where: { agentId: session.id }
      }),
      prisma.agentProfile.update({
        where: { agentId: session.id },
        data: {
          deletionLockedUntil: null,
          deletionLockoutCount: 0
        }
      })
    ]);

    return NextResponse.json(
      {
        success: true,
        message: 'Account deletion scheduled. All data will be permanently removed within 7 days.'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process deletion request',
        systemMessage: error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    );
  }
}