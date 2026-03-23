"use client";

import React, { useState, useTransition } from "react";
import { Flag as FType, FlagEnvironment } from "@db/prisma/generated/client";
import {
  Flag,
  ArrowLeft,
  Edit,
  Trash2,
  Copy,
  Archive,
  ToggleLeft,
  ToggleRight,
  Plus,
  MoreVertical,
  Settings,
  Activity,
  GitBranch,
  Globe,
  Clock,
  TrendingUp,
  User,
  Calendar,
  Tag,
  Code,
  AlertCircle,
  CheckCircle2,
  XCircle,
  BarChart3,
  FileCode,
  Shield,
  Zap,
  ChevronDown,
  ChevronRight,
  Loader2,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { Rule } from "@db/types/rules.ts";
import {
  AnalyticsTab,
  EnvironmentsTab,
  RulesTab,
  SettingsTab,
} from "@admin/component/flagDetailsTab.tsx";

import { JsonValue } from "@db/prisma/generated/internal/prismaNamespace.ts";

type FlagWithRules = Omit<FType, "rules"> & {
  environments: FlagEnvironment[];
  rules: Rule[];
};

interface FlagDetailPageProps {
  flag: FlagWithRules;
  projectId: string;
  projectName: string;
  environments: FlagEnvironment[];
}

const formatValue = (value: JsonValue): string => {
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
};

export function FlagDetails({
  flag: initialFlag,
  projectId,
  environments,
}: FlagDetailPageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [flag, setFlag] = useState(initialFlag);
  const [activeTab, setActiveTab] = useState<
    "overview" | "rules" | "environments" | "analytics" | "settings"
  >("overview");
  const [error, setError] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());

  console.table(initialFlag);
  console.table(initialFlag.rules);
  console.log(initialFlag.defaultValue);

  function isEnabled(flag: FlagWithRules) {
    return flag.rules.length > 0 && flag.defaultValue !== false;
  }

  const getTypeColor = (type: string): string => {
    switch (type) {
      case "boolean":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "string":
        return "bg-purple-500/10 text-purple-400 border-red";
      case "number":
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case "json":
        return "bg-orange-500/10 text-orange-400 border-orange-500/30";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/30";
    }
  };

  // Action handlers
  const handleToggle = async () => {
    setActionInProgress("toggle");
    setError(null);

    startTransition(async () => {
      try {
        // await toggleFlag(projectId, flag.id, !flag.enabled);
        setFlag((prev) => ({ ...prev, rules: [], defaultValue: false }));
      } catch (err) {
        console.error(err);
        setError("Failed to toggle flag");
      } finally {
        setActionInProgress(null);
      }
    });
  };

  const handleEdit = () => {
    router.push(`/projects/${projectId}/flags/${flag.id}/edit`);
  };

  const handleDuplicate = async () => {
    setActionInProgress("duplicate");
    try {
      // await duplicateFlag(projectId, flag.id);
      router.push(`/projects/${projectId}/flags`);
    } catch (err) {
      console.error(err);
      setError("Failed to duplicate flag");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleArchive = async () => {
    if (!confirm("Archive this flag? It will stop evaluating but can be restored.")) {
      return;
    }

    setActionInProgress("archive");
    try {
      // await archiveFlag(projectId, flag.id);
      router.push(`/projects/${projectId}/flags`);
    } catch (err) {
      console.error(err);
      setError("Failed to archive flag");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDelete = async () => {
    // if (flag.permanent) {
    //   alert('This flag is permanent and cannot be deleted.');
    //   return;
    // }

    if (!confirm("Permanently delete this flag? This cannot be undone.")) {
      return;
    }

    setActionInProgress("delete");
    try {
      // await deleteFlag(projectId, flag.id);
      router.push(`/projects/${projectId}/flags`);
    } catch (err) {
      console.error(err);
      setError("Failed to delete flag");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleCopyKey = async () => {
    await navigator.clipboard.writeText(flag.key);
    // Show toast notification
  };

  const toggleRuleExpansion = (ruleId: string) => {
    setExpandedRules((prev) => {
      const next = new Set(prev);
      if (next.has(ruleId)) {
        next.delete(ruleId);
      } else {
        next.add(ruleId);
      }
      return next;
    });
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Flag },
    { id: "rules", label: "Rules", icon: GitBranch, badge: flag.rules.length },
    { id: "environments", label: "Environments", icon: Globe, badge: environments.length },
    // { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-900/30 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push(`/projects/${projectId}/flags`)}
                className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-white">{flag.key}</h1>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-400  rounded-sm">
                  <button
                    onClick={handleCopyKey}
                    className="flex items-center gap-1.5 text-white transition-colors group"
                  >
                    <code className="font-mono bg-slate-900/50 px-2 py-1 rounded">{flag.key}</code>
                    <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>

                  <span className="flex items-center gap-1.5">
                    {isEnabled(flag) ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        Enabled
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-slate-500" />
                        Disabled
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggle}
                disabled={actionInProgress === "toggle"}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  flag.rules
                    ? "bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30"
                    : "bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600"
                }`}
              >
                {actionInProgress === "toggle" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isEnabled(flag) ? (
                  <ToggleRight className="w-4 h-4" />
                ) : (
                  <ToggleLeft className="w-4 h-4" />
                )}
                {isEnabled(flag) ? "Enabled" : "Disabled"}
              </button>

              <button
                onClick={handleEdit}
                className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-700"
              >
                <Edit className="w-5 h-5" />
              </button>

              <div className="relative">
                <button className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-700">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          {flag.description && (
            <div className="flex gap-3 pl-4">
              <AlertCircle className="w-5 h-5" />
              <p className="text-slate-400 mb-4 text-xs">{flag.description}</p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-1 border-b border-slate-800/50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? "text-blue-400 border-blue-400"
                      : "text-slate-400 hover:text-white border-transparent"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="max-w-7xl mx-auto px-8 mt-6">
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
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
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {activeTab === "overview" && <OverviewTab flag={flag} environments={flag.environments} />}

        {activeTab === "rules" && (
          <RulesTab
            flag={flag}
            projectId={projectId}
            expandedRules={expandedRules}
            onToggleRule={toggleRuleExpansion}
          />
        )}

        {activeTab === "environments" && (
          <EnvironmentsTab flag={flag} projectId={projectId} environments={environments} />
        )}

        {activeTab === "analytics" && <AnalyticsTab flag={flag} projectId={projectId} />}

        {activeTab === "settings" && (
          <SettingsTab
            flag={flag}
            projectId={projectId}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onArchive={handleArchive}
            onDelete={handleDelete}
            actionInProgress={actionInProgress}
          />
        )}
      </div>
    </div>
  );
}

function OverviewTab({ flag }: { flag: FlagWithRules; environments: FlagEnvironment[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Info */}
      <div className="lg:col-span-2 space-y-6">
        {/* Default Value */}
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-400">{JSON.stringify(flag.defaultValue)}</Code>
          </h3>
          <pre className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-slate-300 font-mono text-sm overflow-x-auto">
            {formatValue(flag.defaultValue)}
          </pre>
        </div>

        {/* Rules Summary */}
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-purple-400" />
              Rules
            </h3>
            <span className="text-sm text-slate-400">{flag.rules.length} total</span>
          </div>

          {flag.rules.length === 0 ? (
            <p className="text-slate-500 text-sm">
              No rules configured. Using default value for all evaluations.
            </p>
          ) : (
            <div className="space-y-2">
              {flag.rules.slice(0, 3).map((rule, index) => (
                <div
                  key={rule.key}
                  className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 font-mono">#{index + 1}</span>
                    <span className="text-white font-medium">
                      {rule.key || `Rule ${index + 1}`}
                    </span>
                    {/*{!rule.enabled && (*/}
                    {/*  <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-400">*/}
                    {/*    Disabled*/}
                    {/*  </span>*/}
                    {/*)}*/}
                  </div>
                  {rule.rollout ? (
                    <span className="text-sm text-slate-400">
                      {rule.rollout.percentage}% rollout
                    </span>
                  ) : (
                    <span className="text-sm text-slate-400">100% rollout</span>
                  )}
                </div>
              ))}

              {flag.rules.length > 3 && (
                <p className="text-sm text-slate-500 text-center pt-2">
                  +{flag.rules.length - 3} more rules
                </p>
              )}
            </div>
          )}
        </div>

        {/* SDK Integration */}
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-green-400" />
            SDK Integration
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 mb-2 block">JavaScript / TypeScript</label>
              <pre className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-slate-300 font-mono text-sm overflow-x-auto">
                {`const value = await featureFlags.evaluate('${flag.key}', {
  userId: 'user_123',
  // ... other attributes
});`}
              </pre>
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-2 block">Python</label>
              <pre className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-slate-300 font-mono text-sm overflow-x-auto">
                {`value = feature_flags.evaluate('${flag.key}', {
    'userId': 'user_123',
    # ... other attributes
})`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {/*<div className="space-y-6">*/}
      {/*  /!* Stats *!/*/}
      {/*  <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">*/}
      {/*    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">*/}
      {/*      <Activity className="w-5 h-5 text-blue-400" />*/}
      {/*      Statistics*/}
      {/*    </h3>*/}

      {/*    <div className="space-y-4">*/}
      {/*      <div>*/}
      {/*        <p className="text-sm text-slate-500 mb-1">Evaluations (24h)</p>*/}
      {/*        <p className="text-2xl font-bold text-white">*/}
      {/*          {flag.stats?.evaluations24h?.toLocaleString() || '0'}*/}
      {/*        </p>*/}
      {/*      </div>*/}

      {/*      <div>*/}
      {/*        <p className="text-sm text-slate-500 mb-1">Last Evaluated</p>*/}
      {/*        <p className="text-sm text-white">*/}
      {/*          {flag.stats?.lastEvaluated || 0*/}
      {/*            ? new Date(flag.stats.lastEvaluated || 0).toLocaleString()*/}
      {/*            : 'Never'}*/}
      {/*        </p>*/}
      {/*      </div>*/}

      {/*      /!*<div>*!/*/}
      {/*      /!*  <p className="text-sm text-slate-500 mb-1">Active Rules</p>*!/*/}
      {/*      /!*  <p className="text-2xl font-bold text-white">*!/*/}
      {/*      /!*    {flag.rules.filter(r => r.enabled).length}*!/*/}
      {/*      /!*  </p>*!/*/}
      {/*      /!*</div>*!/*/}

      {/*      <div>*/}
      {/*        <p className="text-sm text-slate-500 mb-1">Environments</p>*/}
      {/*        <p className="text-2xl font-bold text-white">{environments.length}</p>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}

      {/*  /!* Metadata *!/*/}
      {/*  /!*<div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">*!/*/}
      {/*  /!*  <h3 className="text-lg font-semibold text-white mb-4">Metadata</h3>*!/*/}

      {/*  /!*  <div className="space-y-3 text-sm">*!/*/}
      {/*  /!*    <div>*!/*/}
      {/*  /!*      <p className="text-slate-500 mb-1">Created</p>*!/*/}
      {/*  /!*      <p className="text-white">{new Date(flag.createdAt).toLocaleDateString()}</p>*!/*/}
      {/*  /!*    </div>*!/*/}

      {/*  /!*    <div>*!/*/}
      {/*  /!*      <p className="text-slate-500 mb-1">Last Updated</p>*!/*/}
      {/*  /!*      <p className="text-white">{new Date(flag.updatedAt).toLocaleDateString()}</p>*!/*/}
      {/*  /!*    </div>*!/*/}

      {/*  /!*    <div>*!/*/}
      {/*  /!*      <p className="text-slate-500 mb-1">Created By</p>*!/*/}
      {/*  /!*      <p className="text-white">{flag.createdBy}</p>*!/*/}
      {/*  /!*    </div>*!/*/}

      {/*  /!*    {flag.archivedAt && (*!/*/}
      {/*  /!*      <div>*!/*/}
      {/*  /!*        <p className="text-slate-500 mb-1">Archived</p>*!/*/}
      {/*  /!*        <p className="text-white">{new Date(flag.archivedAt).toLocaleDateString()}</p>*!/*/}
      {/*  /!*      </div>*!/*/}
      {/*  /!*    )}*!/*/}
      {/*  /!*  </div>*!/*/}
      {/*  /!*</div>*!/*/}
      {/*</div>*/}
    </div>
  );
}

// Rules Tab Component (to be continued in next file...)
