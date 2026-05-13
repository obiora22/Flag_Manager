import z from "zod";
export declare const conditionSchema: z.ZodObject<{
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
}, z.z.core.$strip>;
export declare const rolloutSchema: z.ZodObject<{
    attribute: z.ZodString;
    percentage: z.ZodNumber;
    value: z.ZodUnknown;
}, z.z.core.$strip>;
export declare const baseRuleSchema: z.ZodObject<{
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
}, z.z.core.$strip>;
export declare const rulesSchema: z.ZodArray<z.ZodObject<{
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
export type Rule = z.infer<typeof baseRuleSchema>;
export type Rules = z.infer<typeof rulesSchema>;
//# sourceMappingURL=rule.schema.d.ts.map