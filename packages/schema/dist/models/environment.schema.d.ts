import z from "zod";
export declare const baseEnvironmentSchema: z.ZodObject<{
    environment: z.ZodEnum<{
        PRODUCTION: "PRODUCTION";
        DEVELOPMENT: "DEVELOPMENT";
        STAGING: "STAGING";
    }>;
    overrides: z.ZodJSONSchema;
    flagId: z.ZodUUID;
}, z.z.core.$strip>;
export declare const updateEnvironmentSchema: z.ZodObject<{
    id: z.ZodUUID;
    updatedAt: z.ZodDate;
}, z.z.core.$strip>;
export type BaseEnvironment = z.infer<typeof baseEnvironmentSchema>;
export type UpdateEnvironment = z.infer<typeof updateEnvironmentSchema>;
//# sourceMappingURL=environment.schema.d.ts.map