import { NextResponse } from "next/server";

const unauthRoutes = ["/login", "/signup"];

export async function middleware(req) {
  const token = req.cookies.get("refresh_token")?.value;

  // console.log(token)
  const { pathname } = req.nextUrl;

  if (token && unauthRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If route is /login or /signup, allow even without token
  if (unauthRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  //  For all other protected routes
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/profile/:path", "/@:path*"], // middleware runs only here
};
