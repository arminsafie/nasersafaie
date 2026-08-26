import { NextResponse, type NextRequest } from "next/server";

// Note: proxy runs on the Edge runtime, which doesn't support Node's
// `crypto` HMAC APIs the same way route handlers do, so this layer only
// checks that a session cookie is *present*. The real cryptographic
// verification (signature + expiry) happens again in every /api/admin/*
// route handler via verifySessionToken() before any read or write — this
// proxy is a fast redirect for the page shell, not the security boundary
// itself.
const ADMIN_COOKIE_NAME = "ns_admin_session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";
  const hasCookie = Boolean(request.cookies.get(ADMIN_COOKIE_NAME)?.value);

  if (pathname.startsWith("/admin") && !isLoginPage && !hasCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/api/admin") && !isLoginApi && !hasCookie) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
