import {
    encryptHighestSecurity,
    encryptStrong,
    encryptBasic,
    decryptHighestSecurity,
    decryptStrong,
    decryptBasic,
    hashData
} from '@/lib/security/edgeEncryption';

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