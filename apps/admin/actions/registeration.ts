"use server";
import { AccountInputSchema } from "@schema/account.schema";
import { narrowError } from "@repo/utils/narrowError";

export interface AccountRegistrationState {
  ok: boolean;
  data: null | unknown;
  error: string | null;
}

export async function accountRegistration(
  prevState: AccountRegistrationState,
  payload: FormData
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

  let response;

  try {
    response = await fetch(`${process.env.DEVELOPMENT_API_URL}/accounts`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return response.json();
  } catch (err) {
    return {
      ok: false,
      data: null,
      error: narrowError(err).message,
    };
  }
}
