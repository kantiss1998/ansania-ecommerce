import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Simple JWT parser for middleware (robust version)
 */
function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

/**
 * Middleware for route protection and authentication
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth token from cookies
  const token = request.cookies.get("auth_token")?.value;

  // Validate token if exists
  let isValid = false;
  let userRole = "";
  if (token) {
    const payload = parseJwt(token);
    if (payload && payload.exp) {
      isValid = payload.exp > Date.now() / 1000;
      userRole = payload.role || "";
    }
  }

  // Protected routes that require authentication
  const protectedRoutes = ["/user", "/checkout", "/admin"];

  // Auth routes that should redirect if already authenticated
  const authRoutes = ["/auth/login", "/auth/register"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // 1. Redirect to login if accessing protected route without valid token
  if (isProtectedRoute && !isValid) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);

    const response = NextResponse.redirect(loginUrl);
    if (token) response.cookies.delete("auth_token");
    return response;
  }

  // 2. Redirect to dashboard if accessing auth routes with valid token
  if (isAuthRoute && isValid) {
    // If admin, send to admin dashboard, else send to home or profile
    const targetUrl = userRole === "admin" ? "/admin/dashboard" : "/";
    return NextResponse.redirect(new URL(targetUrl, request.url));
  }

  return NextResponse.next();
}

/**
 * Middleware config - specify which routes to run middleware on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public images/assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
