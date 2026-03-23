import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  ToggleRight,
  ChevronDown,
  ChevronRight,
  GitBranch,
  Zap,
  Users,
  Globe,
  CheckCircle2,
  XCircle,
  TrendingUp,
  BarChart3,
  Calendar,
  Shield,
  Archive,
  Copy,
  Loader2,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { Flag as FType, FlagEnvironment } from "@db/prisma/generated/client.ts";
import { Rule } from "@db/types/rules.ts";

type FlagWithRules = Omit<FType, "rules"> & {
  environments: FlagEnvironment[];
  rules: Rule[];
};

interface RulesTabProps {
  flag: FlagWithRules;
  projectId: string;
  expandedRules: Set<string>;
  onToggleRule: (ruleId: string) => void;
}

function isEnabled(flag: FlagWithRules) {
  return flag.rules.length > 0 && flag.defaultValue === false;
}

export function RulesTab({ flag, expandedRules, onToggleRule }: RulesTabProps) {
  if (flag.rules.length === 0) {
    return (
      <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-12 text-center">
        <GitBranch className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No rules configured</h3>
        <p className="text-slate-400 mb-6">
          All evaluations will return the default value. Add rules to target specific users or
          contexts.
        </p>
        <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          <Plus className="w-5 h-5" />
          Create Rule
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Targeting Rules</h2>
          <p className="text-slate-400">Rules are evaluated in order. First match wins.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Add Rule
        </button>
      </div>

      <div className="space-y-3">
        {flag.rules.map((rule, index) => (
          <RuleCard
            key={rule.key}
            rule={rule}
            index={index}
            flagType={flag.returnValueType}
            isExpanded={expandedRules.has(rule.key)}
            onToggle={() => onToggleRule(rule.key)}
          />
        ))}
      </div>
    </div>
  );
}

interface RuleCardProps {
  rule: Rule;
  index: number;
  flagType: string;
  isExpanded: boolean;
  onToggle: () => void;
}

function RuleCard({ rule, index }: RuleCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatValue = (value: unknown): string => {
    console.log({ value });
    if (typeof value === "boolean") return value ? "true" : "false";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  const getOperatorLabel = (operator: string): string => {
    const labels: Record<string, string> = {
      equals: "=",
      not_equals: "≠",
      contains: "∋",
      not_contains: "∌",
      greater_than: ">",
      less_than: "<",
      in: "∈",
      exists: "∃",
    };
    return labels[operator] || operator;
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
      {/* Rule Header */}
      <div
        className="p-4 cursor-pointer hover:bg-slate-800/60 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Priority */}
            <div className="flex items-center justify-center w-8 h-8 bg-slate-700/50 rounded-lg border border-slate-600">
              <span className="text-sm font-mono text-slate-300">{index + 1}</span>
            </div>

            {/* Rule Name & Status */}
            <div className="flex-1">
              {rule.key && <p className="text-sm text-slate-400">{rule.key}</p>}

              {/* Quick Summary */}
              <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                {rule.conditions && rule.conditions.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    {rule.conditions.length} condition{rule.conditions.length !== 1 ? "s" : ""}
                  </span>
                )}
                {rule.rollout && (
                  <span className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5" />
                    {rule.rollout.percentage}% rollout
                  </span>
                )}
              </div>
            </div>

            {/* Return Value */}

            {/* Expand Icon */}
            <button className="p-1 hover:bg-slate-700 rounded transition-colors">
              {!isOpen ? (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-slate-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-slate-700/50 p-4 bg-slate-900/30">
          {/* Conditions */}
          {rule.conditions && rule.conditions.length > 0 && (
            <div className="mb-4">
              <h5 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Conditions (AND)
              </h5>
              <div className="space-y-2">
                {rule.conditions.map((condition, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50"
                  >
                    <code className="text-sm text-purple-400 font-mono">{condition.attribute}</code>
                    <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300 font-mono">
                      {getOperatorLabel(condition.operator)}
                    </span>
                    <code className="text-sm text-green-400 font-mono">
                      {formatValue(condition.value)}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rollout */}
          {rule.rollout && (
            <div className="mb-4">
              <h5 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Rollout Strategy
              </h5>
              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Percentage</span>
                  <span className="text-lg font-semibold text-white">
                    {rule.rollout.percentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${rule.rollout.percentage}%` }}
                  />
                </div>
                {rule.rollout.attribute && (
                  <p className="text-xs text-slate-500 mt-2">
                    Bucketing by: <code className="text-slate-400">{rule.rollout.attribute}</code>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-3 border-t border-slate-700/50">
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition-colors">
              <Edit className="w-4 h-4" />
              Edit
            </button>
            {/*<button className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition-colors">*/}
            {/*  {rule.enabled ? (*/}
            {/*    <>*/}
            {/*      <ToggleLeft className="w-4 h-4" />*/}
            {/*      Disable*/}
            {/*    </>*/}
            {/*  ) : (*/}
            {/*    <>*/}
            {/*      <ToggleRight className="w-4 h-4" />*/}
            {/*      Enable*/}
            {/*    </>*/}
            {/*  )}*/}
            {/*</button>*/}
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ml-auto">
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// ENVIRONMENTS TAB
// ============================================

interface EnvironmentsTabProps {
  flag: FlagWithRules;
  projectId: string;
  environments: FlagEnvironment[];
}

export function EnvironmentsTab({ flag, projectId, environments }: EnvironmentsTabProps) {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Environment Configuration</h2>
        <p className="text-slate-400">Override flag behavior for specific environments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {environments.map((env) => (
          <EnvironmentCard key={env.id} environment={env} flag={flag} />
        ))}
      </div>
    </div>
  );
}

interface EnvironmentCardProps {
  environment: FlagEnvironment;
  flag: FlagWithRules;
}

function EnvironmentCard({ environment, flag }: EnvironmentCardProps) {
  // eslint-disable-next-line react-hooks/purity
  const isEnabled = Math.random() > 0.3; // Mock data
  const hasOverride = Math.random() > 0.7;

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{environment.environment}</h3>
          <code className="text-sm text-slate-400 font-mono">{environment.flagId}</code>
        </div>

        <div className="flex items-center gap-2">
          {isEnabled ? (
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          ) : (
            <XCircle className="w-5 h-5 text-slate-500" />
          )}
        </div>
      </div>

      {hasOverride && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-400 font-medium mb-1">Custom Override</p>
          <code className="text-xs text-blue-300 font-mono">Returns: true</code>
        </div>
      )}

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Status</span>
          <span className={isEnabled ? "text-green-400" : "text-slate-500"}>
            {isEnabled ? "Enabled" : "Disabled"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Evaluations (24h)</span>
          <span className="text-white font-mono">
            {/* eslint-disable-next-line react-hooks/purity */}
            {(Math.random() * 10000).toFixed(0)}
          </span>
        </div>
      </div>

      <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700/50">
        <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 rounded-lg transition-colors border border-slate-700">
          <Edit className="w-4 h-4" />
          Configure
        </button>
      </div>
    </div>
  );
}

// ============================================
// ANALYTICS TAB
// ============================================

interface AnalyticsTabProps {
  flag: FlagWithRules;
  projectId: string;
}

export function AnalyticsTab({ flag, projectId }: AnalyticsTabProps) {
  // Mock data for charts
  const dailyData = Array.from({ length: 7 }, (_, i) => ({
    // eslint-disable-next-line react-hooks/purity
    date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    // eslint-disable-next-line react-hooks/purity
    evaluations: Math.floor(Math.random() * 50000) + 10000,
  }));

  const variantData = [
    { variant: "true", count: 45230, percentage: 67 },
    { variant: "false", count: 22115, percentage: 33 },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Analytics</h2>
        <p className="text-slate-400">Evaluation metrics and performance insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          label="Total Evaluations"
          value="245,680"
          change="+12.5%"
          trend="up"
          icon={Activity}
        />
        <MetricCard label="Unique Users" value="18,234" change="+8.2%" trend="up" icon={Users} />
        <MetricCard label="Avg Response Time" value="12ms" change="-3.1%" trend="down" icon={Zap} />
        <MetricCard
          label="Error Rate"
          value="0.02%"
          change="-0.01%"
          trend="down"
          icon={AlertTriangle}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evaluations Over Time */}
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Evaluations (7 days)
          </h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {dailyData.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-blue-500/20 hover:bg-blue-500/40 transition-colors rounded-t"
                  style={{
                    height: `${(day.evaluations / 60000) * 100}%`,
                    minHeight: "20px",
                  }}
                />
                <span className="text-xs text-slate-500 rotate-45 origin-left">{day.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Variant Distribution */}
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            Variant Distribution
          </h3>
          <div className="space-y-4">
            {variantData.map((variant) => (
              <div key={variant.variant}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300 font-mono">{variant.variant}</span>
                  <span className="text-sm text-white font-semibold">
                    {variant.count.toLocaleString()} ({variant.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${variant.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ElementType;
}

function MetricCard({ label, value, change, trend, icon: Icon }: MetricCardProps) {
  const isPositive =
    (trend === "up" && change.startsWith("+")) || (trend === "down" && change.startsWith("-"));

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-5 h-5 text-slate-400" />
        <span className={`text-sm font-medium ${isPositive ? "text-green-400" : "text-red-400"}`}>
          {change}
        </span>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}

// ============================================
// SETTINGS TAB
// ============================================

interface SettingsTabProps {
  flag: FlagWithRules;
  projectId: string;
  onEdit: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
  onDelete: () => void;
  actionInProgress: string | null;
}

export function SettingsTab({
  flag,
  projectId,
  onEdit,
  onDuplicate,
  onArchive,
  onDelete,
  actionInProgress,
}: SettingsTabProps) {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Settings</h2>
        <p className="text-slate-400">Manage flag configuration and danger zone actions</p>
      </div>

      {/* General Settings */}
      <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">General</h3>
        <div className="space-y-4">
          <button
            onClick={onEdit}
            className="w-full flex items-center justify-between p-4 bg-slate-900/50 hover:bg-slate-900 rounded-lg border border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Edit className="w-5 h-5 text-blue-400" />
              <div className="text-left">
                <p className="text-white font-medium">Edit Flag Details</p>
                <p className="text-sm text-slate-400">Update name, description, and tags</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>

          <button
            onClick={onDuplicate}
            disabled={actionInProgress === "duplicate"}
            className="w-full flex items-center justify-between p-4 bg-slate-900/50 hover:bg-slate-900 rounded-lg border border-slate-700 transition-colors disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              {actionInProgress === "duplicate" ? (
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
              ) : (
                <Copy className="w-5 h-5 text-blue-400" />
              )}
              <div className="text-left">
                <p className="text-white font-medium">Duplicate Flag</p>
                <p className="text-sm text-slate-400">Create a copy with all rules and settings</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/5 backdrop-blur-sm border border-red-500/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Danger Zone
        </h3>

        <div className="space-y-4">
          <button
            onClick={onArchive}
            disabled={actionInProgress === "archive"}
            className="w-full flex items-center justify-between p-4 bg-slate-900/50 hover:bg-slate-900 rounded-lg border border-slate-700 transition-colors disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              {actionInProgress === "archive" ? (
                <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
              ) : (
                <Archive className="w-5 h-5 text-amber-400" />
              )}
              <div className="text-left">
                <p className="text-white font-medium">Archive Flag</p>
                <p className="text-sm text-slate-400">Stop evaluations but keep for reference</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>

          <button
            onClick={onDelete}
            disabled={isEnabled(flag) || actionInProgress === "delete"}
            className="w-full flex items-center justify-between p-4 bg-slate-900/50 hover:bg-slate-900 rounded-lg border border-red-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              {actionInProgress === "delete" ? (
                <Loader2 className="w-5 h-5 text-red-400 animate-spin" />
              ) : (
                <Trash2 className="w-5 h-5 text-red-400" />
              )}
              <div className="text-left">
                <p className="text-white font-medium">Delete Flag</p>
                <p className="text-sm text-slate-400">
                  {isEnabled(flag)
                    ? "This flag is permanent and cannot be deleted"
                    : "Permanently remove this flag and all its data"}
                </p>
              </div>
            </div>
            {!isEnabled(flag) && <ChevronRight className="w-5 h-5 text-slate-400" />}
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper function to format value
function formatValue(value: any): string {
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}
