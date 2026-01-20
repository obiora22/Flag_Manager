import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextRequest, NextResponse } from "next/server";
type AppRouteHandlerFn = (
  req: NextRequest,
  ctx: { params: Promise<Record<string, string | string[]>> }
) => void | Response | Promise<Response | void>;

const { auth } = NextAuth(authConfig);

export const proxy: AppRouteHandlerFn = auth(async (req: NextRequest) => {
  const csrf_token = req.cookies.get("authjs.csrf-token")?.value;
  const session_token = req.cookies.get("authjs.session-token")?.value;

  const base_url = process.env.BASE_URL || "http:localhost:3000";

  if (csrf_token) {
    console.log({ csrf_token }, { session_token });
  }

  if (!session_token) {
    return NextResponse.redirect(base_url + "/api/auth/signin");
  }
});

console.log("Proxy running!");
export const config = {
  matcher: "/",
};
