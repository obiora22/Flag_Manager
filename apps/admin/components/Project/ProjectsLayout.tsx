import {
  Activity,
  Archive,
  Clock,
  Edit,
  ExternalLink,
  Flag,
  FolderKanban,
  Key,
  MoreVertical,
  Settings,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import type { ProjectData } from "@api/lib/contracts";

interface Props {
  filteredProjects: ProjectData[];
  activeDropdown: string | null;
  setActiveDropdown: (val: string | null) => void;
  openFlagForm: () => void;
  openProjectForm: () => void;
  closeProjectForm: () => void;
  setSelectedProject: (project: ProjectData) => void;
}
export function ProjectsGridLayout({
  filteredProjects,
  activeDropdown,
  setActiveDropdown,
  setSelectedProject,
  openProjectForm,
  closeProjectForm,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProjects.map((project) => (
        <div
          key={project.id}
          className="group bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-600/50 transition-all hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
        >
          {/* Project Header with Gradient */}
          <div className={`h-2 bg-linear-to-r`} />

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 bg-linear-to-br green rounded-lg flex items-center justify-center`}
                >
                  <FolderKanban className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {project.name}
                  </h3>
                  <code className="text-xs text-slate-400 font-mono">{project.slug}</code>
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={() =>
                    setActiveDropdown(activeDropdown === project.id ? null : project.id)
                  }
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-white"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {activeDropdown === project.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10">
                    <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2 rounded-t-lg">
                      <ExternalLink className="w-4 h-4" />
                      <Link href={`/projects/${project.id}/flags?projectName=${project.name}`}>
                        View Flags
                      </Link>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        openProjectForm();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>

                    <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Team
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      API Keys
                    </button>
                    <div className="border-t border-slate-700" />
                    <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2">
                      <Archive className="w-4 h-4" />
                      Archive
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-slate-700 flex items-center gap-2 rounded-b-lg">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            <p className="text-slate-400 text-sm mb-4">{project.name}</p>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                <Flag className="w-4 h-4 text-blue-400 mb-1" />
                <p className="text-lg font-semibold text-white">{project.flagCount}</p>
                <p className="text-xs text-slate-500">Flags</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                <Activity className="w-4 h-4 text-green-400 mb-1" />
                <p className="text-lg font-semibold text-white">
                  {project.flags.map((f) => !f.archived).length}
                </p>
                <p className="text-xs text-slate-500">Active</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                <Users className="w-4 h-4 text-purple-400 mb-1" />
                <p className="text-lg font-semibold text-white">{project.users.length}</p>
                <p className="text-xs text-slate-500">Members</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-700/50">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
              </span>
              <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProjectsListLayout({
  filteredProjects,
  activeDropdown,
  setActiveDropdown,
}: {
  filteredProjects: ProjectData[];
  activeDropdown: string | null;
  setActiveDropdown: (val: string | null) => void;
  openProjectForm: () => void;
  closeProjectForm: () => void;
}) {
  return (
    <div className="space-y-4">
      {filteredProjects.map((project, index) => (
        <div
          key={project.id}
          style={{ zIndex: 100 - (index + 10) }}
          className={`relative  bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div
                className={`w-12 h-12 bg-linear-to-br bg-green-400 rounded-lg flex items-center justify-center`}
              >
                <FolderKanban className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                  <code className="text-xs text-slate-400 font-mono">{project.slug}</code>
                </div>
                {/* <p className="text-slate-400 text-sm">{project.description}</p> */}
              </div>

              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{project.flagCount}</p>
                  <p className="text-xs text-slate-500">Flags</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">
                    {project.flags.map((flag) => !flag.archived).length}
                  </p>
                  <p className="text-xs text-slate-500">Active</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-400">{project.userCount}</p>
                  <p className="text-xs text-slate-500">Members</p>
                </div>
              </div>

              {/* <div className="flex items-center gap-2">
                      {[].map((env) => (
                        <span
                          key={env}
                          className="px-2 py-1 bg-slate-700/50 border border-slate-600 rounded text-xs text-slate-300"
                        >
                          {env.slice(0, 3).toUpperCase()}
                        </span>
                      ))}
                    </div> */}
            </div>

            <div className="relative ml-4">
              <button
                onClick={() => setActiveDropdown(activeDropdown === project.id ? null : project.id)}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-white"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {activeDropdown === project.id && (
                <div
                  className={`absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl`}
                >
                  <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2 rounded-t-lg">
                    <ExternalLink className="w-4 h-4" />
                    <Link href={`/project/${project.id}/flags`}>View Flags</Link>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-slate-700 flex items-center gap-2 rounded-b-lg">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
