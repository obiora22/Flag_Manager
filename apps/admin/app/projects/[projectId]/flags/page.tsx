import { checkUserSession } from "@admin/lib/auth-helpers.ts";
import { apiFetchClient } from "@admin/lib/serverFetch";
import { ErrorState } from "@admin/components/ErrorState";
import { EmptyState } from "@admin/components/EmptyState.tsx";
import Flags from "@admin/components/Flags";
import { FlagType } from "@admin/app/projects/[projectId]/flags/[flagId]/types.ts";
import { CompositeFlag } from "@api/src/services/flagService";
import { ApiError } from "next/dist/server/api-utils";
import { APIResult } from "@repo/utils/serviceReturn";

export default async function FlagsPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{
    projectName: string;
  }>;
}) {
  await checkUserSession();

  const { projectId } = await params;
  const { projectName } = await searchParams;
  const result = await apiFetchClient<APIResult<CompositeFlag[]>>(`/flags?projectId=${projectId}`);

  if (result.status !== "success" || result.payload.status !== "success") {
    return <ErrorState message="something went wrong. Try again." />;
  }

  return (
    <Flags projectId={projectId} projectName={projectName} initialFlags={result.payload.data} />
  );
}
