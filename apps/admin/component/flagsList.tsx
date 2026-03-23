/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useTransition } from "react";
import {Flag as F, FlagEnvironment} from "@db/prisma/generated/client";
import {
  Flag,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Archive,
  Settings,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  Loader2,
  RefreshCw,
  Tag,
  Clock,
  Activity,
  GitBranch,
  Code,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ChevronDown,
  Eye,
  TrendingUp,
  Calendar,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Operator =
  | "equals"
  | "notEquals"
  | "contains"
  | "notContains"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "startsWith"
  | "endsWith"
  | "greaterThan"
  | "in";

interface Rollout {
  attribute: string;
  percentage: number;
}

export interface Condition {
  attribute: string;
  operator: Operator;
  value: unknown;
}

export interface Rule {
  key: string;
  conditions?: Condition[];
  rollout?: Rollout;
  defaultValue?: FlagType;
  serve: unknown;
}

interface FlagsPageProps {
  projectId: string;
  projectName: string;
  initialFlags: FlagWithStats[];
}

type FlagType = string | number | boolean | object;

type FlagWithStats = Omit<F, "rules"> & {
  environments: FlagEnvironment[];
  rules: Rule[];
  stats: { evaluations24h: number; lastEvaluated: string | null };
};

type Tag = 'LOW' | 'MEDIUM' | 'HIGH'

function isEnabled(flag: FlagWithStats): boolean {
  return flag.rules.length > 0 && flag.defaultValue !== false;
}

export default function FlagsListPage({ projectId, projectName, initialFlags }: FlagsPageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [flags, setFlags] = useState<FlagWithStats[]>(initialFlags);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "archived">(
    "all",
  );
  const [typeFilter, setTypeFilter] = useState<FlagType | "all">("all");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    if (activeDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [activeDropdown]);

  // Get all unique tags
  // const allTags = Array.from(new Set(flags.flatMap((flag) => flag.tags))).sort();
  const allTags:  Tag[] = [];

  // Filter flags
  const filteredFlags = flags.filter((flag) => {
    // Search filter
    const matchesSearch =
      !searchQuery ||
      flag.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.description?.toLowerCase().includes(searchQuery.toLowerCase());

    // Tag filter
    // const matchesTags =
    //   selectedTags.length === 0 || selectedTags.some((tag) => flag.tags.includes(tag));

    // Status filter
    const matchesStatus =
      statusFilter === "all" ||
      // (statusFilter === "active" && flag.enabled && !flag.archived) ||
      // (statusFilter === "inactive" && !flag.enabled && !flag.archived) ||
      (statusFilter === "archived" && flag.archived);

    // Type filter
    // const matchesType = typeFilter === "all" || flag.type === typeFilter;

    // return matchesSearch && matchesTags && matchesStatus && matchesType;
    return matchesSearch && matchesStatus
  });

  // Group flags by status
  // const activeFlags = filteredFlags.filter((f) => f.enabled && !f.archived);
  // const inactiveFlags = filteredFlags.filter((f) => !f.enabled && !f.archived);
  const archivedFlags = filteredFlags.filter((f) => f.archived);

  // Action handlers
  const handleCreateFlag = () => {
    router.push(`/projects/${projectId}/flags/new`);
  };

  const handleViewFlag = (flagId: string) => {
    router.push(`/projects/${projectId}/flags/${flagId}`);
  };

  const handleEditFlag = (flagId: string) => {
    router.push(`/projects/${projectId}/flags/${flagId}/edit`);
  };

  const handleToggleFlag = async (flagId: string, currentEnabled: boolean) => {
    setActiveDropdown(null);
    setActionInProgress(flagId);
    setError(null);

    startTransition(async () => {
      try {
        // Call server action
        // const result = await toggleFlag(projectId, flagId, !currentEnabled);

        // Optimistic update
        setFlags((prev) =>
          prev.map((f) => (f.id === flagId ? { ...f, enabled: !currentEnabled } : f)),
        );
      } catch (err) {
        console.error(err);
        setError("Failed to toggle flag");
      } finally {
        setActionInProgress(null);
      }
    });
  };

  const handleDuplicateFlag = async (flagId: string) => {
    setActiveDropdown(null);
    setActionInProgress(flagId);

    startTransition(async () => {
      try {
        // const result = await duplicateFlag(projectId, flagId);
        router.refresh();
      } catch (err) {
        console.error(err);
        setError("Failed to duplicate flag");
      } finally {
        setActionInProgress(null);
      }
    });
  };

  const handleArchiveFlag = async (flagId: string) => {
    setActiveDropdown(null);
    setActionInProgress(flagId);

    startTransition(async () => {
      try {
        // await archiveFlag(projectId, flagId);
        setFlags((prev) =>
          prev.map((f) =>
            f.id === flagId ? { ...f, archived: true, archivedAt: new Date().toISOString() } : f,
          ),
        );
      } catch (err) {
        console.error(err);
        setError("Failed to archive flag");
      } finally {
        setActionInProgress(null);
      }
    });
  };

  const handleDeleteFlag = async (flagId: string, isPermanent: boolean) => {
    if (isPermanent) {
      alert("This flag is marked as permanent and cannot be deleted to prevent tech debt.");
      return;
    }

    if (!confirm("Are you sure? This will permanently delete the flag and all its rules.")) {
      return;
    }

    setActiveDropdown(null);
    setActionInProgress(flagId);

    startTransition(async () => {
      try {
        // await deleteFlag(projectId, flagId);
        setFlags((prev) => prev.filter((f) => f.id !== flagId));
      } catch (err) {
        console.error(err);
        setError("Failed to delete flag");
      } finally {
        setActionInProgress(null);
      }
    });
  };

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-900/30 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => router.push("/projects")}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Projects
                </button>
                <span className="text-slate-600">/</span>
                <h1 className="text-3xl font-bold text-white">{projectName}</h1>
              </div>
              <p className="text-slate-400">Manage feature flags and rollout rules</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isPending}
                className="p-3 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 ${isPending ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={handleCreateFlag}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20"
              >
                <Plus className="w-5 h-5" />
                New Flag
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-400 font-medium">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300 text-xl leading-none"
            >
              ×
            </button>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard label="Total Flags" value={flags.length} icon={Flag} color="text-blue-400" />
          <StatCard label="Enabled" value={flags.filter( f => isEnabled(f)).length} icon={CheckCircle2} color="text-green-400" />
          <StatCard label="Disabled" value={flags.filter( f => !isEnabled(f)).length} icon={MinusCircle} color="text-amber-400" />
          <StatCard
            label="Archived"
            value={archivedFlags.length}
            icon={Archive}
            color="text-slate-400"
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by key, name, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors ${
                  showFilters ||
                  selectedTags.length > 0 ||
                  statusFilter !== "all" ||
                  typeFilter !== "all"
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-slate-900/50 border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                <Filter className="w-5 h-5" />
                Filters
                {(selectedTags.length > 0 || statusFilter !== "all" || typeFilter !== "all") && (
                  <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {selectedTags.length +
                      (statusFilter !== "all" ? 1 : 0) +
                      (typeFilter !== "all" ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="pt-4 border-t border-slate-700/50 space-y-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                  <div className="flex flex-wrap gap-2">
                    {(["all", "active", "inactive", "archived"] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                          statusFilter === status
                            ? "bg-blue-600 text-white"
                            : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
                  <div className="flex flex-wrap gap-2">
                    {(["all", "boolean", "string", "number", "json"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setTypeFilter(type)}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                          typeFilter === type
                            ? "bg-blue-600 text-white"
                            : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags Filter */}
                {allTags.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                            selectedTags.includes(tag)
                              ? "bg-blue-600 text-white"
                              : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          <Tag className="w-3.5 h-3.5" />
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clear Filters */}
                {(selectedTags.length > 0 || statusFilter !== "all" || typeFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSelectedTags([]);
                      setStatusFilter("all");
                      setTypeFilter("all");
                    }}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Flags List */}
        {filteredFlags.length === 0 &&
        !searchQuery &&
        selectedTags.length === 0 &&
        statusFilter === "all" ? (
          <EmptyState onCreateFlag={handleCreateFlag} />
        ) : filteredFlags.length === 0 ? (
          <NoResultsState
            onClearFilters={() => {
              setSearchQuery("");
              setSelectedTags([]);
              setStatusFilter("all");
              setTypeFilter("all");
            }}
          />
        ) : (
          <div className="space-y-4">
            {filteredFlags.map((flag) => (
              <FlagCard
                key={flag.id}
                flag={flag}
                projectId={projectId}
                activeDropdown={activeDropdown}
                onToggleDropdown={(id) => setActiveDropdown(activeDropdown === id ? null : id)}
                onView={handleViewFlag}
                onEdit={handleEditFlag}
                onToggle={handleToggleFlag}
                onDuplicate={handleDuplicateFlag}
                onArchive={handleArchiveFlag}
                onDelete={handleDeleteFlag}
                isProcessing={actionInProgress === flag.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all">
      <div className="flex items-center justify-between mb-3">
        <Icon className={`w-6 h-6 ${color}`} />
        <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

// Flag Card Component
interface FlagCardProps {
  flag: FlagWithStats;
  projectId: string;
  activeDropdown: string | null;
  onToggleDropdown: (id: string) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onToggle: (id: string, currentEnabled: boolean) => void;
  onDuplicate: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string, isPermanent: boolean) => void;
  isProcessing: boolean;
}

function FlagCard({
  flag,
  projectId,
  activeDropdown,
  onToggleDropdown,
  onView,
  onEdit,
  onToggle,
  onDuplicate,
  onArchive,
  onDelete,
  // isProcessing,
}: FlagCardProps) {
  const getTypeColor = (type: FlagType): string => {
    switch (type) {
      case "boolean":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "string":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "number":
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case "json":
        return "bg-orange-500/10 text-orange-400 border-orange-500/30";
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/30"
    }
  };

  const getStatusColor = (enabled: boolean, archived: boolean): string => {
    if (archived) return "text-slate-400";
    return enabled ? "text-green-400" : "text-amber-400";
  };

  const StatusIcon = flag.archived ? Archive : flag.rules ? CheckCircle2 : MinusCircle;

  return (
    <div
      className={`bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all cursor-pointer ${
        flag.archived ? "opacity-60" : ""
      }`}
      onClick={() => onView(flag.id)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <StatusIcon
                  className={`w-5 h-5 flex-shrink-0 ${getStatusColor(!!flag.rules, flag.archived)}`}
                />
                <h3 className="text-lg font-semibold text-white truncate">{flag.description}</h3>

              </div>
              <div className="flex items-center gap-2 mb-2">
                <code className="text-sm text-slate-400 font-mono bg-slate-900/50 px-2 py-1 rounded">
                  {flag.key}
                </code>
                {/* <span
                  className={`px-2 py-0.5 border rounded text-xs font-medium ${getTypeColor(
                    flag.type,
                  )}`}
                >
                  {flag.type}
                </span> */}
              </div>
              {flag.description && (
                <p className="text-slate-400 text-sm line-clamp-2 mb-3">{flag.description}</p>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <GitBranch className="w-4 h-4" />
              <span>{flag.rules.length} rules</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity className="w-4 h-4" />
              <span>{flag.environments.length} environments</span>
            </div>
            {flag.stats?.evaluations24h !== undefined && (
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                <span>{flag.stats.evaluations24h.toLocaleString()} evaluations (24h)</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{new Date(flag.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Tags */}
          {/* {flag.tags.length > 0 && (
            <div className="flex items-center gap-2 mt-3">
              {flag.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2 py-1 bg-slate-700/50 border border-slate-600 rounded text-xs text-slate-300"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )} */}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          {/* Quick Toggle */}
          {/* {!flag.archived && (
            <button
              onClick={() => onToggle(flag.id, flag.enabled)}
              disabled={isProcessing}
              className={`p-2 rounded-lg transition-colors ${
                flag.enabled? "bg-green-500/10 text-green-400 hover:bg-green-500/20" : "bg-slate-700/50 text-slate-400 hover:bg-slate-700"
              }`}
              title={flag.enabled? "Disable flag": "Enable flag"}
            >
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : flag.enabled ? (
                <ToggleRight className="w-5 h-5" />
              ) : (
                <ToggleLeft className="w-5 h-5" />
              )}
            </button>
          )} */}

          {/* Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => onToggleDropdown(flag.id)}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {activeDropdown === flag.id && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20">
                <button
                  onClick={() => onView(flag.id)}
                  className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2 rounded-t-lg"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                <button
                  onClick={() => onEdit(flag.id)}
                  className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => onDuplicate(flag.id)}
                  className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                <button
                  onClick={() => onToggle(flag.id, (isEnabled(flag)))}
                  className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2"
                >
                  { isEnabled(flag) ? (
                    <>
                      <ToggleLeft className="w-4 h-4" />
                      Disable
                    </>
                  ) : (
                    <>
                      <ToggleRight className="w-4 h-4" />
                      Enable
                    </>
                  )}
                </button>
                <div className="border-t border-slate-700" />
                {!flag.archived && (
                  <button
                    onClick={() => onArchive(flag.id)}
                    className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2"
                  >
                    <Archive className="w-4 h-4" />
                    Archive
                  </button>
                )}
                <button
                  onClick={() => onDelete(flag.id, !flag.archived)}
                  disabled={flag.archived}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-700 flex items-center gap-2 rounded-b-lg ${
                    flag.archived ? "text-slate-600 cursor-not-allowed" : "text-red-400"
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Empty State
function EmptyState({ onCreateFlag }: { onCreateFlag: () => void }) {
  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-12 text-center">
      <Flag className="w-16 h-16 text-slate-600 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">No feature flags yet</h3>
      <p className="text-slate-400 mb-6">
        Create your first feature flag to start controlling rollouts
      </p>
      <button
        onClick={onCreateFlag}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Create Flag
      </button>
    </div>
  );
}

// No Results State
function NoResultsState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-12 text-center">
      <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">No flags found</h3>
      <p className="text-slate-400 mb-6">Try adjusting your search or filters</p>
      <button onClick={onClearFilters} className="text-blue-400 hover:text-blue-300">
        Clear all filters
      </button>
    </div>
  );
}
