"use server";

import { apiFetchClient } from "@admin/lib/serverFetch";
import type { UserIncludeCredentials } from "@packages/db/sharedTypes";
import { APIResult } from "@packages/db/sharedTypes";
import { BaseUser } from "@packages/schema";

export async function getUserCredentials(email: string): Promise<UserIncludeCredentials | null> {
  const result = await apiFetchClient<APIResult<UserIncludeCredentials>>(
    `/users/email?email=${email}`,
    {},
    true,
  );

  if (result.status !== "success" || result.payload.status !== "success") {
    return null;
  } else {
    return result.payload.data;
  }
}

export async function createUser(payload: FormData) {
  const fields = Object.fromEntries(payload);

  const { name, password, email, submission_url } = fields;

  return await apiFetchClient<APIResult<BaseUser>>(submission_url as string, {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export type F = ReturnType<typeof createUser>;
