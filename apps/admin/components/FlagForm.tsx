import React, { SetStateAction, useMemo, useState, useTransition } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { BaseFlag } from "@schema/flag.schema.ts";
import { isEqual } from "lodash";
import type { BasicFlag, CompositeFlag } from "@api/lib/contracts";
import { clientSideFetch } from "@admin/lib/clientFetch";
import { APIResult } from "@repo/utils/serviceReturn";

interface Props {
  flag?: CompositeFlag;
  projectId: string;
  onSuccess?: (flagId: string) => void;
  onCancel: () => void;
  revalidate?: () => void;
  setFlag?: React.Dispatch<SetStateAction<CompositeFlag>>;
}

type ReturnValueTye = "BOOLEAN" | "STRING" | "NUMBER" | "JSON";

type JSONType = string | number | boolean | null | { [key: string]: JSONType } | JSONType[];

export function FlagForm({ onCancel, projectId, revalidate, flag, setFlag }: Props) {
  const isEditMode = flag !== undefined;
  const { key, description, returnValueType, defaultValue } = flag || {};
  const stableInitialData = useMemo(() => {
    return {
      key: key || "",
      projectId,
      rules: [],
      description: description || "",
      archived: false,
      enabled: false,
      returnValueType: returnValueType || ("BOOLEAN" as ReturnValueTye),
      defaultValue: (defaultValue as JSONType) || false,
    };
  }, [defaultValue, key, projectId, description, returnValueType]);

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<BaseFlag>(stableInitialData);

  const isDirty = useMemo(() => {
    return !isEqual(formData, stableInitialData);
  }, [formData, stableInitialData]);

  console.log({ isEditMode });
  console.log("equal?", isEqual(formData, stableInitialData), formData.key, stableInitialData.key);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const createFlag = async () => {
      const response = await clientSideFetch<APIResult<CompositeFlag>>("/flags", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (response.status !== "success") {
        setError(response.error);
      } else if (response.payload.status === "error") {
        setError(response.payload.error);
      } else {
        console.log(response.payload.data);
        if (revalidate) revalidate();
        onCancel();
      }
    };

    const updateFlag = async (flagId: string) => {
      if (!revalidate || !setFlag) return;
      const result = await clientSideFetch<APIResult<BasicFlag>>(`/flags/${flagId}`, {
        method: "PATCH",
        body: JSON.stringify(formData),
      });

      if (result.status !== "success") {
        setError(result.error);
      } else if (result.payload.status === "error") {
        setError(result.payload.error);
      } else {
        const updatedFlag = result.payload.data;
        if (revalidate) revalidate();
        if (setFlag)
          setFlag((prev) => ({
            ...prev,
            ...updatedFlag,
            rules: prev.rules,
            environments: prev.environments,
          }));
        onCancel();
      }
    };
    startTransition(async () => {
      return isEditMode ? updateFlag(flag.id) : createFlag();
    });
  };

  const getDefaultValuePlaceholder = () => {
    switch (formData.returnValueType) {
      case "BOOLEAN":
        return "true or false";
      case "STRING":
        return "Enter string value";
      case "NUMBER":
        return "Enter number value";
      case "JSON":
        return '{"key": "value"}';
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Banner */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Flag Key */}
        <div>
          <label htmlFor="key" className="block text-sm font-medium text-slate-300 mb-2">
            Flag Key <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="key"
            value={formData.key}
            onChange={(e) => setFormData({ ...formData, key: e.target.value })}
            placeholder="Enter flag key"
            className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono"
            required
            disabled={isPending}
          />
          <p className="text-xs text-slate-500 mt-1">
            Lowercase letters, numbers, hyphens, and underscores only
          </p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe what this flag controls..."
            rows={3}
            className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            disabled={isPending}
            required
          />
        </div>
        <div>
          <label htmlFor="enabled" className="pr-4">
            Enable flag
          </label>
          <input
            type="checkbox"
            className="border"
            checked={formData.enabled}
            id="enabled"
            onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
            disabled={isPending}
            required
          />
        </div>

        {/* Return Type */}
        <div>
          <label
            htmlFor="returnValueType"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Return Type <span className="text-red-400">*</span>
          </label>
          <select
            id="returnValueType"
            onChange={(e) =>
              setFormData({
                ...formData,
                returnValueType: e.target.value as ReturnValueTye,
                defaultValue: "", // Reset default value when type changes
              })
            }
            className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={isPending}
            required
          >
            <option value="BOOLEAN">Boolean</option>
            <option value="STRING">String</option>
            <option value="NUMBER">Number</option>
            <option value="JSON">JSON</option>
          </select>
        </div>

        {/* Default Value */}
        <div>
          <label htmlFor="defaultValue" className="block text-sm font-medium text-slate-300 mb-2">
            Default Value <span className="text-red-400">*</span>
          </label>

          {formData.returnValueType === "BOOLEAN" ? (
            <select
              id="defaultValue"
              value={formData.defaultValue as string}
              onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
              disabled={isPending}
            >
              <option value="">Select value</option>
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          ) : formData.returnValueType === "JSON" ? (
            <textarea
              id="defaultValue"
              value={formData.defaultValue as string}
              onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
              placeholder={getDefaultValuePlaceholder()}
              rows={4}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none font-mono text-sm"
              required
              disabled={isPending}
            />
          ) : (
            <input
              type={formData.returnValueType === "NUMBER" ? "number" : "text"}
              id="defaultValue"
              value={formData.defaultValue as number | string}
              onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
              placeholder={getDefaultValuePlaceholder()}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
              disabled={isPending}
            />
          )}

          <p className="text-xs text-slate-500 mt-1">Value returned when no rules match</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
          <button
            type="button"
            onClick={onCancel}
            disabled={isEditMode ? isPending : isPending || !isDirty}
            className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isEditMode ? isPending : isPending || !isDirty}
            className={`flex items-center gap-2 px-6 py-2 ${
              isDirty ? "bg-blue-500 hover:bg-blue-700 text-white" : "border text-gray-700"
            }   rounded-lg font-medium transition-colors disabled:opacity-50`}
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEditMode ? "update flag" : "create flag"}
          </button>
        </div>
      </form>
      <div></div>
    </div>
  );
}
