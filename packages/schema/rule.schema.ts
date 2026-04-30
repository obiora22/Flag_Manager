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
    "in",
  ]),
  value: z.unknown(),
});

export const RolloutSchema = z.object({
  attribute: z.string(),
  percentage: z.number().min(0).max(100),
  value: z.unknown(),
});

export const baseRuleSchema = z.object({
  key: z.string(),
  conditions: z.array(ConditionSchema).optional(),
  rollout: RolloutSchema.optional(),
  // serve: z.union([z.json(), z.null(), z.boolean()]),
  serve: z.unknown(),
});

export const rulesSchema = z.array(baseRuleSchema);

export type Rule = z.infer<typeof baseRuleSchema>;
export type Rules = z.infer<typeof rulesSchema>;
