import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextRequest } from "next/server";

type AppRouteHandlerFn = (
  req: NextRequest,
  ctx: { params: Promise<Record<string, string | string[]>> }
) => void | Response | Promise<Response | void>;

const { auth } = NextAuth(authConfig);

export const proxy: AppRouteHandlerFn = auth(async () => {});

console.log("Proxy running!");
export const config = {
  matcher: "/",
};
