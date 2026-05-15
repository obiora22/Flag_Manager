"use server";

import { apiFetchClient } from "@admin/lib/serverFetch";
import { APIResult } from "@packages/db/sharedTypes";
import { AccountInputSchema } from "@packages/schema";
import z from "zod";

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

// const API_URL =
//   process.env.NODE_ENV === "development"
//     ? process.env.DEVELOPMENT_API_URL
//     : process.env.PRODUCTION_API_URL;

const API_URL = process.env.API_URL;

export async function accountRegistrationAction(
  prevState: AccountRegistrationState,
  payload: FormData,
): Promise<AccountRegistrationState> {
  console.log("server action!", { payload }, process.env);

  const body = {
    firstname: payload.get("firstName"),
    lastname: payload.get("lastName"),
    email: payload.get("email"),
    organizationName: payload.get("organizationName"),
    password: payload.get("password"),
    passwordConfirmation: payload.get("passwordConfirmation"),
  };

  const { data, error } = AccountInputSchema.safeParse(body);

  if (error) {
    return {
      status: "error",
      error: String(z.flattenError(error)),
    };
  }

  const result = await apiFetchClient<APIResult<AccountRegistrationResult>>("/accounts", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });

  console.log("Account registeration", { result });

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
