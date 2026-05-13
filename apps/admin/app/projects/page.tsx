import { ErrorState } from "@admin/components/ErrorState";
import { ProjectList } from "@admin/components/Project/ProjectList.tsx";
import { checkUserSession } from "@admin/lib/auth-helpers";
import { apiFetchClient } from "@admin/lib/serverFetch";
import type { ProjectData } from "@db/contracts";
import { APIResult } from "@db/lib/serviceReturn";

export default async function ProjectPage() {
  const session = await checkUserSession();

  const result = await apiFetchClient<APIResult<ProjectData[]>>(`/projects`);

  if (
    result.status === "api-error" ||
    result.status === "network-error" ||
    result.payload.status !== "success"
  ) {
    return <ErrorState message="something went wrong. Try again." />;
  }

  return <ProjectList projectData={result.payload.data} organizationId={session.activeOrgId} />;
}
