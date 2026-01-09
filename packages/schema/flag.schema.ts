import { ReturnValueType } from "@db/prisma/generated/client.js";
import { BaseRule, baseRuleSchema } from "./project.schema.js";
import { baseEnvironmentSchema } from "./environment.schema.js";
import { InputJsonValue } from "@db/prisma/generated/internal/prismaNamespace.js";

import z from "zod";
import { RulesSchema } from "./rule.schema.ts";

const EnvironmentSchema = z.object({
  environment: z.enum(["PRODUCTION", "DEVELOPMENT", "STAGING"]),
  overrides: z.json().transform((val) => val as InputJsonValue),
  flagId: z.uuid(),
});

export const baseFlagSchema = z.object({
  key: z.string(),
  description: z.string(),
  rules: RulesSchema,
  returnValueType: z.enum(ReturnValueType),
  defaultValue: z.json(),
  projectId: z.uuid(),
  // environments: z.array(EnvironmentSchema).optional(),
});

export const updateFlagSchema = z.object({
  key: z.string().min(1).max(100).optional(),
  description: z.string().min(1).max(100),
  rules: RulesSchema,
  returnValueType: z.enum(ReturnValueType),
  defaultValue: z.json(),
  archived: z.boolean().optional(),
});

export type BaseFlag = z.infer<typeof baseFlagSchema>;
export type UpdateFlag = z.infer<typeof updateFlagSchema>;
