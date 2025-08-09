import {
    encryptHighestSecurity,
    decryptHighestSecurity,
    encryptStrong,
    decryptStrong,
    encryptBasic,
    decryptBasic,
    hashData,
    verifyHash
} from '@/lib/encryptorGenerators/encryption';

type DataType =
    | 'government-id'
    | 'phone'
    | 'email'
    | 'name'
    | 'location'
    | 'system-code';

export function protectData(data: string, type: DataType): Promise<string> | string {
    switch (type) {
        case 'government-id':
            return encryptHighestSecurity(data);
        case 'phone':
        case 'email':
            return encryptStrong(data);
        case 'name':
        case 'location':
            return encryptBasic(data);
        case 'system-code':
            return hashData(data);
        default:
            throw new Error(`Unknown data type: ${type}`);
    }
}

export function unprotectData(protectedData: string, type: Exclude<DataType, 'system-code'>): string {
    switch (type) {
        case 'government-id':
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
    return verifyHash(data, hash);
}