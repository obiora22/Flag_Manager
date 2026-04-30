import { narrowError } from "./narrowError.ts";

export type APIResult<T> = ReturnType<typeof handleResult<T>> | ReturnType<typeof handleError>;
export const handleResult = <T>(result: T | null) => {
  return result === null
    ? ({
        status: "not-found",
      } as const)
    : ({
        status: "success",
        data: result,
      } as const);
};

export const handleError = (error: unknown) => {
  return {
    status: "error",
    error: narrowError(error).message,
  } as const;
};
