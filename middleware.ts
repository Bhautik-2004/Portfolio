import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "app/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;
  const valid = token && (await verifyToken(token));

  if (pathname.startsWith("/api/files") && !valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/files/:path*"],
};
