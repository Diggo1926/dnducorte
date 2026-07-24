import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifySessionValue } from "@/lib/session-core";

export async function middleware(request: NextRequest) {
  const value = request.cookies.get(COOKIE_NAME)?.value;
  const session = value ? await verifySessionValue(value) : null;

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/painel/:path*"],
};
