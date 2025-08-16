// src/app/api/account/deactivate/route.ts
import { NextResponse } from 'next/server';
import { verifyAgentPin } from '@/lib/pin-utils';
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

        const { pin, confirmation, password } = await req.json();

        // Validate PIN format first
        if (!PIN_REGEX.test(pin)) {
            return NextResponse.json(
                { success: false, error: 'PIN must be 8-15 digits' },
                { status: 400 }
            );
        }

        // Verify confirmation text
        if (typeof confirmation !== 'string' ||
            confirmation.toLowerCase() !== 'deactivate my account') {
            return NextResponse.json(
                { success: false, error: 'Invalid confirmation text' },
                { status: 400 }
            );
        }

        // Verify PIN against database
        const isPinValid = await verifyAgentPin(session.id, pin);
        if (!isPinValid) {
            return NextResponse.json(
                { success: false, error: 'Invalid PIN' },
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

        // Proceed with deactivation
        const protectedReason = await protectData(
            'Account deactivated by user',
            "general"
        );

        // Update agent status and create audit log
        await prisma.$transaction([
            prisma.agent.update({
                where: { id: session.id },
                data: {
                    status: 'DEACTIVATED',
                    deletedAt: new Date(),
                    deactivatedAt: new Date(),
                    deactivationReason: protectedReason.encrypted,
                    updatedAt: new Date()
                }
            }),
            prisma.auditLog.create({
                data: {
                    action: 'ACCOUNT_DEACTIVATION',
                    agentId: session.id,
                    details: 'User initiated account deactivation',
                    ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
                    userAgent: req.headers.get('user-agent') || 'unknown'
                }
            })
        ]);

        return NextResponse.json(
            { success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Deactivation error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}