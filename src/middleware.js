import { NextResponse } from "next/server";
import { decodeJwt } from "jose";

const unauthRoutes = ["/login", "/signup"];

// Check if a JWT is missing, invalid, or expired
function isTokenExpired(token) {
  if (!token || typeof token !== "string") return true;
  try {
    const payload = decodeJwt(token);
    if (!payload) return true;
    if (typeof payload.exp === "number") {
      return Date.now() >= payload.exp * 1000;
    }
    return false;
  } catch {
    return true;
  }
}

export async function middleware(req) {
  // Support common cookie name variants
  const refreshToken =
    req.cookies.get("refresh_token")?.value ||
    req.cookies.get("refesh-token")?.value ||
    req.cookies.get("refresh-token")?.value ||
    req.cookies.get("refreshToken")?.value;

  const accessToken =
    req.cookies.get("access_token")?.value ||
    req.cookies.get("access-token")?.value ||
    req.cookies.get("accessToken")?.value;

  const { pathname, searchParams } = req.nextUrl;

  const hasValidRefresh = Boolean(refreshToken && !isTokenExpired(refreshToken));
  const hasValidAccess = Boolean(accessToken && !isTokenExpired(accessToken));
  const isAuthenticated = hasValidRefresh || hasValidAccess;

  const hasAnyCookie = Boolean(refreshToken || accessToken);
  const forceReauth = searchParams.has("force") || searchParams.has("reauth");

  const deleteAuthCookies = (res) => {
    [
      "refresh_token",
      "refesh-token",
      "refresh-token",
      "refreshToken",
      "access_token",
      "access-token",
      "accessToken",
    ].forEach((name) => {
      res.cookies.delete(name);
    });
  };

  // 1. If user is authenticated with a valid token:
  // Prevent logged-in users from seeing login/signup pages unless force reauth requested
  if (isAuthenticated && !forceReauth && unauthRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 2. If user is NOT authenticated (token expired or not exists):
  // Allow unauthenticated routes (/login, /signup) and delete any stale/dead cookies
  if (unauthRoutes.includes(pathname)) {
    const response = NextResponse.next();
    if (!isAuthenticated && hasAnyCookie) {
      deleteAuthCookies(response);
    }
    return response;
  }

  // 3. Protected routes: redirect unauthenticated users to /login and delete stale cookies
  if (!isAuthenticated) {
    const response = NextResponse.redirect(new URL("/login", req.url));
    if (hasAnyCookie) {
      deleteAuthCookies(response);
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/profile/:path", "/@:path*"],
};


