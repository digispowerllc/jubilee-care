import {
    encryptHighestSecurity,
    decryptHighestSecurity,
    encryptStrong,
    decryptStrong,
    encryptBasic,
    decryptBasic,
    hashData,
    verifyHash
} from '@/lib/security/encryption';

type DataType =
    | 'government'  // Changed from 'government' for consistency
    | 'phone'
    | 'email'
    | 'name'
    | 'location'
    | 'system-code';   // Changed from 'system' for clarity

export async function protectData(data: string, type: DataType): Promise<string> {
    switch (type) {
        case 'government':
            return encryptHighestSecurity(data);
        case 'phone':
        case 'email':
            return encryptStrong(data);
        case 'name':
        case 'location':
            return encryptBasic(data);
        case 'system-code':
            return await hashData(data);  // Added await since hashData is async
        default:
            throw new Error(`Unknown data type: ${type}`);
    }
}

export function unprotectData(protectedData: string, type: Exclude<DataType, 'system'>): string {
    switch (type) {
        case 'government':
            return decryptHighestSecurity(protectedData);
        case 'phone':
        case 'email':
            return decryptStrong(protectedData);
        case 'name':
        case 'location':
            return decryptBasic(protectedData);
        default:
            throw new Error(`Cannot decrypt type: ${type}`);
    }
}

export async function verifyProtectedData(data: string, hash: string): Promise<boolean> {
    return await verifyHash(data, hash);
}