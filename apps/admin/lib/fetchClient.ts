import { auth } from "@admin/auth.ts";
import jwt from "jsonwebtoken";

export interface ApiFetchResult<T> {
  ok: boolean;
  data: T | null;
  error: string | null;
}

export async function apiFetchClient<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiFetchResult<T>> {
  const API_URL = process.env.DEVELOPMENT_API_URL;
  const AUTH_SECRET = process.env.AUTH_SECRET;
  const session = await auth();

  if (!AUTH_SECRET || !API_URL)
    return { ok: false, data: null, error: "Request failed: Missing environment variable(s)" };

  if (!session) {
    return {
      ok: false,
      data: null,
      error: "User is not authenticated!",
    };
  }
  const token = jwt.sign(
    {
      sub: session.user.id,
    },
    AUTH_SECRET,
    { expiresIn: 30 * 24 * 60 }
  );

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) return { ok: response.ok, data: null, error: await response.text() };

  return { ok: response.ok, data: await response.json(), error: null };
}
