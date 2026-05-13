"use client";

import { Banner } from "@admin/components/Banner";
import {
  AnalyticsTab,
  EnvironmentsTab,
  RulesTab,
  SettingsTab,
} from "@admin/components/flagDetailsTab";
import { FlagForm } from "@admin/components/FlagForm.tsx";
import Modal from "@admin/components/Modal.tsx";
import { clientSideFetch } from "@admin/lib/clientFetch";
import { trimLastSegment } from "@admin/lib/trimLastSegment";
import type { APIResult, CompositeFlag } from "@packages/db/contracts";
import { Flag, FlagEnvironment, Prisma } from "@packages/db/prisma/browser";
import {
  Code,
  Copy,
  Edit,
  FileCode,
  Flag as FlagIcon,
  GitBranch,
  Globe,
  Loader2,
  Settings,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface FlagDetailPageProps {
  flag: CompositeFlag;
  projectId: string;
  projectName: string;
}

type actions = "archive" | "delete" | "copy" | "edit" | "toggle" | null;

const formatValue = (value: Prisma.JsonValue): string => {
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
};

export function FlagDetails({ flag: initialFlag, projectId }: FlagDetailPageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [flag, setFlag] = useState(initialFlag);
  const [activeTab, setActiveTab] = useState<
    "overview" | "rules" | "environments" | "analytics" | "settings"
  >("overview");
  const [error, setError] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<actions>(null);
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());
  const [openForm, setOpenForm] = useState(false);
  const FLAG_IS_ENABLED = flag.enabled;
  const pathname = usePathname();

  const handleArchive = (flag: CompositeFlag) => {
    if (!confirm("Archive this flag? It will stop evaluating but can be restored.")) {
      return;
    }
    setError(null);
    setActionInProgress("archive");
    startTransition(async () => {
      const result = await clientSideFetch<APIResult<Flag>>(`/flags/${flag.id}`, {
        method: "PATCH",
        body: JSON.stringify({ archived: !flag.archived }),
      });

      if (result.status === "api-error" || result.status === "network-error") {
        setError(result.error);
      }

      if (result.status === "success") {
        if (result.payload.status === "error") {
          setError(result.payload.error);
        } else {
          if (result.payload.status === "not-found") return;
          const { enabled, archived } = result.payload.data;
          setFlag((prev) => ({
            ...prev,
            archived,
            enabled,
          }));
        }
      }
      setActionInProgress(null);
    });
  };
  const toggleEnabled = async () => {
    setError(null);
    setActionInProgress("toggle");
    startTransition(async () => {
      try {
        const result = await clientSideFetch<APIResult<Flag>>(`/flags/${flag.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            enabled: !flag.enabled,
          }),
        });

        // if (result.status === "api-error") setError(result.error);
        // if (result.status === "network-error") setError(result.error);asd
        if (result.status !== "success") {
          setError(result.error);
        }
        if (result.status === "success") {
          if (result.payload.status === "error") {
            setError(result.payload.error);
          } else if (result.payload.status !== "not-found") {
            const enabled = result.payload.data.enabled;
            setFlag((prev) => ({
              ...prev,
              enabled,
            }));
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to enabled/disable flag. Please try again.");
      }
      setActionInProgress(null);
    });
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
        if (result.payload.status === "success") router.push(trimLastSegment(pathname));
      }
    });
  };
  const handleCopyKey = async () => {
    await navigator.clipboard.writeText(flag.key);
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
    { id: "overview", label: "Overview", icon: FlagIcon },
    { id: "rules", label: "Rules", icon: GitBranch, badge: flag.rules.length },
    {
      id: "environments",
      label: "Environments",
      icon: Globe,
      badge: flag.environments.length,
    },
    // { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;
  console.log(flag.enabled, "ENABLED");
  return (
    <>
      <Modal isOpen={openForm} onClose={() => setOpenForm(false)}>
        <FlagForm
          flag={flag}
          projectId={projectId}
          onCancel={() => setOpenForm(false)}
          setFlag={setFlag}
        />
      </Modal>
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Header */}
        <Banner key={error} message={error} />
        <div className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-900/30 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">{flag.key}</h1>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-400  rounded-sm">
                    <button
                      onClick={handleCopyKey}
                      className="flex items-center gap-1.5 text-white transition-colors group"
                    >
                      <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleEnabled}
                  disabled={actionInProgress === "toggle"}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    FLAG_IS_ENABLED
                      ? "bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30"
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600"
                  }`}
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : FLAG_IS_ENABLED ? (
                    <ToggleRight className="w-4 h-4" />
                  ) : (
                    <ToggleLeft className="w-4 h-4" />
                  )}
                  {FLAG_IS_ENABLED ? "Enabled" : "Disabled"}
                </button>

                <button
                  onClick={() => setOpenForm(true)}
                  className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-700"
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>
            </div>

            {flag.description && (
              <div className="flex gap-3">
                <span className="text-slate-400 mb-4">{flag.description}</span>
              </div>
            )}
            <div>
              <Link href={trimLastSegment(pathname)} className="border-b-2 cursor-pointer">
                View all flags
              </Link>
            </div>
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

        {/* Content */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          {activeTab === "overview" && <OverviewTab flag={flag} environments={flag.environments} />}

          {activeTab === "rules" && (
            <RulesTab
              flag={flag}
              projectId={projectId}
              setFlag={setFlag}
              expandedRules={expandedRules}
              onToggleRule={toggleRuleExpansion}
            />
          )}

          {activeTab === "environments" && (
            <EnvironmentsTab flag={flag} projectId={projectId} environments={flag.environments} />
          )}

          {activeTab === "analytics" && <AnalyticsTab flag={flag} projectId={projectId} />}

          {activeTab === "settings" && (
            <SettingsTab
              flag={flag}
              projectId={projectId}
              onEdit={() => undefined}
              onDuplicate={() => undefined}
              onArchive={handleArchive}
              onDelete={handleDelete}
              actionInProgress={actionInProgress}
              isPending={isPending}
            />
          )}
        </div>
      </div>
    </>
  );
}

function OverviewTab({ flag }: { flag: CompositeFlag; environments: FlagEnvironment[] }) {
  return (
    <div className="">
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
                  key={index}
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
                 });
                `}
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
