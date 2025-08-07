'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

export async function signIn(identifier: string, accessCode: string) {
    try {
        const agent = await prisma.agent.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { phone: identifier },
                    { profile: { accessCode: identifier } },
                ],
                isActive: true,
                isDeleted: false,
            },
            include: { profile: true },
        });

        if (!agent?.profile || !(await bcrypt.compare(accessCode, agent.profile.accessCode))) {
            return { success: false, message: 'Invalid credentials' };
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
            // OAuth login - just match by email
            agent = await prisma.agent.findFirst({
                where: {
                    email: identifier, // identifier should be the email from OAuth
                    isActive: true,
                    isDeleted: false,
                },
                include: { profile: true },
            });
        } else {
            // Regular login flow remains the same
            if (!accessCode) {
                return { success: false, message: 'Access code is required' };
            }

            agent = await prisma.agent.findFirst({
                where: {
                    OR: [
                        { email: identifier },
                        { phone: identifier },
                    ],
                    isActive: true,
                    isDeleted: false,
                },
                include: { profile: true },
            });

            if (!agent?.profile || agent.profile.accessCode !== accessCode) {
                return { success: false, message: 'Invalid credentials' };
            }
        }

        if (!agent) {
            return {
                success: false,
                message: provider
                    ? 'No account with this email exists'
                    : 'Account not found'
            };
        }

        // Set session cookie
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
    const cookieStore = await cookies();
    cookieStore.delete('agent-session');
    redirect('/agent/signin');
}

export async function isAuthenticated() {
    const cookieStore = await cookies();
    const session = cookieStore.get('agent-session')?.value;
    if (!session) return false;

    try {
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

// Generate a secure random access code
export async function generateAccessCode(length = 8): Promise<string> {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No ambiguous characters
    const bytes = crypto.getRandomValues(new Uint8Array(length));
    return Array.from(bytes, (byte) => chars[byte % chars.length]).join('');
}

// Send access code via email (mock implementation)
export async function sendAccessCode(email: string, code: string) {
    console.log(`Mock email sent to ${email} with code: ${code}`);
    // In production: integrate with SendGrid, Postmark, etc.
}