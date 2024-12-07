import { pbkdf2, randomBytes } from 'crypto';
import { promisify } from 'util';

const pbkdf2Async = promisify(pbkdf2);
const randomBytesAsync = promisify(randomBytes);

const SALT_LENGTH = 16;
const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';

export async function hashPassword(password: string): Promise<string> {
  const saltBuffer = await randomBytesAsync(SALT_LENGTH);
  const salt = saltBuffer.toString('hex');
  const hashBuffer = await pbkdf2Async(password, salt, ITERATIONS, KEY_LENGTH, DIGEST);
  const hash = hashBuffer.toString('hex');
  return `${salt}:${hash}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [salt, originalHash] = storedHash.split(':');
  const hashBuffer = await pbkdf2Async(password, salt, ITERATIONS, KEY_LENGTH, DIGEST);
  const hash = hashBuffer.toString('hex');
  return hash === originalHash;
}