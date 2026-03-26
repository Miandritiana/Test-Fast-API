import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Define protected routes
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isAuthRoute = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');

  // 1. If trying to access dashboard without a token, redirect to sign-in
  if (isDashboardRoute && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/sign-in';
    // Optional: add a redirect parameter to return to the original page after login
    // url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // 2. If already logged in and trying to access auth pages, redirect to dashboard
  if (isAuthRoute && token) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Config to match only relevant paths for performance
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/sign-in',
    '/sign-up',
  ],
};
