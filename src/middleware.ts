import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Basic session check based on cookie presence
  // Supports both standard and production (__Secure-) cookie names
  const sessionToken = 
    request.cookies.get("__Secure-better-auth.session_token")?.value ||
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("better_auth_session_token")?.value;

  const isAuthPage = pathname.startsWith("/signin") || pathname.startsWith("/signup");
  const isProtectedRoute = 
    pathname.startsWith("/user") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/admin");

  // If authenticated and on an auth page, redirect to dashboard
  if (isAuthPage && sessionToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If not authenticated and trying to access a protected route
  if (isProtectedRoute && !sessionToken) {
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Admin routes protection would ideally need a role check from the session.
  // Since we can't reliably decode the JWT here without a secret or a call to the backend,
  // we primarily rely on authentication. Role-based protection should also be handled 
  // on the specific page components or via an API call to ensure accuracy.
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/user/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/signin",
    "/signup",
  ],
};
