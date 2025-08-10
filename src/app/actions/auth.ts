'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { protectData, unprotectData } from '@/lib/security/dataProtection';

export async function signIn(identifier: string, accessCode: string) {
    try {
        const isAgentId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

        let agent;

        if (isAgentId) {
            agent = await prisma.agent.findFirst({
                where: {
                    id: identifier,
                    isActive: true,
                    isDeleted: false,
                },
                include: { profile: true },
            });
        } else {
            const encryptedIdentifier = await protectData(
                identifier,
                identifier.includes('@') ? 'email' : 'phone'
            );

            agent = await prisma.agent.findFirst({
                where: {
                    OR: [
                        { email: encryptedIdentifier },
                        { phone: encryptedIdentifier },
                    ],
                    isActive: true,
                    isDeleted: false,
                },
                include: { profile: true },
            });
        }

        if (!agent?.profile) {
            return { success: false, message: 'Invalid credentials provided' };
        }

        const decryptedAccessCode = await unprotectData(agent.profile.accessCode, 'system-code');

        if (accessCode !== decryptedAccessCode) {
            return { success: false, message: 'Invalid credentials provided' };
        }

        const cookieStore = await cookies();
        cookieStore.set('agent-session', agent.id, {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
            sameSite: 'lax',
        });

        return { success: true };
    } catch (error) {
        console.error('Authentication error:', error);
        return { success: false, message: 'An error occurred during authentication' };
    }
}

export async function appSignIn(
    identifier: string,
    accessCode?: string,
    provider?: 'google' | 'facebook'
) {
    try {
        let agent;

        if (provider) {
            const encryptedEmail = await protectData(identifier, 'email');
            agent = await prisma.agent.findFirst({
                where: {
                    email: encryptedEmail,
                    isActive: true,
                    isDeleted: false,
                },
                include: { profile: true },
            });

            if (!agent) {
                return {
                    success: false,
                    message: 'No account with this email exists. Please sign up first.'
                };
            }
        } else {
            if (!accessCode) {
                return { success: false, message: 'Access code is required' };
            }
            return await signIn(identifier, accessCode);
        }

        const cookieStore = await cookies();
        cookieStore.set('agent-session', agent.id, {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
            sameSite: 'lax',
        });

        return { success: true };
    } catch (error) {
        console.error('Authentication error:', error);
        return { success: false, message: 'Authentication failed' };
    }
}

export async function signOut() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete('agent-session');
        return { success: true };
    } catch (error) {
        console.error('Sign out error:', error);
        return { success: false, message: 'Failed to sign out' };
    }
}

export async function isAuthenticated() {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('agent-session')?.value;

        if (!session) return false;

        const agent = await prisma.agent.findUnique({
            where: {
                id: session,
                isActive: true,
                isDeleted: false,
            },
            select: { id: true },
        });

        return !!agent;
    } catch (error) {
        console.error('Session verification error:', error);
        return false;
    }
}