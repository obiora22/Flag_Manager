"use server";

import { apiFetchClient } from "@admin/lib/serverFetch";
import { Flag, Project } from "@packages/db/prisma/server";
import { BaseFlag, BaseProject, UpdateProject } from "@packages/schema";

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
