// Configuration - must be 32 characters (256 bits)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-32-characters-long!';
const IV_LENGTH = 16; // For AES, this is always 16

// Helper function to import key
async function getKeyMaterial(password: string) {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
}

// Helper function to derive key
async function deriveKey(password: string, salt: Uint8Array, keyUsage: KeyUsage[]) {
  const keyMaterial = await getKeyMaterial(password);
  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: new Uint8Array(salt),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    keyUsage
  );
}

// Tier 1: Highest Security (Government IDs)
export async function encryptHighestSecurity(data: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await deriveKey(ENCRYPTION_KEY, salt, ['encrypt']);
  
  const encoded = new TextEncoder().encode(data);
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );
  
  return [
    Buffer.from(salt).toString('hex'),
    Buffer.from(iv).toString('hex'),
    Buffer.from(encrypted).toString('hex')
  ].join(':');
}

export async function decryptHighestSecurity(encryptedData: string): Promise<string> {
  const [saltHex, ivHex, contentHex] = encryptedData.split(':');
  const salt = Uint8Array.from(Buffer.from(saltHex, 'hex'));
  const iv = Uint8Array.from(Buffer.from(ivHex, 'hex'));
  const content = Uint8Array.from(Buffer.from(contentHex, 'hex'));
  
  const key = await deriveKey(ENCRYPTION_KEY, salt, ['decrypt']);
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    content
  );
  
  return new TextDecoder().decode(decrypted);
}

// Tier 2: Strong Encryption (Phone/Email)
export async function encryptStrong(data: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(ENCRYPTION_KEY.padEnd(32, '\0').slice(0, 32)),
    { name: 'AES-CBC' },
    false,
    ['encrypt']
  );
  
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-CBC', iv },
    key,
    new TextEncoder().encode(data)
  );
  
  return [
    Buffer.from(iv).toString('hex'),
    Buffer.from(encrypted).toString('hex')
  ].join(':');
}

export async function decryptStrong(encryptedData: string): Promise<string> {
  const [ivHex, contentHex] = encryptedData.split(':');
  const iv = Uint8Array.from(Buffer.from(ivHex, 'hex'));
  const content = Uint8Array.from(Buffer.from(contentHex, 'hex'));
  
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(ENCRYPTION_KEY.padEnd(32, '\0').slice(0, 32)),
    { name: 'AES-CBC' },
    false,
    ['decrypt']
  );
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-CBC', iv },
    key,
    content
  );
  
  return new TextDecoder().decode(decrypted);
}

// Tier 3: Basic Encryption (Names, Locations)
export const encryptBasic = encryptStrong;
export const decryptBasic = decryptStrong;

// Tier 4: Hashing Only (System Codes)
export async function hashData(data: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}