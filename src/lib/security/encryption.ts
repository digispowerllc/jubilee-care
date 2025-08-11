// src/lib/security/encryption.ts
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Configuration (store these in AWS Secrets Manager/Vault)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!; // 64-char hex
const FIXED_IV_EMAIL = process.env.FIXED_IV_EMAIL!; // Store in env
const FIXED_IV_PHONE = process.env.FIXED_IV_PHONE!; // Store in env
const SALT_ROUNDS = 12;

// Tier 1: Highest Security (AES-GCM with random IV)
export function encryptHighestSecurity(data: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${cipher.getAuthTag().toString('hex')}:${encrypted}`;
}

export function decryptHighestSecurity(encryptedData: string): string {
  const [ivHex, authTagHex, content] = encryptedData.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(content, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Tier 2: Searchable Fields (Fixed-IV AES-CBC)
export function encryptSearchable(data: string, type: 'email' | 'phone'): string {
  const iv = type === 'email' ? FIXED_IV_EMAIL : FIXED_IV_PHONE;
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
}

export function decryptSearchable(encryptedData: string, type: 'email' | 'phone'): string {
  const iv = type === 'email' ? FIXED_IV_EMAIL : FIXED_IV_PHONE;
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  return decipher.update(encryptedData, 'hex', 'utf8') + decipher.final('utf8');
}

// Tier 3: Basic Encryption (Random-IV AES-CBC)
export function encryptBasic(data: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  return `${iv.toString('hex')}:${cipher.update(data, 'utf8', 'hex') + cipher.final('hex')}`;
}

export function decryptBasic(encryptedData: string): string {
  const [ivHex, content] = encryptedData.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  return decipher.update(content, 'hex', 'utf8') + decipher.final('utf8');
}

// Hashing Utilities
export async function hashData(data: string): Promise<string> {
  return bcrypt.hash(data, SALT_ROUNDS);
}

export async function verifyHash(data: string, hash: string): Promise<boolean> {
  return bcrypt.compare(data, hash);
}

export function generateSearchHash(data: string): string {
  return crypto.createHash('sha256')
    .update(data + process.env.HASH_PEPPER)
    .digest('hex');
}