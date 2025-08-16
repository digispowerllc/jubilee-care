// File: api/agent/auth/account/attempts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAgentFromSession } from "@/lib/auth-utils";

const SECURITY_CONFIG = {
    BASE_LOCK_HOURS: 24, // initial lock duration
    PENALTY_MULTIPLIER: 2, // grows exponentially
    MAX_LOCK_DAYS: 30,
    MAX_ATTEMPTS: 3, // max attempts before lock
    WINDOW_HOURS: 1, // time window for counting attempts
};

export async function POST(req: Request) {
    try {
        const session = await getAgentFromSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { attempts } = await req.json();

        // Validate input
        if (typeof attempts !== 'number' || attempts < 0) {
            console.warn(`[${new Date().toISOString()}] Invalid attempts value from agent ${session.id}:`, attempts);
            return NextResponse.json({ error: "Invalid attempts value" }, { status: 400 });
        }

        // Log the attempt
        await prisma.failedDeletionAttempt.create({
            data: {
                agentId: session.id,
                attempts,
                ipAddress: req.headers.get("x-forwarded-for") || "unknown",
                userAgent: req.headers.get("user-agent") || undefined,
            }
        });
        console.info(`[${new Date().toISOString()}] Recorded deletion attempt for agent ${session.id}, attempts: ${attempts}`);

        // Get current profile
        const profile = await prisma.agentProfile.findUnique({
            where: { agentId: session.id },
            select: {
                deletionLockedUntil: true,
                deletionLockoutCount: true
            }
        });

        // If account is already locked, return current status
        if (profile?.deletionLockedUntil && new Date(profile.deletionLockedUntil) > new Date()) {
            console.info(`[${new Date().toISOString()}] Agent ${session.id} attempted deletion but account is locked until ${profile.deletionLockedUntil}`);
            return NextResponse.json({
                lockedUntil: profile.deletionLockedUntil,
                lockoutCount: profile.deletionLockoutCount || 0
            });
        }

        let lockedUntil = null;
        let lockoutCount = profile?.deletionLockoutCount || 0;

        // Check if we need to lock the account
        if (attempts >= SECURITY_CONFIG.MAX_ATTEMPTS) {
            lockoutCount += 1;

            // Compute lock duration with exponential backoff
            let lockHours = SECURITY_CONFIG.BASE_LOCK_HOURS *
                Math.pow(SECURITY_CONFIG.PENALTY_MULTIPLIER, lockoutCount - 1);

            // Cap the maximum lock duration
            lockHours = Math.min(lockHours, SECURITY_CONFIG.MAX_LOCK_DAYS * 24);

            lockedUntil = new Date(Date.now() + lockHours * 3600 * 1000);

            // Update profile with lock information
            await prisma.agentProfile.update({
                where: { agentId: session.id },
                data: {
                    deletionLockedUntil: lockedUntil,
                    deletionLockoutCount: lockoutCount,
                },
            });

            // Log the lock event
            await prisma.accountLock.create({
                data: {
                    agentId: session.id,
                    reason: `Too many failed deletion attempts (${lockoutCount} lockout)`,
                    expiresAt: lockedUntil,
                    action: "ACCOUNT_DELETION",
                    ipAddress: req.headers.get("x-forwarded-for") || "unknown",
                    userAgent: req.headers.get("user-agent") || undefined,
                },
            });

            console.warn(`[${new Date().toISOString()}] Agent ${session.id} account locked until ${lockedUntil} due to too many failed deletion attempts`);
        }

        return NextResponse.json({
            lockedUntil,
            lockoutCount,
            attemptsRemaining: Math.max(SECURITY_CONFIG.MAX_ATTEMPTS - attempts, 0)
        });
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Failed to process deletion attempt:`, error);
        return NextResponse.json(
            { error: "Failed to process attempt" },
            { status: 500 }
        );
    }
}

// GET endpoint to check current status
export async function GET() {
    try {
        const session = await getAgentFromSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const profile = await prisma.agentProfile.findUnique({
            where: { agentId: session.id },
            select: {
                deletionLockedUntil: true,
                deletionLockoutCount: true
            }
        });

        // Query failed deletion attempts in the time window
        const recentAttempts = await prisma.failedDeletionAttempt.count({
            where: {
                agentId: session.id,
                createdAt: {
                    gte: new Date(Date.now() - SECURITY_CONFIG.WINDOW_HOURS * 3600 * 1000)
                }
            }
        });

        const isLocked = profile?.deletionLockedUntil && new Date(profile.deletionLockedUntil) > new Date();

        console.info(`[${new Date().toISOString()}] Agent ${session.id} checked deletion attempt status: recentAttempts=${recentAttempts}, locked=${isLocked}`);

        return NextResponse.json({
            lockedUntil: profile?.deletionLockedUntil,
            lockoutCount: profile?.deletionLockoutCount || 0,
            recentAttempts,
            isLocked,
            attemptsRemaining: isLocked ? 0 : Math.max(SECURITY_CONFIG.MAX_ATTEMPTS - recentAttempts, 0)
        });
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Failed to get attempt status:`, error);
        return NextResponse.json(
            { error: "Failed to get attempt status" },
            { status: 500 }
        );
    }
}
