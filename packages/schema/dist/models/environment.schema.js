// import { InputJsonValue } from "@db/prisma/generated/internal/prismaNamespace.js";
import z from "zod";
export const baseEnvironmentSchema = z.object({
    environment: z.enum(["PRODUCTION", "DEVELOPMENT", "STAGING"]),
    overrides: z.json(),
    flagId: z.uuid(),
});
export const updateEnvironmentSchema = z.object({
    id: z.uuid(),
    updatedAt: z.date(),
});
//# sourceMappingURL=environment.schema.js.map