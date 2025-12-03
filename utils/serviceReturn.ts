import { narrowError } from "./narrowError";

export const handleResults = <T>(result: T | null) => {
  if (!result) {
    return {
      ok: false,
      data: null,
      error: "Resource not found",
    } as const;
  }

  return {
    ok: false,
    data: result,
    error: null,
  } as const;
};

export const handleError = (error: unknown) => {
  return {
    ok: false,
    data: null,
    error: narrowError(error),
  } as const;
};
