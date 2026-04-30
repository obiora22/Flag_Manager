"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  Flag as FlagIcon,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Archive,
  AlertCircle,
  Loader2,
  RefreshCw,
  Clock,
  GitBranch,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FlagForm } from "@admin/components/FlagForm.tsx";
import Modal from "@admin/components/Modal.tsx";
import { FetchResponse, clientSideFetch } from "@admin/lib/clientFetch.ts";
import useSWR from "swr";
import { APIResult } from "@repo/utils/serviceReturn";
import { ErrorState } from "./ErrorState";
import { Flag } from "@db/prisma/generated/client";
import { CompositeFlag } from "@api/src/services/flagService";

interface FlagsListProps {
  projectId: string;
  projectName: string;
  initialFlags: CompositeFlag[];
}

type Result = FetchResponse<APIResult<CompositeFlag[]>>;

export default function Flags({ projectId, projectName, initialFlags }: FlagsListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "archived">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | CompositeFlag["returnValueType"]>("all");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [targetFlag, setTargetFlag] = useState<CompositeFlag | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [flagFormOpen, setFlagFormOpen] = useState(false);

  const initialPayload = { status: "success", ok: true, data: initialFlags } as const;
  const { data, mutate } = useSWR<Result>(`/flags?projectId=${projectId}`, clientSideFetch, {
    fallbackData: { status: "success", payload: initialPayload },
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    if (activeDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [activeDropdown]);

  if (
    !data ||
    data.status === "api-error" ||
    data.status === "network-error" ||
    data.payload.status !== "success"
  ) {
    return <ErrorState message="something went wrong. Try again." />;
  }

  const filteredFlags = data.payload.data.filter((flag) => {
    const matchesSearch =
      !searchQuery ||
      flag.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.description?.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !flag.archived) ||
      (statusFilter === "archived" && flag.archived);

    // Type filter
    const matchesType = typeFilter === "all" || flag.returnValueType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const activeFlags = filteredFlags.filter((f) => !f.archived);
  const archivedFlags = filteredFlags.filter((f) => f.archived);

  const handleViewFlag = (flagId: string) => {
    router.push(`/projects/${projectId}/flags/${flagId}`);
  };

  const handleEditFlag = (flag: CompositeFlag) => {
    if (targetFlag) setTargetFlag(null);
    setTargetFlag(flag);
    setFlagFormOpen(true);
  };

  const handleDelete = async (flagId: string) => {
    setError(null);
    startTransition(async () => {
      if (!confirm("Are you sure you want to delete flag? Action is permanent.")) return;
      const result = await clientSideFetch<APIResult<Flag>>(`/flags/${flagId}`, {
        method: "DELETE",
      });
      if (result.status === "api-error" || result.status === "network-error")
        setError(result.error);
      if (result.status === "success") {
        if (result.payload.status === "error") setError(result.payload.error);
        if (result.payload.status === "success") {
          console.log("payload", result.payload);
          mutate();
        }
      }
    });
  };

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-900/30 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{projectName}</h1>
              </div>
              <p className="text-slate-400 mb-4">Manage feature flags and rollout rules</p>
              <button
                onClick={() => router.push("/projects")}
                className="text-slate-400 hover:text-white transition-colors underline"
              >
                View all projects
              </button>
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
                onClick={() => setFlagFormOpen(true)}
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
        <Modal isOpen={flagFormOpen} onClose={() => setFlagFormOpen(false)}>
          <FlagForm
            flag={targetFlag || undefined}
            projectId={projectId}
            revalidate={mutate}
            onCancel={() => setFlagFormOpen(false)}
          />
        </Modal>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
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
          <StatCard
            label="Total Flags"
            value={filteredFlags.length}
            icon={FlagIcon}
            color="text-blue-400"
          />
          <StatCard
            label="Active"
            value={activeFlags.length}
            icon={CheckCircle2}
            color="text-green-400"
          />
          <StatCard
            label="Archived"
            value={archivedFlags.length}
            icon={Archive}
            color="text-slate-400"
          />
          <StatCard
            label="With Rules"
            value={activeFlags.filter((f) => (f.rules ? f.rules : [])).length}
            icon={GitBranch}
            color="text-purple-400"
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
                  placeholder="Search by key or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors ${
                  showFilters || statusFilter !== "all" || typeFilter !== "all"
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-slate-900/50 border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                <Filter className="w-5 h-5" />
                Filters
                {(statusFilter !== "all" || typeFilter !== "all") && (
                  <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {(statusFilter !== "all" ? 1 : 0) + (typeFilter !== "all" ? 1 : 0)}
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
                    {(["all", "active", "archived"] as const).map((status) => (
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
                    {(["all", "BOOLEAN", "STRING", "NUMBER", "JSON"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setTypeFilter(type)}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                          typeFilter === type
                            ? "bg-blue-600 text-white"
                            : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        {type === "all" ? "All" : type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {(statusFilter !== "all" || typeFilter !== "all") && (
                  <button
                    onClick={() => {
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

        {filteredFlags.length === 0 && !searchQuery && statusFilter === "all" ? (
          <p>No flags available, create new flag.</p>
        ) : filteredFlags.length === 0 ? (
          <NoResultsState
            onClearFilters={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setTypeFilter("all");
            }}
          />
        ) : (
          <div className="space-y-4">
            {filteredFlags.map((flag, index) => (
              <div key={flag.id} className="relative" style={{ zIndex: 50 - index * 10 }}>
                <FlagCard
                  flag={flag}
                  projectId={projectId}
                  activeDropdown={activeDropdown}
                  onToggleDropdown={(id) => setActiveDropdown(activeDropdown === id ? null : id)}
                  onView={handleViewFlag}
                  onEdit={() => handleEditFlag(flag)}
                  onToggleArchive={() => undefined}
                  onDuplicate={() => undefined}
                  onDelete={handleDelete}
                  isProcessing={isPending}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

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

interface FlagCardProps {
  flag: FlagType;
  projectId: string;
  activeDropdown: string | null;
  onToggleDropdown: (id: string) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onToggleArchive: (id: string, currentArchived: boolean) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  isProcessing: boolean;
}

function FlagCard({
  flag,
  activeDropdown,
  onToggleDropdown,
  onView,
  onEdit,
  onToggleArchive,
  onDuplicate,
  onDelete,
  isProcessing,
}: FlagCardProps) {
  const getTypeColor = (type: FlagType["returnValueType"]): string => {
    switch (type) {
      case "BOOLEAN":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "STRING":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "NUMBER":
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case "JSON":
        return "bg-orange-500/10 text-orange-400 border-orange-500/30";
    }
  };

  const getStatusColor = (flag: FlagType): string => {
    return flag.archived ? "text-slate-400" : flag.enabled ? "text-green-400" : "text-slate-400";
  };

  const formatValue = (value: unknown, type: FlagType["returnValueType"]): string => {
    if (type === "BOOLEAN") return value ? "true" : "false";
    if (type === "JSON") return JSON.stringify(value);
    return String(value);
  };

  const StatusIcon = flag.archived ? Archive : CheckCircle2;

  return (
    <div
      className={`bg-slate-800/40 relative backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all cursor-pointer ${
        flag.archived ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <StatusIcon className={`w-5 h-5 shrink-0 ${getStatusColor(flag)}`} />
                <code className="text-sm text-slate-400 font-mono bg-slate-900/50 px-2 py-1 rounded">
                  {flag.key}
                </code>
                <span
                  className={`px-2 py-0.5 border rounded text-xs font-medium ${getTypeColor(
                    flag.returnValueType,
                  )}`}
                >
                  {flag.returnValueType}
                </span>
              </div>

              {flag.description && (
                <p className="text-slate-400 text-sm line-clamp-2 mb-3">{flag.description}</p>
              )}
            </div>
          </div>

          {/* Default Value */}
          <div className="mb-3">
            <p className="text-xs text-slate-500 mb-1">Default Value</p>
            <code className="text-sm text-green-400 bg-slate-900/50 px-2 py-1 rounded font-mono">
              {formatValue(flag.defaultValue, flag.returnValueType)}
            </code>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <GitBranch className="w-4 h-4" />
              {flag.rules ? (
                <span>
                  {flag.rules.length} rule{flag.rules.length !== 1 ? "s" : ""}
                </span>
              ) : (
                <span>0 flags</span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{new Date(flag.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Rules Preview */}
          {flag.rules.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <p className="text-xs text-slate-500 mb-2">Rules</p>
              <div className="space-y-2">
                {flag.rules.slice(0, 2).map((rule, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <span className="text-xs text-slate-600 font-mono">#{index + 1}</span>
                    {rule.conditions && rule.conditions.length > 0 && (
                      <span className="text-slate-400">
                        {rule.conditions.length} condition
                        {rule.conditions.length !== 1 ? "s" : ""}
                      </span>
                    )}
                    {rule.rollout && (
                      <span className="text-slate-400">{rule.rollout.percentage}% rollout</span>
                    )}
                    <span className="text-slate-600">→</span>
                    <code className="text-xs text-blue-400 font-mono">
                      {formatValue(rule.serve, flag.returnValueType)}
                    </code>
                  </div>
                ))}
                {flag.rules.length > 2 && (
                  <p className="text-xs text-slate-600">
                    +{flag.rules.length - 2} more rule
                    {flag.rules.length - 2 !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
          {/* Dropdown Menu */}
          <div>
            <button
              onClick={() => onToggleDropdown(flag.id)}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <MoreVertical className="w-5 h-5" />
              )}
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
                <div className="border-t border-slate-700" />
                <button
                  onClick={() => onToggleArchive(flag.id, flag.archived)}
                  className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2"
                >
                  <Archive className="w-4 h-4" />
                  {flag.archived ? "Restore" : "Archive"}
                </button>
                <button
                  onClick={() => onDelete(flag.id)}
                  className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-slate-700 flex items-center gap-2 rounded-b-lg"
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
// function EmptyState({ onCreateFlag }: { onCreateFlag: () => void }) {
//   return (
//     <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-12 text-center">
//       <Flag className="w-16 h-16 text-slate-600 mx-auto mb-4" />
//       <h3 className="text-xl font-semibold text-white mb-2">No feature flags yet</h3>
//       <p className="text-slate-400 mb-6">
//         Create your first feature flag to start controlling rollouts
//       </p>
//       <button
//         onClick={onCreateFlag}
//         className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
//       >
//         <Plus className="w-5 h-5" />
//         Create Flag
//       </button>
//     </div>
//   );
// }

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
