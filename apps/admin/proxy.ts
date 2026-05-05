import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextRequest, NextResponse } from "next/server";

type AppRouteHandlerFn = (
  req: NextRequest,
  ctx: { params: Promise<Record<string, string | string[]>> },
) => void | Response | Promise<Response | void>;

const { auth } = NextAuth(authConfig);

export const proxy: AppRouteHandlerFn = auth(async (request: NextRequest) => {
  const { pathname, searchParams } = request.nextUrl;
  const protectedRoutes = ["/projects", "/flags"];
  const authRoutes = ["/signin", "/signup", "/reset-password"];

  const isProtectedRoute =
    pathname === "/" || protectedRoutes.some((route) => pathname.startsWith(route));

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  const csrf_token = request.cookies.get("authjs.csrf-token")?.value;
  const session_token = request.cookies.get("authjs.session-token")?.value;

  if (csrf_token) {
    console.log({ csrf_token }, { session_token });
  }

  if (isProtectedRoute && !session_token) {
    const loginUrl = new URL("/signin", request.url);
    loginUrl.searchParams.set("from", pathname);

    searchParams.forEach(([key, value]) => {
      if (key && key !== "from" && value) {
        loginUrl.searchParams.set(key, value);
      }
    });

    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && session_token) {
    return NextResponse.redirect("/");
  }

  return NextResponse.next();
});

console.log("Proxy running!");

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, robots.txt, sitemap.xml
     * - public folder (images, fonts, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|public).*)",
  ],
};
