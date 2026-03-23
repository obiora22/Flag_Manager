import EmptyState from "@admin/component/emptyState";
import ErrorState from "@admin/component/errorState";
import { Project } from "@admin/component/Project";
import { checkUserSession } from "@admin/lib/auth-helpers";
import { apiFetchClient } from "@admin/lib/fetchClient";
import { ProjectData } from "@api/src/services/projectServices";

export default async function ProjectPage() {
  const session = await checkUserSession();

  console.log({ session })



  const { data, error } = await apiFetchClient<ProjectData[]>(`/projects`);

  if (error)
    return (
      <ErrorState
        title={"Server error"}
        message={"Could not fetch project"}
        variant="info"
        errorCode="500"
        action={{
          label: "Reload",
          href: "/projects",
        }}
      />
    );

  if (!data) return <EmptyState title={"No data available"} message={"Try again"} />;

  return <Project projectData={data} />;
}
