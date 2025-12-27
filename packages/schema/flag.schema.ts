import { ReturnValueType } from "@db/prisma/generated/client.js";
import { BaseRule, baseRuleSchema } from "./project.schema.js";
import { baseEnvironmentSchema } from "./environment.schema.js";
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
  id: z.string(),
  conditions: z.array(ConditionSchema).optional(),
  rollout: RolloutSchema.optional(),
  serve: z.unknown().optional(),
});

export const RulesSchema = z.array(RuleSchema);

// const rulesSchema = z.union([
//   z.null(),
//   z.record(z.string(), z.unknown()), // any object
//   z.array(z.unknown()), // any array
//   z.string(),
//   z.number(),
//   z.boolean(),
// ]);

// export const baseFlagSchema = z.object({
//   key: z.string(),
//   description: z.string().optional(),
//   rules: RulesSchema,
//   returnValueType: z.enum(ReturnValueType),
//   defaultValue: z.json(),
//   archived: z.boolean().optional(),
//   projectId: z.uuid(),
// });

export const baseFlagSchema = z.object({
  key: z.string(),
  description: z.string(),
  rules: baseRuleSchema,
  returnValueType: z.enum(ReturnValueType),
  defaultValue: z.json(),
  archived: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  projectId: z.uuid(),
  environments: baseEnvironmentSchema,
});

export const updateFlagSchema = baseFlagSchema.extend({
  id: z.string(),
  updatedAt: z.date(),
});

export type BaseFlag = z.infer<typeof baseFlagSchema>;
export type UpdateFlag = z.infer<typeof updateFlagSchema>;
