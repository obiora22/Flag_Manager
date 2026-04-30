import jwt from "jsonwebtoken";
import { auth } from "@admin/auth.ts";
import { NextResponse } from "next/server";

export async function GET() {
  const AUTH_SECRET = process.env.AUTH_SECRET;
  const session = await auth();

  if (!AUTH_SECRET)
    return NextResponse.json({
      token: null,
      error: "secret is  required",
    });

  if (!session) {
    return NextResponse.json({
      token: null,
      error: "user is not authenticated",
    });
  }

  const token = jwt.sign(
    {
      sub: session.user.id,
      activeOrgId: session.activeOrgId,
      activeRole: session.activeRole,
      memberships: session.user.memberships,
    },
    AUTH_SECRET,
    { expiresIn: 30 * 24 * 60 },
  );

  return NextResponse.json(token);
}
