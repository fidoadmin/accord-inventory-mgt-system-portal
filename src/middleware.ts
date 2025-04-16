// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const authKey = req.cookies.get("authKey");

  if (
    !authKey &&
    req.nextUrl.pathname !== "/login" &&
    !req.nextUrl.pathname.includes("/forgot-password")
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|auth|favicon.ico|robots.txt|images|$).*)",
    "/src/app/forgot-password",
    "/src/app/forgot-password/:passwordChangeRequestId",
  ],
};
