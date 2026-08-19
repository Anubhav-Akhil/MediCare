import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { User } from '@/types';

export const AUTH_COOKIE_NAME = 'pms_auth_token';
const JWT_SECRET_KEY = process.env.JWT_SECRET || 'medicare_super_secret_jwt_key_2026_secure_random_string_xyz';
const encodedKey = new TextEncoder().encode(JWT_SECRET_KEY);

export interface TokenPayload {
  id: string;
  email: string;
  name: string;
  role: 'Doctor' | 'Admin' | 'Staff' | 'Nurse';
  department?: string;
  [key: string]: unknown;
}

/**
 * Sign a JWT token using jose (Edge and Node compatible)
 */
export async function signToken(payload: TokenPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

/**
 * Verify a JWT token using jose (Edge and Node compatible)
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Helper to get currently logged in user session from server-side cookies
 */
export async function getSessionUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload) return null;

    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      department: payload.department,
      createdAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}
