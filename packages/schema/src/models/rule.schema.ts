import z from "zod";

export const conditionSchema = z.object({
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

export const rolloutSchema = z.object({
  attribute: z.string(),
  percentage: z.number().min(0).max(100),
  value: z.unknown(),
});

export const baseRuleSchema = z.object({
  key: z.string(),
  conditions: z.array(conditionSchema).optional(),
  rollout: rolloutSchema.optional(),
  serve: z.unknown(),
});

export const rulesSchema = z.array(baseRuleSchema);

export type Rule = z.infer<typeof baseRuleSchema>;
export type Rules = z.infer<typeof rulesSchema>;
