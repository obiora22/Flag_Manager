import {checkUserSession} from "@admin/lib/auth-helpers.ts";
import { apiFetchClient } from "@admin/lib/fetchClient.ts";
import { Flag } from "@db/prisma/generated/client.ts";
import ErrorState from "@admin/component/errorState.tsx";
import EmptyState from "@admin/component/emptyState.tsx"
import Flags from "@admin/component/Flags";

export default async function FlagsPage ({ params, searchParams }: { params: Promise<{ projectId: string }>, searchParams: Promise<{
  projectName: string
  }> }) {
  await checkUserSession()

  const {projectId} = await params;
  const { projectName } = await searchParams;
  const { data, error } = await apiFetchClient<Flag[]>(`/flags?projectId=${projectId}`)

  console.log({ data, error });
 
  if (error) return <ErrorState  />;
  if (!data) return <EmptyState />;

  return <Flags projectId={projectId} projectName={projectName} initialFlags={data} />;
}

