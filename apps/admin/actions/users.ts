"use server";

import { apiFetchClient, ApiFetchResult } from "@admin/lib/fetchClient";
import { narrowError } from "@repo/utils/narrowError";
import { BaseUser } from "@schema/user.schema";
import { UserIncludeCredentials } from "@api/src/services/userServices";

export async function getUserCredentials(
  email: string,
): Promise<ApiFetchResult<UserIncludeCredentials>> {
  try {
    const response = await fetch(`${process.env.DEVELOPMENT_API_URL}/users/email?email=${email}`);
    return await response.json();
  } catch (err) {
    return {
      ok: false,
      data: null,
      error: narrowError(err).message,
    };
  }
}

export async function createUser(payload: FormData) {
  const fields = Object.fromEntries(payload);

  const { name, password, email, submission_url } = fields;

  const response = await apiFetchClient<BaseUser>(submission_url as string, {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  return response;
}

export type F = ReturnType<typeof createUser>;
