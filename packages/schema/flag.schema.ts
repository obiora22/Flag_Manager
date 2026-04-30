import { ReturnValueType } from "@db/prisma/generated/client.ts";
import { InputJsonValue } from "@db/prisma/generated/internal/prismaNamespace.js";
import z from "zod";
import { rulesSchema } from "./rule.schema.ts";

const EnvironmentSchema = z.object({
  environment: z.enum(["PRODUCTION", "DEVELOPMENT", "STAGING"]),
  overrides: z.json().transform((val) => val as InputJsonValue),
  flagId: z.uuid(),
});

export const baseFlagSchema = z.object({
  key: z.string(),
  description: z.string(),
  rules: rulesSchema,
  returnValueType: z.enum(ReturnValueType),
  defaultValue: z.json(),
  projectId: z.uuid(),
  enabled: z.boolean(),
  archived: z.boolean(),
  // createdAt: z.date().optional(),
  // updatedAt: z.date().optional(),
});

export const updateFlagSchema = baseFlagSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At lease one field must be provided",
  });

export type BaseFlag = z.infer<typeof baseFlagSchema>;
export type UpdateFlag = z.infer<typeof updateFlagSchema>;
