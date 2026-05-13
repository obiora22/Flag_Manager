// import { InputJsonValue } from "@db/prisma/generated/internal/prismaNamespace.js";
import z from "zod";

type LocalInputJsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: LocalInputJsonValue }
  | LocalInputJsonValue[];

export const baseEnvironmentSchema = z.object({
  environment: z.enum(["PRODUCTION", "DEVELOPMENT", "STAGING"]),
  overrides: z.json(),
  flagId: z.uuid(),
});

export const updateEnvironmentSchema = z.object({
  id: z.uuid(),
  updatedAt: z.date(),
});

export type BaseEnvironment = z.infer<typeof baseEnvironmentSchema>;
export type UpdateEnvironment = z.infer<typeof updateEnvironmentSchema>;
