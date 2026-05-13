// import { ReturnType } from "@db/prisma/generated/client.js";
// import { InputJsonValue } from "@db/prisma/generated/internal/prismaNamespace.js";
import z from "zod";
import { rulesSchema } from "./rule.schema.js";
const EnvironmentSchema = z.object({
    environment: z.enum(["PRODUCTION", "DEVELOPMENT", "STAGING"]),
    overrides: z.json(),
    flagId: z.uuid(),
});
export const baseFlagSchema = z.object({
    key: z.string(),
    description: z.string().optional(),
    rules: rulesSchema,
    returnValueType: z.enum(["BOOLEAN", "NUMBER", "STRING", "JSON"]),
    defaultValue: z.json(),
    projectId: z.uuid(),
    enabled: z.boolean(),
    archived: z.boolean(),
});
export const updateFlagSchema = baseFlagSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
    message: "At lease one field must be provided",
});
//# sourceMappingURL=flag.schema.js.map