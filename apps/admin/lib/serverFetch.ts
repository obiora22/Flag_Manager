import { auth } from "@admin/auth.ts";
import jwt from "jsonwebtoken";
type FetchResponse<T> =
  | {
      status: "success";
      payload: T;
    }
  | {
      status: "network-error";
      error: string;
    }
  | {
      status: "api-error";
      error: string;
    };

export async function apiFetchClient<T>(
  path: string,
  options: RequestInit = {},
): Promise<FetchResponse<T>> {
  const API_URL = process.env.DEVELOPMENT_API_URL;
  const AUTH_SECRET = process.env.AUTH_SECRET;
  const session = await auth();

  if (!AUTH_SECRET || !API_URL)
    return {
      status: "api-error",
      error: "Request failed: Missing environment variable(s)",
    };

  if (!session) {
    return {
      status: "api-error",
      error: "User is not authenticated!",
    };
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
  console.log(`Fetch ...${API_URL}${path}`);
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    return {
      status: "network-error",
      error: await response.text(),
    };
  }
  return {
    status: "success",
    payload: await response.json(),
  };
}
