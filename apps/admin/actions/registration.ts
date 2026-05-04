"use server";
import { apiFetchClient } from "@admin/lib/serverFetch";
import { APIResult } from "@repo/utils/serviceReturn";
import { AccountInputSchema } from "@schema/account.schema";

export type AccountRegistrationState =
  | {
      status: "idle";
    }
  | {
      status: "success";
      data: AccountRegistrationResult;
    }
  | {
      status: "error";
      error: string;
    };

interface AccountRegistrationResult {
  orgId: string;
  userId: string;
}

const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.DEVELOPMENT_API_URL
    : process.env.PRODUCTION_API_URL;

export async function accountRegistrationAction(
  prevState: AccountRegistrationState,
  payload: FormData,
): Promise<AccountRegistrationState> {
  console.log("server action!", { payload }, process.env);

  const body = {
    firstName: payload.get("firstName"),
    lastName: payload.get("lastName"),
    email: payload.get("email"),
    organizationName: payload.get("organizationName"),
    password: payload.get("password"),
    passwordConfirmation: payload.get("passwordConfirmation"),
  };

  const { data, error } = AccountInputSchema.safeParse(body);

  if (error) {
    return {
      status: "error",
      error: error.message,
    };
  }

  const result = await apiFetchClient<APIResult<AccountRegistrationResult>>(`${API_URL}/accounts`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (result.status !== "success" || result.payload.status !== "success") {
    return {
      status: "error",
      error: "Account registration failed",
    } as const;
  } else {
    return {
      status: "success",
      data: result.payload.data,
    } as const;
  }
}
