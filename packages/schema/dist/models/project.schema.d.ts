import { z } from "zod";
declare const baseRuleSchema: z.ZodObject<{
    condition: z.ZodOptional<z.ZodObject<{
        attribute: z.ZodString;
        operator: z.ZodEnum<{
            equals: "equals";
            notEquals: "notEquals";
        }>;
        value: z.ZodUnion<readonly [z.ZodNumber, z.ZodString, z.ZodBoolean, z.ZodJSONSchema]>;
    }, z.core.$strip>>;
    rollout: () => z.ZodOptional<z.ZodObject<{
        percentage: z.ZodNumber;
        value: z.ZodJSONSchema;
    }, z.core.$strip>>;
    serve: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString, z.ZodBoolean, z.ZodJSONSchema]>>;
}, z.core.$strip>;
export declare const baseProjectSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    organizationId: z.ZodString;
}, z.core.$strip>;
export declare const updateProjectSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    organizationId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type BaseProject = z.infer<typeof baseProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;
export type BaseRule = z.infer<typeof baseRuleSchema>;
export {};
//# sourceMappingURL=project.schema.d.ts.map