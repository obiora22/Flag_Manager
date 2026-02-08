"use client";
import React, { useState } from "react";

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
  Copy,
  Archive,
  Clock,
  TrendingUp,
  Activity,
  Shield,
  ChevronRight,
  Globe,
} from "lucide-react";

export default function ProjectManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Mock data
  const projects = [
    {
      id: "1",
      name: "Mobile App",
      slug: "mobile-app",
      description: "iOS and Android mobile application",
      flagCount: 12,
      activeFlags: 8,
      memberCount: 5,
      environments: ["development", "staging", "production"],
      lastActivity: "2 hours ago",
      createdAt: "Jan 15, 2024",
      status: "active",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "2",
      name: "Web Platform",
      slug: "web-platform",
      description: "Main web application and dashboard",
      flagCount: 24,
      activeFlags: 18,
      memberCount: 8,
      environments: ["development", "staging", "production"],
      lastActivity: "1 hour ago",
      createdAt: "Dec 10, 2023",
      status: "active",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "3",
      name: "API Service",
      slug: "api-service",
      description: "Backend API and microservices",
      flagCount: 8,
      activeFlags: 6,
      memberCount: 3,
      environments: ["development", "staging", "production"],
      lastActivity: "5 hours ago",
      createdAt: "Nov 5, 2023",
      status: "active",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "4",
      name: "Marketing Site",
      slug: "marketing-site",
      description: "Public marketing and landing pages",
      flagCount: 6,
      activeFlags: 4,
      memberCount: 4,
      environments: ["development", "production"],
      lastActivity: "2 days ago",
      createdAt: "Oct 1, 2023",
      status: "active",
      color: "from-orange-500 to-red-500",
    },
    {
      id: "5",
      name: "Admin Portal",
      slug: "admin-portal",
      description: "Internal admin tools and dashboard",
      flagCount: 15,
      activeFlags: 12,
      memberCount: 6,
      environments: ["development", "staging", "production"],
      lastActivity: "3 hours ago",
      createdAt: "Sep 20, 2023",
      status: "active",
      color: "from-indigo-500 to-blue-500",
    },
    {
      id: "6",
      name: "Legacy System",
      slug: "legacy-system",
      description: "Deprecated legacy application",
      flagCount: 3,
      activeFlags: 0,
      memberCount: 1,
      environments: ["production"],
      lastActivity: "2 weeks ago",
      createdAt: "Jan 1, 2023",
      status: "archived",
      color: "from-gray-500 to-slate-500",
    },
  ];

  const stats = [
    { label: "Total Projects", value: "6", icon: FolderKanban, color: "text-blue-600" },
    { label: "Active Flags", value: "68", icon: Flag, color: "text-green-600" },
    { label: "Team Members", value: "24", icon: Users, color: "text-purple-600" },
    { label: "Environments", value: "18", icon: Globe, color: "text-orange-600" },
  ];

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const activeProjects = filteredProjects.filter((p) => p.status === "active");
  const archivedProjects = filteredProjects.filter((p) => p.status === "archived");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
              <p className="text-slate-400">Manage your feature flag projects</p>
            </div>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              <Plus className="w-5 h-5" />
              New Project
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                  <span className="text-xs text-slate-500">{stat.label}</span>
                </div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            );
          })}
        </div>

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

        {/* Active Projects */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            Active Projects ({activeProjects.length})
          </h2>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeProjects.map((project) => (
                <div
                  key={project.id}
                  className="group bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-600/50 transition-all hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
                >
                  {/* Project Header with Gradient */}
                  <div className={`h-2 bg-gradient-to-r ${project.color}`} />

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 bg-gradient-to-br ${project.color} rounded-lg flex items-center justify-center`}
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
                              View Flags
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

                    <p className="text-slate-400 text-sm mb-4">{project.description}</p>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                        <Flag className="w-4 h-4 text-blue-400 mb-1" />
                        <p className="text-lg font-semibold text-white">{project.flagCount}</p>
                        <p className="text-xs text-slate-500">Flags</p>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                        <Activity className="w-4 h-4 text-green-400 mb-1" />
                        <p className="text-lg font-semibold text-white">{project.activeFlags}</p>
                        <p className="text-xs text-slate-500">Active</p>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                        <Users className="w-4 h-4 text-purple-400 mb-1" />
                        <p className="text-lg font-semibold text-white">{project.memberCount}</p>
                        <p className="text-xs text-slate-500">Members</p>
                      </div>
                    </div>

                    {/* Environments */}
                    <div className="flex items-center gap-2 mb-4">
                      {project.environments.map((env) => (
                        <span
                          key={env}
                          className="px-2 py-1 bg-slate-700/50 border border-slate-600 rounded text-xs text-slate-300"
                        >
                          {env.toUpperCase()}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-700/50">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {project.lastActivity}
                      </span>
                      <span>Created {project.createdAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {activeProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${project.color} rounded-lg flex items-center justify-center`}
                      >
                        <FolderKanban className="w-6 h-6 text-white" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                          <code className="text-xs text-slate-400 font-mono">{project.slug}</code>
                        </div>
                        <p className="text-slate-400 text-sm">{project.description}</p>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-white">{project.flagCount}</p>
                          <p className="text-xs text-slate-500">Flags</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-400">{project.activeFlags}</p>
                          <p className="text-xs text-slate-500">Active</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-400">
                            {project.memberCount}
                          </p>
                          <p className="text-xs text-slate-500">Members</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {project.environments.map((env) => (
                          <span
                            key={env}
                            className="px-2 py-1 bg-slate-700/50 border border-slate-600 rounded text-xs text-slate-300"
                          >
                            {env.slice(0, 3).toUpperCase()}
                          </span>
                        ))}
                      </div>
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
                        <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10">
                          <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2 rounded-t-lg">
                            <ExternalLink className="w-4 h-4" />
                            View Flags
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

        {/* Archived Projects */}
        {archivedProjects.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">
              Archived Projects ({archivedProjects.length})
            </h2>
            <div className="space-y-4">
              {archivedProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 rounded-xl p-6 opacity-60"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                        <FolderKanban className="w-6 h-6 text-slate-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-400">{project.name}</h3>
                        <p className="text-slate-500 text-sm">{project.description}</p>
                      </div>
                    </div>
                    <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                      Restore
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredProjects.length === 0 && (
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
