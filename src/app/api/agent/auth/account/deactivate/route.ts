// src/app/api/account/deactivate/route.ts
import { NextResponse } from 'next/server';
import { getAgentFromSession } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { protectData, verifyHash } from '@/lib/security/dataProtection';
import { verifyAgentPin } from '@/lib/pin-utils';

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

        const { password, pin, confirmation } = await req.json();

        // Validate inputs
        if (!PIN_REGEX.test(pin)) {
            return NextResponse.json(
                { success: false, error: 'PIN must be 8-15 digits' },
                { status: 400 }
            );
        }

        if (typeof confirmation !== 'string' ||
            confirmation.toLowerCase() !== 'deactivate my account') {
            return NextResponse.json(
                { success: false, error: 'Type "deactivate my account" to confirm' },
                { status: 400 }
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

        // Begin deactivation process
        const protectedReason = await protectData(
            `Account deactivated by user ${session.email}`,
            "general"
        );

        await prisma.$transaction([
            // 1. Deactivate the account
            prisma.agent.update({
                where: { id: session.id },
                data: {
                    status: 'DEACTIVATED',
                    deactivatedAt: new Date(),
                    deactivationReason: protectedReason.encrypted,
                    updatedAt: new Date()
                }
            }),

            // 2. Log the deactivation
            prisma.auditLog.create({
                data: {
                    action: "ACCOUNT_DEACTIVATION",
                    agentId: session.id,
                    details: "User initiated deactivation via modal",
                    ipAddress: req.headers.get('x-forwarded-for') || "unknown",
                    userAgent: req.headers.get('user-agent') || "unknown",
                    metadata: {
                        pinLastFour: `****${pin.slice(-4)}`, // Secure PIN handling
                        confirmationVerified: true
                    }
                }
            }),

            // 3. Invalidate all sessions (optional - could keep for reactivation)
            prisma.agentSession.deleteMany({
                where: { agentId: session.id }
            })
        ]);

        return NextResponse.json(
            {
                success: true,
                message: 'Account deactivated. Contact support within 30 days to reactivate.'
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Account deactivation error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to process deactivation request',
                systemMessage: error instanceof Error ? error.message : undefined
            },
            { status: 500 }
        );
    }
}