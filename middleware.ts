import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Public routes
  if (pathname === "/login" || pathname === "/register") {
    if (session) {
      // Redirect to appropriate dashboard based on role
      const role = session.user.role;
      if (role === "STUDENT") {
        return NextResponse.redirect(new URL("/dashboard/mahasiswa", request.url));
      } else if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/admin", request.url));
      } else if (role === "WADIR3") {
        return NextResponse.redirect(new URL("/dashboard/wadir", request.url));
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Protected routes
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const role = session.user.role;

    // Role-based access control
    if (pathname.startsWith("/dashboard/mahasiswa") && role !== "STUDENT") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (pathname.startsWith("/dashboard/wadir") && role !== "WADIR3") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
