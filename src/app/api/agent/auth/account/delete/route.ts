// src/app/api/account/delete/route.ts
import { NextResponse } from 'next/server';
import { getAgentFromSession } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { protectData, verifyHash } from '@/lib/security/dataProtection';

// PIN validation regex (8-15 digits)
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

        // Validate PIN format first
        if (!PIN_REGEX.test(pin)) {
            return NextResponse.json(
                { success: false, error: 'PIN must be 8-15 digits' },
                { status: 400 }
            );
        }

        // Verify confirmation text
        if (typeof confirmation !== 'string' ||
            confirmation.toLowerCase() !== 'delete my data') {
            return NextResponse.json(
                { success: false, error: 'Invalid confirmation text' },
                { status: 400 }
            );
        }

        // Verify email matches session
        if (email !== session.email) {
            return NextResponse.json(
                { success: false, error: 'Email does not match account' },
                { status: 403 }
            );
        }

             // Verify password
        const profile = await prisma.agentProfile.findUnique({
            where: { agentId: session.id },
            select: { passwordHash: true }
        });

        if (!profile) {
            return NextResponse.json(
                { success: false, error: 'Account not found' },
                { status: 404 }
            );
        }

        const isPasswordValid = await verifyHash(password, profile.passwordHash);
        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, error: 'Invalid password' },
                { status: 403 }
            );
        }

        // Proceed with deletion (soft delete first)
        const protectedReason = await protectData(
            'Account deleted by user request',
            "general"
        );

        await prisma.$transaction([
            // 1. Mark agent as deleted
            prisma.agent.update({
                where: { id: session.id },
                data: {
                    status: 'PENDING_DELETION',
                    deletedAt: new Date(),
                    deactivationReason: protectedReason.encrypted,
                    updatedAt: new Date()
                }
            }),

            // 2. Create audit log
            prisma.auditLog.create({
                data: {
                    action: 'ACCOUNT_DELETION',
                    agentId: session.id,
                    details: 'User initiated full account deletion',
                    ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
                    userAgent: req.headers.get('user-agent') || 'unknown'
                }
            }),

            // 3. Schedule hard deletion (example - would be handled by a cron job)
            prisma.deletionSchedule.create({
                data: {
                    agentId: session.id,
                    scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                    deletionType: 'FULL_ACCOUNT'
                }
            })
        ]);

        // Invalidate all sessions
        await prisma.agentSession.deleteMany({
            where: { agentId: session.id }
        });

        return NextResponse.json(
            { success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Account deletion error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}