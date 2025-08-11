// src/lib/security/dataProtection.ts
import {
    encryptHighestSecurity,
    encryptSearchable,
    encryptBasic,
    decryptHighestSecurity,
    decryptSearchable,
    decryptBasic,
    hashData,
    verifyHash,
    generateSearchHash
} from '@/lib/security/encryption';

type ProtectionTier = 'government' | 'email' | 'phone' | 'location' | 'name' | 'system-code';

export async function protectData(
    data: string,
    tier: ProtectionTier
): Promise<{
    encrypted: string;
    searchHash?: string;
}> {
    if (!data) return { encrypted: '' };

    switch (tier) {
        case 'government':
            return { encrypted: encryptHighestSecurity(data) };

        case 'email':
            return {
                encrypted: encryptSearchable(data, 'email'),
                searchHash: generateSearchHash(data.toLowerCase())
            };

        case 'phone':
            return {
                encrypted: encryptSearchable(data, 'phone'),
                searchHash: generateSearchHash(data)
            };

        case 'location':
        case 'name':
            return { encrypted: encryptBasic(data) };

        case 'system-code':
            return { encrypted: await hashData(data) };

        default:
            return { encrypted: data };
    }
}

export async function unprotectData(
    encryptedData: string,
    tier: ProtectionTier
): Promise<string> {
    if (!encryptedData) return '';

    switch (tier) {
        case 'government':
            return decryptHighestSecurity(encryptedData);

        case 'email':
            return decryptSearchable(encryptedData, 'email');

        case 'phone':
            return decryptSearchable(encryptedData, 'phone');

        case 'location':
        case 'name':
            return decryptBasic(encryptedData);

        case 'system-code':
            return encryptedData;

        default:
            return encryptedData;
    }
}

export { verifyHash };

export async function verifyProtectedData(
    plainText: string,
    protectedData: string,
    tier: ProtectionTier
): Promise<boolean> {
    if (!plainText || !protectedData) return false;

    if (tier === 'system-code') {
        return verifyHash(plainText, protectedData);
    }

    try {
        const decrypted = await unprotectData(protectedData, tier);
        return decrypted === plainText;
    } catch (error) {
        console.error('Data verification failed:', error);
        return false;
    }
}