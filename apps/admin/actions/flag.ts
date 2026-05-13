import { FetchResponse } from "@admin/lib/clientFetch";
import { apiFetchClient } from "@admin/lib/serverFetch";
import { APIResult } from "@packages/db/sharedTypes";
import { BaseFlag, UpdateFlag } from "@packages/schema";

export async function getFlags(path: string): Promise<FetchResponse<APIResult<BaseFlag[]>>> {
  return await apiFetchClient<APIResult<BaseFlag[]>>(path);
}

export async function getFlag(
  path: string,
  flagId: string,
): Promise<FetchResponse<APIResult<BaseFlag>>> {
  return await apiFetchClient<APIResult<BaseFlag>>(`${path}/${flagId}`);
}

export async function createAction(
  path: string,
  payload: BaseFlag,
): Promise<FetchResponse<APIResult<BaseFlag>>> {
  return await apiFetchClient<APIResult<BaseFlag>>(path, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAction(
  path: string,
  payload: UpdateFlag,
): Promise<FetchResponse<APIResult<UpdateFlag>>> {
  return await apiFetchClient<APIResult<UpdateFlag>>(path, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteAction(
  path: string,
  flagId: string,
): Promise<FetchResponse<APIResult<BaseFlag>>> {
  return await apiFetchClient<APIResult<BaseFlag>>(`${path}/${flagId}`);
}
