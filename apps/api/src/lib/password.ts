/**
 * Password hashing utilities compatible with Better Auth's format
 * 
 * Better Auth uses scrypt with specific parameters via @noble/hashes.
 * We replicate the same format: salt:key (both hex-encoded)
 * 
 * Better Auth config:
 * - N: 16384 (CPU/memory cost)
 * - r: 16 (block size)
 * - p: 1 (parallelization)
 * - dkLen: 64 (derived key length)
 */

import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

/**
 * Hash a password using the same format as Better Auth
 */
export async function hashPassword(password: string): Promise<string> {
  // Generate a random 16-byte salt and encode as hex
  const saltBuffer = randomBytes(16);
  const salt = saltBuffer.toString("hex");
  
  // Use scrypt to generate the key with Better Auth's config
  // Important: Better Auth passes the hex-encoded salt string, not the buffer
  const key = scryptSync(
    password.normalize("NFKC"),
    salt, // Pass the hex string, not the buffer!
    64, // keylen (dkLen)
    {
      N: 16384,
      r: 16,
      p: 1,
      maxmem: 128 * 16384 * 16 * 2, // From Better Auth: 128 * N * r * 2
    }
  );
  
  // Return in Better Auth format: salt:key
  return `${salt}:${key.toString("hex")}`;
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  const [salt, expectedKey] = hash.split(":");
  if (!salt || !expectedKey) {
    throw new Error("Invalid password hash format");
  }
  
  // Use the hex-encoded salt string directly
  const key = scryptSync(
    password.normalize("NFKC"),
    salt, // Pass the hex string directly
    64,
    {
      N: 16384,
      r: 16,
      p: 1,
      maxmem: 128 * 16384 * 16 * 2,
    }
  );
  
  // Use constant-time comparison
  const keyBuffer = Buffer.from(expectedKey, "hex");
  return key.length === keyBuffer.length && timingSafeEqual(key, keyBuffer);
}


