"use server";
import { apiFetchClient } from "@admin/lib/serverFetch";
import { Flag, Project } from "@db/prisma/generated/client.ts";
import { BaseProject, UpdateProject } from "@schema/project.schema.ts";
import { BaseFlag } from "@schema/flag.schema.ts";

export async function createProjectAction(formData: BaseProject) {
  return await apiFetchClient<Project>("/projects", {
    method: "POST",
    body: JSON.stringify(formData),
  });
}

export async function updateProjectAction(formData: UpdateProject, projectId: string) {
  return await apiFetchClient<Project>(`projects/${projectId}`, {
    method: "PATCH",
    body: JSON.stringify(formData),
  });
}

export async function createFlagAction(formData: BaseFlag) {
  return await apiFetchClient<Flag>("/flags", {
    method: "POST",
    body: JSON.stringify(formData),
  });
}

export async function updateFlagAction(formData: BaseFlag, id: string) {
  return await apiFetchClient<Flag>(`/flags/${id}`, {
    method: "PATCH",
    body: JSON.stringify(formData),
  });
}
