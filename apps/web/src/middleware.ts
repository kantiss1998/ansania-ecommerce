import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for route protection and authentication
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get auth token from cookies or headers
    const token = request.cookies.get('auth_token')?.value;

    // Protected routes that require authentication
    const protectedRoutes = [
        '/profile',
        '/orders',
        '/wishlist',
        '/addresses',
        '/checkout',
        '/admin',
    ];

    // Auth routes that should redirect if already authenticated
    const authRoutes = ['/auth/login', '/auth/register'];

    // Check if current path is protected
    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    // Check if current path is auth route
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    // Redirect to login if accessing protected route without token
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect to home if accessing auth routes with token
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

/**
 * Middleware config - specify which routes to run middleware on
 */
export const config = {
    matcher: [
        '/profile/:path*',
        '/orders/:path*',
        '/wishlist/:path*',
        '/addresses/:path*',
        '/checkout/:path*',
        '/admin/:path*',
        '/auth/login',
        '/auth/register',
    ],
};
