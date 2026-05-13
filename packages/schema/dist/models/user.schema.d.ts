import { z } from "zod";
export declare const baseUserSchema: z.ZodObject<{
    firstname: z.ZodString;
    lastname: z.ZodString;
    email: z.ZodEmail;
    role: z.ZodEnum<{
        VIEWER: "VIEWER";
        EDITOR: "EDITOR";
        ADMIN: "ADMIN";
    }>;
}, z.core.$strip>;
export declare const UpdateUserSchema: z.ZodObject<{
    firstname: z.ZodOptional<z.ZodString>;
    lastname: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodEmail>;
    role: z.ZodOptional<z.ZodEnum<{
        VIEWER: "VIEWER";
        EDITOR: "EDITOR";
        ADMIN: "ADMIN";
    }>>;
}, z.core.$strip>;
export type BaseUser = z.infer<typeof baseUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
//# sourceMappingURL=user.schema.d.ts.map