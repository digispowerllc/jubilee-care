// src/app/api/account/delete/route.ts
import { NextResponse } from 'next/server';
import { getAgentFromSession } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { protectData, verifyHash } from '@/lib/security/dataProtection';
import { verifyAgentPin } from '@/lib/pin-utils';
import { Agent } from 'http';

const PIN_REGEX = /^\d{8,15}$/;

export async function POST(req: Request) {
    try {
        const session = await getAgentFromSession();
        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { email, password, pin, confirmation } = await req.json();

        // Validate inputs
        if (!PIN_REGEX.test(pin)) {
            return NextResponse.json(
                { success: false, error: 'PIN must be 8-15 digits' },
                { status: 400 }
            );
        }

        if (typeof confirmation !== 'string' ||
            confirmation.toLowerCase() !== 'delete my data') {
            return NextResponse.json(
                { success: false, error: 'Type "delete my data" to confirm' },
                { status: 400 }
            );
        }

        if (email !== session.email) {
            return NextResponse.json(
                { success: false, error: 'Email verification failed' },
                { status: 403 }
            );
        }

        // Verify credentials
        const [profile, isPinValid] = await Promise.all([
            prisma.agentProfile.findUnique({
                where: { agentId: session.id },
                select: { passwordHash: true }
            }),
            verifyAgentPin(session.id, pin)
        ]);

        if (!profile) {
            return NextResponse.json(
                { success: false, error: 'Account not found' },
                { status: 404 }
            );
        }

        if (!isPinValid) {
            return NextResponse.json(
                { success: false, error: 'Invalid PIN' },
                { status: 403 }
            );
        }

        const isPasswordValid = await verifyHash(password, profile.passwordHash);
        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, error: 'Invalid password' },
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
                        confirmationText: confirmation, // "delete my data"
                        systemsAffected: ["profile", "messages", "subscriptions"]
                    }
                }
            }),

            // 3. Schedule actual data purging
            prisma.deletionSchedule.create({
                data: {
                    agentId: session.id, // assuming `session.id` is the agent's ID
                    scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 day grace period
                    deletionType: "FULL_ACCOUNT", // or "DATA_ONLY"
                }
            }),


            // 4. Invalidate all sessions immediately
            prisma.agentSession.deleteMany({
                where: { agentId: session.id }
            })
        ]);

        // Initiate background data anonymization
        await fetch(`${process.env.INTERNAL_API_URL}/data-cleanup/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.INTERNAL_API_KEY}`
            },
            body: JSON.stringify({
                agentId: session.id,
                priority: 'high'
            })
        });

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