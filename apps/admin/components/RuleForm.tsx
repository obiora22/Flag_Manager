import React, { useState } from "react";
import { Condition } from "@db/types/rules.ts";

const operators = [
  "equals",
  "greaterThan",
  "notEquals",
  "contains",
  "notContains",
  "gt",
  "gte",
  "lt",
  "lte",
  "startsWith",
  "endsWith",
  "in",
] as const;

interface Props {
  onClose: () => void;
  onOpen: () => void;
}

const inputClassName =
  "w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2";

export function RuleForm({ onClose }: Props) {
  const [isPending] = React.useTransition();
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [ruleFormData, setRuleFormData] = useState({
    rule: {
      key: "",
      serve: "",
      percentage: 0,
    },
    condition: {
      valueType: "BOOLEAN",
      value: "",
      attribute: "",
      operator: operators[0] as unknown as typeof operators,
    },
  });

  const { condition } = ruleFormData;

  return (
    <div className={"border p-4 rounded-md"}>
      <div className={"my-4"}>
        <div>
          <label htmlFor={"key"}>Key</label>
          <input
            id={"key"}
            required
            className={inputClassName}
            placeholder={"add short descriptive name"}
          />
        </div>
      </div>
      <div className={"border rounded-md p-4"}>
        <p className={"underline mb-4"}>conditions</p>
        <div>
          <label htmlFor={"attribute"}>attribute</label>
          <input
            id={"attribute"}
            type={"text"}
            value={condition.attribute}
            className={
              "w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2"
            }
          />
        </div>
        <div>
          <label>operator</label>
          <select
            id={"operator"}
            className={
              "w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:ring-2"
            }
          >
            {operators.map((operator, index) => (
              <option key={index} value={operator}>
                {operator}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="valueType" className="block text-sm font-medium text-slate-300 mb-2">
            value type <span className="text-red-400">*</span>
          </label>
          <select
            id="valueType"
            onChange={(e) =>
              setRuleFormData({
                ...ruleFormData,
                condition: {
                  ...condition,
                  valueType: e.target.value,
                },
              })
            }
            className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={isPending}
          >
            <option value="BOOLEAN">Boolean</option>
            <option value="STRING">String</option>
            <option value="NUMBER">Number</option>
            <option value="JSON">JSON</option>
          </select>
        </div>
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-slate-300 mb-2">
            value <span className="text-red-400">*</span>
          </label>

          {condition.valueType === "BOOLEAN" ? (
            <select
              id="value"
              onChange={(e) =>
                setRuleFormData({
                  ...ruleFormData,
                  condition: {
                    ...condition,
                    value: e.target.value,
                  },
                })
              }
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
              disabled={isPending}
            >
              <option value="">Select value</option>
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          ) : condition.valueType === "JSON" ? (
            <textarea
              id="defaultValue"
              value={condition.value as string}
              onChange={(e) =>
                setRuleFormData({
                  ...ruleFormData,
                  condition: {
                    ...condition,
                    value: e.target.value,
                  },
                })
              }
              placeholder={""}
              rows={4}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none font-mono text-sm"
              required
              disabled={isPending}
            />
          ) : (
            <input
              type={condition.valueType === "NUMBER" ? "number" : "text"}
              id="value"
              value={condition.value as number | string}
              onChange={(e) =>
                setRuleFormData({
                  ...ruleFormData,
                  condition: {
                    ...condition,
                    value: e.target.value,
                  },
                })
              }
              placeholder={""}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
              disabled={isPending}
            />
          )}
        </div>
        <button
          className={"border rounded-md px-4 py-2 mt-6"}
          onClick={() => setConditions(conditions)}
        >
          add conditions
        </button>
      </div>
      <p className={"py-4 underline"}>rollout</p>
      <div className={"border p-4"}>
        <label htmlFor={"attribute"}>
          percentage % <span className="text-red-400">*</span>
        </label>
        <input
          id={"attribute"}
          type={"number"}
          className={
            "w-full px-4 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 py-2"
          }
        />
      </div>
      <div
        className={
          "flex gap-2 justify-end [&>button]:border [&>button]:w-1/5 [&>button]:rounded-md [&>button]:cursor-pointer pt-4"
        }
      >
        <button onClick={onClose}>cancel</button>
        <button onClick={() => undefined}>add</button>
      </div>
    </div>
  );
}
