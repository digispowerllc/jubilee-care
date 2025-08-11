import {
    encryptHighestSecurity,
    encryptStrong,
    encryptBasic,
    decryptHighestSecurity,
    decryptStrong,
    decryptBasic,
    hashData,
    verifyHash
} from '@/lib/security/encryption';

type ProtectionTier = 'government' | 'email' | 'phone' | 'location' | 'name' | 'system-code';

export async function protectData(data: string, tier: ProtectionTier): Promise<string> {
    if (!data) return '';

    switch (tier) {
        case 'government':
            return await encryptHighestSecurity(data);
        case 'email':
        case 'phone':
            return await encryptStrong(data);
        case 'location':
        case 'name':
            return await encryptBasic(data);
        case 'system-code':
            return await hashData(data);
        default:
            return data;
    }
}

export async function unprotectData(encryptedData: string, tier: ProtectionTier): Promise<string> {
    if (!encryptedData) return '';

    switch (tier) {
        case 'government':
            return await decryptHighestSecurity(encryptedData);
        case 'email':
        case 'phone':
            return await decryptStrong(encryptedData);
        case 'location':
        case 'name':
            return await decryptBasic(encryptedData);
        case 'system-code':
            return encryptedData; // Hashes can't be decrypted
        default:
            return encryptedData;
    }
}

// Export verifyHash directly from edgeEncryption
export { verifyHash };

// Type-safe verification function for system codes/passwords
export async function verifyProtectedData(
    plainText: string,
    protectedData: string,
    tier: ProtectionTier
): Promise<boolean> {
    if (!plainText || !protectedData) return false;

    if (tier === 'system-code') {
        return await verifyHash(plainText, protectedData);
    }

    // For encrypted data, we need to compare after decryption
    try {
        const decrypted = await unprotectData(protectedData, tier);
        return decrypted === plainText;
    } catch (error) {
        console.error('Data verification failed:', error);
        return false;
    }
}