import { narrowError } from "./narrowError.ts";

export const handleResult = <T>(result: T | null) => {
  return result
    ? {
        ok: true,
        data: null,
        error: null,
      }
    : {
        ok: true,
        data: result,
        error: null,
      };
};

export const handleError = (error: unknown) => {
  return {
    ok: false,
    data: null,
    error: narrowError(error),
  };
};
