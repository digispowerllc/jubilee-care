export function generateAgentId(): string {
  const yearSuffix = new Date().getFullYear().toString().slice(-2); // "25"
  const prefix = `JCGNIMCAC${yearSuffix}`; // "JCGA25"
  const remainingLength = 15 - prefix.length; // 15 - 6 = 9
  // Generate a random alphanumeric string of length 9
  const random = Math.random().toString(36).substring(2).toUpperCase().slice(0, remainingLength);
  return `${prefix}${random}`;
}

export function generateAccessCode(): string {
  const length = Math.floor(Math.random() * 5) + 8; // Random number between 8 and 12
  let code = '';
  while (code.length < length) {
    code += Math.random().toString(36).substring(2).toUpperCase();
  }
  return code.slice(0, length);
}

export async function generateFEPAgentId(): Promise<string> {
  const year = new Date().getFullYear().toString();
  const random = Math.random().toString(36).substring(2, 15).toUpperCase();
  return `NIMCA${year}${random}`;
}