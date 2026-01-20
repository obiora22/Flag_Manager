"use server";

import { apiFetchClient, ApiFetchResult } from "@admin/lib/fetchClient";
import { narrowError } from "@repo/utils/narrowError";
import { BaseUser } from "@schema/user.schema";
import { UserIncludeCredentials } from "@api/src/services/userServices";

export async function getUserByEmail(path: string) {
  const { ok, data, error } = await apiFetchClient<BaseUser>(path);
  return { ok, data, error };
}

export async function getUserCredentials(
  email: string
): Promise<ApiFetchResult<UserIncludeCredentials>> {
  let response;

  try {
    response = await fetch(`${process.env.DEVELOPMENT_API_URL}/users/email/${email}`);
    return response.json();
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

  console.log({ fields });

  const { name, password, email, submission_url } = fields;

  const response = await apiFetchClient<BaseUser>(submission_url as string, {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  console.log({ response });
  return response;
}

export type F = ReturnType<typeof createUser>;
