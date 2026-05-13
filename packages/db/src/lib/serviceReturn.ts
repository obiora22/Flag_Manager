import { narrowError, narrowClientError } from "./narrowError.js";

export type APIResult<T> =
  | {
      status: "success";
      data: T;
    }
  | {
      status: "not-found";
    }
  | {
      status: "error";
      error: string;
    };

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

export const handleClientError = (error: unknown) => {
  return {
    status: "error",
    error: narrowClientError(error).message,
  } as const;
};

export const handleError = (error: unknown) => {
  return {
    status: "error",
    error: narrowError(error).message,
  };
};
