import { z } from "zod";
// import { Flag, FlagEnvironmentType, ReturnValueType } from "@db/prisma/generated/client.js";

const returnValue = z.union([z.number(), z.string(), z.boolean(), z.json()]);
const baseRuleSchema = z.object({
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
  environment: z.enum(["DEVELOPMENT", "STAGING", "PRODUCTION"]),
  overrides: z.json(),
  createdAt: z.date(),
  updatedAt: z.date(),
  flagId: z.uuid(),
});

export const baseProjectSchema = z.object({
  name: z.string(),
  slug: z.string(),
  organizationId: z.string(),
});

export const updateProjectSchema = baseProjectSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type BaseProject = z.infer<typeof baseProjectSchema>;

export type UpdateProject = z.infer<typeof updateProjectSchema>;

export type BaseRule = z.infer<typeof baseRuleSchema>;
