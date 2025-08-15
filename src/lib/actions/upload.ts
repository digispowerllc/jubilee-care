// File: src/lib/actions/upload.ts
'use server';

import cloudinary from '@/lib/config/cloudinary';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export const uploadImage = async (formData: FormData) => {
    const file = formData.get('file') as File;
    const agentId = formData.get('agentId') as string;

    if (!file || !agentId) {
        throw new Error('Missing file or agentId');
    }

    // Additional validation
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('File size exceeds 5MB limit');
    }

    try {
        // Stream the file directly to Cloudinary
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await cloudinary.uploader.upload(
            `data:${file.type};base64,${buffer.toString('base64')}`,
            {
                folder: 'jubileecare/agents',
                public_id: `user_${agentId}`,
                overwrite: true,
                resource_type: 'auto',
            }
        );
        const now = new Date();
        await prisma.$transaction([
            prisma.agentProfile.update({ where: { agentId }, data: { avatarUrl: uploadResult.secure_url, updatedAt: now } }),
            prisma.agent.update({ where: { id: agentId }, data: { avatarUrl: uploadResult.secure_url, updatedAt: now } }),
        ]);


        revalidatePath('/agent/profile');
        return { success: true, url: uploadResult.secure_url };
    } catch (error) {
        console.error('Upload error:', error);
        throw new Error('Failed to upload image');
    }
};