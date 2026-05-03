"use client";

import React, { SetStateAction, useState, useTransition } from "react";
import { Rule } from "@db/types/rules.ts";
import { Plus, Trash2, GripVertical, Zap, Users, AlertCircle, Loader2, Info } from "lucide-react";
import { clientSideFetch } from "@admin/lib/clientFetch.ts";
import { ApiResult } from "@api/lib/types.ts";
import type { BasicFlag, CompositeFlag } from "@api/lib/contracts";
import { rulesSchema } from "@schema/rule.schema";

type Operator =
  | "equals"
  | "greaterThan"
  | "notEquals"
  | "contains"
  | "notContains"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "startsWith"
  | "endsWith"
  | "in";

interface Condition {
  attribute: string;
  operator: Operator;
  value: unknown;
}

interface Rollout {
  attribute: string;
  percentage: number;
}

interface RuleFormData {
  key: string;
  description?: string;
  conditions: Condition[];
  rollout: Rollout | null;
  serve: unknown;
}

interface RuleBuilderFormProps {
  flag: CompositeFlag;
  flagType: "BOOLEAN" | "STRING" | "NUMBER" | "JSON";
  existingRule?: Rule;
  onSuccess?: (ruleId: string) => void;
  onCancel?: () => void;
  setFlag: React.Dispatch<SetStateAction<CompositeFlag>>;
}

export default function RuleBuilderForm({
  flag,
  flagType,
  existingRule,
  onCancel,
  setFlag,
}: RuleBuilderFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<RuleFormData>({
    key: existingRule?.key || "",
    conditions: existingRule?.conditions || [],
    rollout: existingRule?.rollout || null,
    serve: existingRule?.serve || getDefaultServeValue(flagType),
  });

  const [showConditions, setShowConditions] = useState(
    (existingRule?.conditions && existingRule?.conditions.length > 0) || false,
  );
  const [showRollout, setShowRollout] = useState(existingRule?.rollout != null || false);

  const addCondition = () => {
    const newCondition: Condition = {
      attribute: "",
      operator: "equals",
      value: "",
    };

    setFormData({
      ...formData,
      conditions: [...formData.conditions, newCondition],
    });
  };

  const removeCondition = (index: number) => {
    setFormData({
      ...formData,
      conditions: formData.conditions.filter((c, i) => i !== index),
    });
  };

  const updateCondition = (index: number, updates: Partial<Condition>) => {
    setFormData({
      ...formData,
      conditions: formData.conditions.map((c, i) => (i === index ? { ...c, ...updates } : c)),
    });
  };

  const toggleRollout = () => {
    if (showRollout) {
      setFormData({ ...formData, rollout: null });
      setShowRollout(false);
    } else {
      setFormData({
        ...formData,
        rollout: { attribute: "userId", percentage: 50 },
      });
      setShowRollout(true);
    }
  };

  const validateForm = (): string | null => {
    if (!formData.key.trim()) {
      return "Rule key is required";
    }

    // Validate conditions
    for (const condition of formData.conditions) {
      if (!condition.attribute.trim()) {
        return "All conditions must have an attribute";
      }
      if (condition.value === "" || condition.value === null) {
        return "All conditions must have a value";
      }
    }

    // Validate rollout
    if (formData.rollout) {
      if (!formData.rollout.attribute.trim()) {
        return "Rollout attribute is required";
      }
      if (formData.rollout.percentage < 0 || formData.rollout.percentage > 100) {
        return "Rollout percentage must be between 0 and 100";
      }
    }

    // Validate serve value
    if (formData.serve === "" || formData.serve === null) {
      return "Return value is required";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    startTransition(async () => {
      let parsedServe: unknown;
      try {
        parsedServe = parseValueByType(formData.serve as string, flagType);
      } catch {
        setError("Invalid return value format");
        return;
      }

      // Prepare rule data
      const ruleData = {
        key: formData.key,
        description: formData.description || undefined,
        conditions: formData.conditions.length > 0 ? formData.conditions : undefined,
        rollout: formData.rollout || undefined,
        serve: parsedServe,
      };

      const result = await clientSideFetch<ApiResult<BasicFlag>>(`/flags/${flag.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          rules: [...(flag?.rules || []), ruleData],
        }),
      });

      if (result.status !== "success") {
        setError(result.error);
      } else if (result.payload.status !== "success") {
        setError(result.payload.error);
      } else {
        const { error, data } = rulesSchema.safeParse(result.payload.data.rules);
        if (error) {
          setError("Invalid rule data");
          return;
        } else {
          setFlag((prev) => ({
            ...prev,
            rules: data,
            environments: prev.environments,
          }));
        }
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

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
            Rule key <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={formData.key}
            onChange={(e) => setFormData({ ...formData, key: e.target.value })}
            placeholder="e.g., Enterprise Users, Beta Testers, US Users"
            className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
            disabled={isPending}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe when this rule should apply..."
            rows={2}
            className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            disabled={isPending}
          />
        </div>
      </div>

      {/* Conditions Section */}
      <div className="border border-slate-700 rounded-lg p-6 bg-slate-900/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Targeting Conditions</h3>
            <span className="text-xs text-slate-500 bg-slate-700 px-2 py-0.5 rounded">
              AND Logic
            </span>
          </div>

          {!showConditions && (
            <button
              type="button"
              onClick={() => setShowConditions(true)}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Add Conditions
            </button>
          )}
        </div>

        {showConditions ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-400 mb-4">
              All conditions must be true for this rule to match (AND logic)
            </p>

            {formData.conditions.map((condition, index) => (
              <ConditionRow
                key={index}
                condition={condition}
                index={index}
                onUpdate={(updates) => updateCondition(index, updates)}
                onRemove={() => removeCondition(index)}
                disabled={isPending}
              />
            ))}

            <button
              type="button"
              onClick={addCondition}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-700 border-dashed"
            >
              <Plus className="w-4 h-4" />
              Add Condition
            </button>

            {formData.conditions.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, conditions: [] });
                  setShowConditions(false);
                }}
                className="text-sm text-slate-500 hover:text-slate-400"
              >
                Remove all conditions
              </button>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">
            No conditions - rule will apply to all users
          </p>
        )}
      </div>

      {/* Rollout Section */}
      <div className="border border-slate-700 rounded-lg p-6 bg-slate-900/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Gradual Rollout</h3>
            <div className="group relative">
              <Info className="w-4 h-4 text-slate-500 hover:text-slate-400 cursor-help" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 z-10">
                Gradually roll out to a percentage of users based on consistent hashing
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleRollout}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            {showRollout ? "Remove Rollout" : "Add Rollout"}
          </button>
        </div>

        {showRollout && formData.rollout ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Rollout Percentage
              </label>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.rollout.percentage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rollout: {
                        ...formData.rollout!,
                        percentage: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full"
                  disabled={isPending}
                />
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">
                    {formData.rollout.percentage}%
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.rollout.percentage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rollout: {
                          ...formData.rollout!,
                          percentage: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)),
                        },
                      })
                    }
                    className="w-20 px-3 py-1.5 bg-slate-900/50 border border-slate-700 rounded text-white text-sm text-right"
                    disabled={isPending}
                  />
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-200"
                    style={{ width: `${formData.rollout.percentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="rolloutAttr"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Bucketing Attribute
              </label>
              <input
                type="text"
                id="rolloutAttr"
                value={formData.rollout.attribute}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rollout: {
                      ...formData.rollout!,
                      attribute: e.target.value,
                    },
                  })
                }
                placeholder="userId"
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono"
                disabled={isPending}
              />
              <p className="text-xs text-slate-500 mt-1">
                User attribute for consistent bucketing (e.g., userId, accountId)
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">
            No rollout - applies to all matching users at 100%
          </p>
        )}
      </div>

      <div className="border border-slate-700 rounded-lg p-6 bg-slate-900/30">
        <h3 className="text-lg font-semibold text-white mb-4">
          Return Value <span className="text-red-400">*</span>
        </h3>

        <ReturnValueInput
          flagType={flagType}
          value={formData.serve}
          onChange={(value) => setFormData({ ...formData, serve: value })}
          disabled={isPending}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
        {/*<div className="flex items-center gap-2">*/}
        {/*  <input*/}
        {/*    type="checkbox"*/}
        {/*    id="enabled"*/}
        {/*    checked={formData.enabled}*/}
        {/*    onChange={(e) =>*/}
        {/*      setFormData({ ...formData, enabled: e.target.checked })*/}
        {/*    }*/}
        {/*    className="w-4 h-4 rounded border-slate-700 bg-slate-900"*/}
        {/*    disabled={isPending}*/}
        {/*  />*/}
        {/*  <label htmlFor="enabled" className="text-sm text-slate-300">*/}
        {/*    Enable this rule immediately*/}
        {/*  </label>*/}
        {/*</div>*/}

        <div className="flex items-center gap-3">
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
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {existingRule ? "Update Rule" : "Create Rule"}
          </button>
        </div>
      </div>
    </form>
  );
}

// Condition Row Component
interface ConditionRowProps {
  condition: Condition;
  index: number;
  onUpdate: (updates: Partial<Condition>) => void;
  onRemove: () => void;
  disabled: boolean;
}

function ConditionRow({ condition, index, onUpdate, onRemove, disabled }: ConditionRowProps) {
  const operators = [
    { value: "equals", label: "equals", example: 'value = "premium"' },
    { value: "notEquals", label: "not equals", example: 'value ≠ "free"' },
    { value: "in", label: "is one of", example: 'value in ["a", "b"]' },
    { value: "contains", label: "contains", example: 'value contains "test"' },
    {
      value: "startsWith",
      label: "starts with",
      example: 'value starts with "admin"',
    },
    {
      value: "endsWith",
      label: "ends with",
      example: 'value ends with "@company.com"',
    },
    { value: "greaterThan", label: "greater than", example: "value > 100" },
    { value: "lessThan", label: "less than", example: "value < 50" },
  ];

  const needsArrayValue = condition.operator === "in";
  console.log({ needsArrayValue });

  return (
    <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
      <div className="flex items-center gap-2 shrink-0 mt-2">
        <GripVertical className="w-4 h-4 text-slate-600 cursor-move" />
        <span className="text-xs font-mono text-slate-500">#{index + 1}</span>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Attribute */}
        <div>
          <input
            type="text"
            value={condition.attribute}
            onChange={(e) => onUpdate({ attribute: e.target.value })}
            placeholder="e.g., plan, email, userId"
            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono"
            disabled={disabled}
          />
        </div>

        {/* Operator */}
        <div>
          <select
            value={condition.operator}
            onChange={(e) => onUpdate({ operator: e.target.value as Operator })}
            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={disabled}
          >
            {operators.map((op) => (
              <option key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
          </select>
        </div>

        {/* Value */}
        <div>
          {needsArrayValue ? (
            <input
              type="text"
              value={
                Array.isArray(condition.value)
                  ? (condition.value.join(", ") as string)
                  : (condition.value as string)
              }
              onChange={(e) => {
                onUpdate({ value: e.target.value });
              }}
              onBlur={(e) => {
                onUpdate({
                  value: e.target.value
                    .split(",")
                    .map((v) => v.trim())
                    .filter(Boolean),
                });
              }}
              placeholder='e.g., "premium", "enterprise"'
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono"
              disabled={disabled}
            />
          ) : (
            <input
              type="text"
              value={condition.value as string}
              onChange={(e) => onUpdate({ value: e.target.value })}
              placeholder="value"
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono"
              disabled={disabled}
            />
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors shrink-0"
        disabled={disabled}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

// Return Value Input Component
function ReturnValueInput({
  flagType,
  value,
  onChange,
  disabled,
}: {
  flagType: string;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled: boolean;
}) {
  if (flagType === "BOOLEAN") {
    return (
      <select
        value={String(value)}
        onChange={(e) => onChange(e.target.value === "true")}
        className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        disabled={disabled}
      >
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
    );
  }

  if (flagType === "JSON") {
    return (
      <textarea
        value={typeof value === "string" ? value : JSON.stringify(value, null, 2)}
        onChange={(e) => onChange(e.target.value)}
        placeholder='{"key": "value"}'
        rows={6}
        className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm resize-none"
        disabled={disabled}
      />
    );
  }

  return (
    <input
      type={flagType === "NUMBER" ? "number" : "text"}
      value={value as string | number}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`Enter ${flagType.toLowerCase()} value`}
      className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
      disabled={disabled}
    />
  );
}

// Helper functions
function getDefaultServeValue(flagType: string): string | number | boolean | JSON {
  switch (flagType) {
    case "BOOLEAN":
      return true;
    case "STRING":
      return "";
    case "NUMBER":
      return 0;
    case "JSON":
      return "{}";
    default:
      return "";
  }
}

function parseValueByType(
  value: string,
  flagType: "BOOLEAN" | "STRING" | "JSON" | "NUMBER",
): string | number | boolean {
  switch (flagType) {
    case "BOOLEAN":
      return value === "true";
    case "NUMBER":
      const num = parseFloat(value);
      if (isNaN(num)) throw new Error("Invalid number");
      return num;
    case "JSON":
      return typeof value === "string" ? JSON.parse(value) : value;
    default:
      return value;
  }
}
