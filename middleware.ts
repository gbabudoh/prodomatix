
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const isApiRoute = nextUrl.pathname.startsWith("/api");
  const isPublicRoute = [
    "/", 
    "/login", 
    "/register",
    "/admin/login",
    "/terms", 
    "/privacy", 
    "/integrity", 
    "/docs", 
    "/sandbox"
  ].includes(nextUrl.pathname) || nextUrl.pathname.startsWith("/api/syndication") || nextUrl.pathname.startsWith("/api/reviews");

  const isAuthRoute = nextUrl.pathname === "/login" || nextUrl.pathname === "/register";
  const isAdminLoginRoute = nextUrl.pathname === "/admin/login";
  const isAdminRoute = nextUrl.pathname.startsWith("/admin") && !isAdminLoginRoute;

  // 1. API Routes handled separately
  if (isApiRoute && !isAdminRoute) {
    return null;
  }

  // 2. Redirect logged-in users away from auth pages
  if (isAuthRoute || isAdminLoginRoute) {
    if (isLoggedIn) {
      if (role === "admin") {
        return NextResponse.redirect(new URL("/admin", nextUrl));
      }
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    return null;
  }

  // 3. Protect non-public routes
  if (!isLoggedIn && !isPublicRoute) {
    // If trying to access admin routes, go to admin login
    if (nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login?reason=admin_required", nextUrl));
    }
    return NextResponse.redirect(new URL("/login?reason=unauthenticated", nextUrl));
  }

  // 4. Role Protection: Only admins can access /admin
  if (isAdminRoute && role !== "admin") {
    console.log(`[Middleware] Unauthorized Admin Access Attempt by Role: ${role}. Redirecting to dashboard.`);
    return NextResponse.redirect(new URL("/dashboard?error=unauthorized_admin", nextUrl));
  }

  return null;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
