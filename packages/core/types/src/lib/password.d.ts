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
/**
 * Hash a password using the same format as Better Auth
 */
export declare function hashPassword(password: string): Promise<string>;
/**
 * Verify a password against a hash
 */
export declare function verifyPassword(hash: string, password: string): Promise<boolean>;
