export type ApiResult<T> =
  | {
      status: "success";
      ok: true;
      data: T;
      error: null;
    }
  | {
      status: "error";
      ok: false;
      data: null;
      error: string;
    };
