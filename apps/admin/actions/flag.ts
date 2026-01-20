import { apiFetchClient, ApiFetchResult } from "@admin/lib/fetchClient";
import { BaseFlag, UpdateFlag } from "@schema/flag.schema";

export async function getFlags(path: string): Promise<ApiFetchResult<BaseFlag[]>> {
  const { ok, data, error } = await apiFetchClient<BaseFlag[]>(path);
  return { ok, data, error };
}

export async function getFlag(path: string, flagId: string): Promise<ApiFetchResult<BaseFlag>> {
  const { ok, data, error } = await apiFetchClient<BaseFlag>(`${path}/${flagId}`);
  return { ok, data, error };
}

export async function createAction(
  path: string,
  payload: BaseFlag
): Promise<ApiFetchResult<BaseFlag>> {
  const { ok, data, error } = await apiFetchClient<BaseFlag>(path, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return { ok, data, error };
}

export async function updateAction(
  path: string,
  payload: UpdateFlag
): Promise<ApiFetchResult<UpdateFlag>> {
  const { ok, data, error } = await apiFetchClient<UpdateFlag>(path, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return { ok, data, error };
}

export async function deleteAction(
  path: string,
  flagId: string
): Promise<ApiFetchResult<BaseFlag>> {
  const { ok, data, error } = await apiFetchClient<BaseFlag>(`${path}/${flagId}`);
  return { ok, data, error };
}
