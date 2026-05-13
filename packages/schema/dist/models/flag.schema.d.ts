import z from "zod";
export declare const baseFlagSchema: z.ZodObject<{
    key: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    rules: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        conditions: z.ZodOptional<z.ZodArray<z.ZodObject<{
            attribute: z.ZodString;
            operator: z.ZodEnum<{
                equals: "equals";
                notEquals: "notEquals";
                contains: "contains";
                notContains: "notContains";
                gt: "gt";
                gte: "gte";
                lt: "lt";
                lte: "lte";
                startsWith: "startsWith";
                endsWith: "endsWith";
                in: "in";
            }>;
            value: z.ZodUnknown;
        }, z.z.core.$strip>>>;
        rollout: z.ZodOptional<z.ZodObject<{
            attribute: z.ZodString;
            percentage: z.ZodNumber;
            value: z.ZodUnknown;
        }, z.z.core.$strip>>;
        serve: z.ZodUnknown;
    }, z.z.core.$strip>>;
    returnValueType: z.ZodEnum<{
        BOOLEAN: "BOOLEAN";
        NUMBER: "NUMBER";
        STRING: "STRING";
        JSON: "JSON";
    }>;
    defaultValue: z.ZodJSONSchema;
    projectId: z.ZodUUID;
    enabled: z.ZodBoolean;
    archived: z.ZodBoolean;
}, z.z.core.$strip>;
export declare const updateFlagSchema: z.ZodObject<{
    key: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    rules: z.ZodOptional<z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        conditions: z.ZodOptional<z.ZodArray<z.ZodObject<{
            attribute: z.ZodString;
            operator: z.ZodEnum<{
                equals: "equals";
                notEquals: "notEquals";
                contains: "contains";
                notContains: "notContains";
                gt: "gt";
                gte: "gte";
                lt: "lt";
                lte: "lte";
                startsWith: "startsWith";
                endsWith: "endsWith";
                in: "in";
            }>;
            value: z.ZodUnknown;
        }, z.z.core.$strip>>>;
        rollout: z.ZodOptional<z.ZodObject<{
            attribute: z.ZodString;
            percentage: z.ZodNumber;
            value: z.ZodUnknown;
        }, z.z.core.$strip>>;
        serve: z.ZodUnknown;
    }, z.z.core.$strip>>>;
    returnValueType: z.ZodOptional<z.ZodEnum<{
        BOOLEAN: "BOOLEAN";
        NUMBER: "NUMBER";
        STRING: "STRING";
        JSON: "JSON";
    }>>;
    defaultValue: z.ZodOptional<z.ZodJSONSchema>;
    projectId: z.ZodOptional<z.ZodUUID>;
    enabled: z.ZodOptional<z.ZodBoolean>;
    archived: z.ZodOptional<z.ZodBoolean>;
}, z.z.core.$strip>;
export type BaseFlag = z.infer<typeof baseFlagSchema>;
export type UpdateFlag = z.infer<typeof updateFlagSchema>;
//# sourceMappingURL=flag.schema.d.ts.map