import { APIResult } from "@repo/utils/serviceReturn";
import { ErrorState } from "./ErrorState";

export function DataRetrievalHandler<T>(result: APIResult<T>) {
  if (result.status === "not-found") {
    return <p>Not found</p>;
  }
  if (result.status === "error") {
    return <ErrorState message={result.error} />;
  }

  if (result.status === "success") {
    return result.data;
  }
}
