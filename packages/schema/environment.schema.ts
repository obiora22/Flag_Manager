import { InputJsonValue } from "@db/prisma/generated/internal/prismaNamespace";
import z from "zod";

export const baseEnvironmentSchema = z.object({
  environment: z.enum(["PRODUCTION", "DEVELOPMENT", "STAGING"]),
  overrides: z.json().transform((val) => val as InputJsonValue),
  flagId: z.uuid(),
});

export const updateEnvironmentSchema = z.object({
  id: z.uuid(),
  updatedAt: z.date(),
});

export type BaseEnvironment = z.infer<typeof baseEnvironmentSchema>;
export type UpdateEnvironment = z.infer<typeof updateEnvironmentSchema>;
