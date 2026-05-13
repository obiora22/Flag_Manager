import { AlertCircle, Loader2 } from "lucide-react";
import React, { useMemo, useState, useTransition } from "react";
import type { ProjectData } from "@db/contracts";
import { isEqual } from "lodash";
import { clientSideFetch } from "@admin/lib/clientFetch";
import { APIResult } from "@db/lib/serviceReturn";
import { Project } from "@db/prisma/generated/client";

interface Props {
  organizationId: string;
  project?: ProjectData;
  onCancel: () => void;
  onSave: () => void;
  revalidate: () => void;
}
export function ProjectForm({ organizationId, project, onCancel, revalidate }: Props) {
  const [error, setError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();
  const isEditMode = project !== undefined;

  const initialFormData = useMemo(() => {
    return {
      name: project?.name || "",
      slug: project?.slug || "",
      organizationId: organizationId,
    };
  }, [project, organizationId]);

  const [formData, setFormData] = useState(initialFormData);

  const isDirty = useMemo(() => {
    return !isEqual(initialFormData, formData);
  }, [formData, initialFormData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const createProject = async () => {
      const response = await clientSideFetch<APIResult<Project>>(`/projects`, {
        method: "PATCH",
        body: JSON.stringify(formData),
      });

      if (response.status === "api-error" || response.status === "network-error") {
        setError(response.error);
      }

      if (response.status === "success") {
        if (response.payload.status === "error") {
          setError(response.payload.error);
        }
        revalidate();
        onCancel();
      }
    };
    const updateProject = async (project: ProjectData) => {
      const response = await clientSideFetch<APIResult<Project>>(`/projects/${project.id}`, {
        method: "PATCH",
        body: JSON.stringify(formData),
      });

      if (response.status === "api-error" || response.status === "network-error") {
        setError(response.error);
      }

      if (response.status === "success") {
        if (response.payload.status === "error") {
          setError(response.payload.error);
        }

        if (response.payload.status === "success") {
          revalidate();
          onCancel();
        }
      }
    };
    startTransition(async () => {
      if (isEditMode) {
        await updateProject(project as ProjectData);
      } else {
        await createProject();
      }
    });
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="projectName" className="block text-sm font-medium text-slate-300 mb-2">
          Project name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          id="projectName"
          value={formData.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value.toLowerCase(),
            })
          }
          placeholder="Enter project name"
          className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono"
          required
          disabled={isPending}
        />
        <p className="text-xs text-slate-500 mt-1">
          Lowercase letters, numbers, hyphens, and underscores only
        </p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
          Slug
        </label>
        <textarea
          id="description"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="Describe project..."
          rows={3}
          className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          disabled={isPending}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending || !isDirty}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEditMode ? "Save Changes" : "Create Project"}
        </button>
      </div>
    </form>
  );
}
