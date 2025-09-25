import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
export async function encryptText(password: string): Promise<string> {
  try {
    if (!password || typeof password !== 'string') {
      throw new Error('Invalid password input');
    }

    const saltRounds: number = 12;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error('Error encrypting password:', error);
    throw new Error('Failed to hash password');
  }
}
export async function comparePasswords(
  password: string,
  hash: string,
): Promise<boolean> {
  try {
    if (
      !password ||
      !hash ||
      typeof password !== 'string' ||
      typeof hash !== 'string'
    ) {
      throw new Error('Invalid input for password comparison');
    }

    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw new Error('Failed to compare passwords');
  }
}

export const generateToken = (): string => {
  return randomBytes(32).toString('hex');
};

export async function compareText(
  plainText: string,
  hashedText: string,
): Promise<boolean> {
  return await bcrypt.compare(plainText, hashedText);
}
