import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Define route categories
  const isAdminRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  const isCustomerRoute = pathname.startsWith("/my-events") || pathname.startsWith("/menu-builder");
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
  
  // Fix: Check for exact match for root "/" to avoid matching everything
  // Excluded /gallery so customers can view it (linked from dashboard)
  const publicPathPrefixes = ["/menu", "/contact", "/plan-menu"];
  const isPublicRoute = pathname === "/" || publicPathPrefixes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const userRole = session?.user?.role;

  // If accessing auth pages while logged in, redirect to appropriate dashboard
  if (isAuthRoute && session) {
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/my-events", request.url));
    }
  }

  // Protect admin routes - only ADMIN role allowed
  if (isAdminRoute) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (userRole !== "ADMIN") {
      // Non-admin users trying to access admin routes → redirect to their dashboard
      return NextResponse.redirect(new URL("/my-events", request.url));
    }
  }

  // Protect customer routes - requires login
  if (isCustomerRoute) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect logged-in customers away from public pages to their dashboard
  if (isPublicRoute && session && userRole === "CUSTOMER") {
    // Check if the current path is NOT already the dashboard or an API route
    // (Double check to prevent loops, though isPublicRoute def shouldn't include /my-events)
    return NextResponse.redirect(new URL("/my-events", request.url));
  }

  // Allow access to public routes
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
