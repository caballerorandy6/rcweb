import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Protected routes (all routes in (admin) folder)
  const protectedRoutes = [
    "/admin-dashboard",
    "/newsletter",
    "/contacts",
    "/sms",
    "/manage-invoices",
    "/projects",
  ];

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isLoginPage = pathname === "/admin/login";

  // If logged in and trying to access login, redirect to dashboard
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin-dashboard", req.url));
  }

  // If not logged in and trying to access protected route
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // Verify ADMIN role for protected routes
  if (isProtectedRoute && isLoggedIn && req.auth?.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.png$|.*\\.jpg$|.*\\.webp$|.*\\.ico$).*)",
  ],
};
