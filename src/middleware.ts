import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const AUTH_COOKIE_NAME = 'pms_auth_token';
const JWT_SECRET = process.env.JWT_SECRET || 'medicare_super_secret_jwt_key_2026_secure_random_string_xyz';
const encodedKey = new TextEncoder().encode(JWT_SECRET);

const PROTECTED_ROUTES = ['/dashboard', '/patients', '/appointments', '/records'];
const AUTH_ROUTES = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  let isValidSession = false;

  if (token) {
    try {
      await jwtVerify(token, encodedKey, { algorithms: ['HS256'] });
      isValidSession = true;
    } catch {
      isValidSession = false;
    }
  }

  // Check if current route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if current route is an auth route (login/register)
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Redirect unauthenticated users trying to access protected routes to /login
  if (isProtectedRoute && !isValidSession) {
    const redirectUrl = new URL('/login', request.url);
    const fullPath = pathname + (search || '');
    if (pathname !== '/') {
      redirectUrl.searchParams.set('redirect', fullPath);
    }
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users away from /login and /register to /dashboard
  if (isAuthRoute && isValidSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/patients/:path*',
    '/appointments/:path*',
    '/records/:path*',
    '/login',
    '/register',
  ],
};
