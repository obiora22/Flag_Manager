"use server";

import { apiFetchClient } from "@admin/lib/serverFetch";
import { BaseUser } from "@schema/user.schema";
import type { UserIncludeCredentials } from "@api/lib/contracts";
import { APIResult } from "@repo/utils/serviceReturn";

export async function getUserCredentials(email: string): Promise<UserIncludeCredentials | null> {
  const result = await apiFetchClient<APIResult<UserIncludeCredentials>>(
    `/users/email?email=${email}`,
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
