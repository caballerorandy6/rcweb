// middleware.ts

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Definir rutas protegidas (todas las que están en carpeta (admin))
  const protectedRoutes = [
    "/admin-dashboard",
    "/newsletter",
    "/contacts",
    "/sms",
    // Agregar más rutas protegidas aquí cuando las crees
  ];

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isLoginPage = pathname === "/login";

  // Si está logueado e intenta acceder a login, redirigir
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin-dashboard", req.url));
  }

  // Si no está logueado e intenta acceder a ruta protegida
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Verificar rol ADMIN para rutas protegidas
  if (isProtectedRoute && isLoggedIn && req.auth?.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)"],
};
