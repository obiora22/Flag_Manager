"use client";
import React, { Suspense, useState } from "react";

import { FolderKanban, Plus } from "lucide-react";
import type { ProjectData } from "@api/lib/contracts";
import { ProjectsGridLayout, ProjectsListLayout } from "@admin/components/Project/ProjectsLayout";
import { ViewAndSearch } from "@admin/components/Project/ViewAndSearch.tsx";
import { ProjectForm } from "@admin/components/ProjectForm.tsx";
import dynamic from "next/dynamic";
import { FetchResponse, clientSideFetch } from "@admin/lib/clientFetch.ts";
import useSWR from "swr";
import { FlagForm } from "@admin/components/FlagForm.tsx";
import { APIResult } from "@repo/utils/serviceReturn";
import { EmptyState } from "../EmptyState";
import { ErrorState } from "../ErrorState";
import FullPageLoader from "../FullPageLoader";

const Modal = dynamic(() => import("@admin/components/Modal.tsx"), {
  ssr: false,
});

interface Props {
  projectData: ProjectData[];
  organizationId: string;
}
export function ProjectList({ projectData: projects, organizationId }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [openProjectForm, setOpenProjectForm] = useState<boolean>(false);
  const [flagFormOpen, setFlagFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  const initialPayload = { status: "success", ok: true, data: projects } as const;
  const { data: result, mutate } = useSWR<FetchResponse<APIResult<ProjectData[]>>>(
    "/projects",
    clientSideFetch,
    {
      fallbackData: { status: "success", payload: initialPayload },
      suspense: true,
    },
  );
  if (!result) return <EmptyState />;
  if (result.status === "api-error" || result.status === "network-error") return <ErrorState />;
  if (result.payload.status === "error") return <ErrorState />;

  const data = result.payload.status === "success" ? result.payload.data : [];
  const filteredProjects = data.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const projectCount = projects.length;

  return (
    <Suspense fallback={<FullPageLoader />}>
      <Modal isOpen={openProjectForm} onClose={() => setOpenProjectForm(false)}>
        <ProjectForm
          revalidate={mutate}
          organizationId={organizationId}
          project={selectedProject || undefined}
          onCancel={() => setOpenProjectForm(false)}
          onSave={() => undefined}
        />
      </Modal>
      <Modal isOpen={flagFormOpen} onClose={() => setFlagFormOpen(false)}>
        {selectedProject && (
          <FlagForm
            projectId={selectedProject.id}
            revalidate={mutate}
            onCancel={() => setFlagFormOpen(false)}
          />
        )}
      </Modal>
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Header */}
        <div className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400">Manage your projects</p>
              </div>
              <button
                onClick={() => setOpenProjectForm(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
             text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                New Project
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Search and View Toggle */}
          <ViewAndSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              {`${projects.length} project${projectCount > 1 ? "s" : ""}`}
            </h2>

            {viewMode === "grid" ? (
              <ProjectsGridLayout
                filteredProjects={filteredProjects}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
                openFlagForm={() => setFlagFormOpen(true)}
                openProjectForm={() => setOpenProjectForm(true)}
                closeProjectForm={() => setOpenProjectForm(false)}
                setSelectedProject={(p: ProjectData) => setSelectedProject(p)}
              />
            ) : (
              <ProjectsListLayout
                filteredProjects={filteredProjects}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
                openProjectForm={() => setOpenProjectForm(true)}
                closeProjectForm={() => setOpenProjectForm(false)}
              />
            )}
          </div>

          {/* Empty State */}
          {projectCount === 0 && (
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-12 text-center">
              <FolderKanban className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
              <p className="text-slate-400 mb-6">Get started by creating your first project</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create Project
              </button>
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
}
