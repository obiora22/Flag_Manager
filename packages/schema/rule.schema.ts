import z from "zod";

export const ConditionSchema = z.object({
  attribute: z.string(),
  operator: z.enum([
    "equals",
    "notEquals",
    "contains",
    "notContains",
    "gt",
    "gte",
    "lt",
    "lte",
    "startsWith",
    "endsWith",
  ]),
  value: z.unknown(),
});

export const RolloutSchema = z.object({
  attribute: z.string(),
  percentage: z.number().min(0).max(100),
  value: z.unknown(),
});

export const RuleSchema = z.object({
  key: z.string(),
  conditions: z.array(ConditionSchema).optional(),
  rollout: RolloutSchema.optional(),
  serve: z.union([z.json(), z.null(), z.boolean()]),
});

export const RulesSchema = z.array(RuleSchema).default([]);
