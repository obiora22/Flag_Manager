import { z } from "zod";
import {
  Flag,
  FlagEnvironmentType,
  ReturnValueType,
} from "@db/prisma/generated/client.ts";

const returnValue = z.union([z.number(), z.string(), z.boolean(), z.json()]);

export const baseRuleSchema = z.object({
  condition: z
    .object({
      attribute: z.string(),
      operator: z.enum(["equals", "notEquals"]),
      value: returnValue,
    })
    .optional(),
  rollout: z.object({ percentage: z.number(), value: z.json() }).optional,
  serve: returnValue.optional(),
});

const baseFlagEnvironment = z.object({
  environment: z.enum(FlagEnvironmentType),
  overrides: z.json(),
  createdAt: z.date(),
  updatedAt: z.date(),
  fladId: z.uuid(),
});

export const baseProjectSchema = z.object({
  name: z.string(),
  slug: z.string(),
  // flags: z.array(baseFlagSchema),
});

export const updateProjectSchema = baseProjectSchema.extend({ id: z.string() });

export type BaseProject = z.infer<typeof baseProjectSchema>;

export type UpdateProject = z.infer<typeof updateProjectSchema>;

export type BaseRule = z.infer<typeof baseRuleSchema>;
