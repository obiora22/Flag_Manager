"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Settings,
  Flag,
  Users,
  Key,
  ExternalLink,
  Archive,
  Clock,
  Activity,
  Globe,
} from "lucide-react";
import { ProjectData } from "@api/src/services/projectServices";

interface Props {
  projectData: ProjectData[];
}
export  function Project({ projectData: projects }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  console.log({ projects });


  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const projectCount = projects.length;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400">Manage your projects</p>
            </div>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              <Plus className="w-5 h-5" />
              New Project
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Search and View Toggle */}
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded ${
                  viewMode === "grid" ? "bg-slate-700 text-white" : "text-slate-400"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded ${
                  viewMode === "list" ? "bg-slate-700 text-white" : "text-slate-400"
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            {`${projects.length} project${projectCount > 1 ? 's' : ''}`}
          </h2>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
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
                              <Link href={`/projects/${project.id}/flags`}>View Flags</Link>
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2">
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2">
                              <Settings className="w-4 h-4" />
                              Settings
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
          ) : (
            <div className="space-y-4">
              {projects.map((project, index) => (
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
                        onClick={() =>
                          setActiveDropdown(activeDropdown === project.id ? null : project.id)
                        }
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
  );
}
