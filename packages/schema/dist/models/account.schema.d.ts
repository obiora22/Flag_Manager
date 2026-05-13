import { z } from "zod";
export declare const passwordSchema: z.ZodString;
export declare const AccountInputSchema: z.ZodObject<{
    organizationName: z.ZodString;
    firstname: z.ZodString;
    lastname: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
    passwordConfirmation: z.ZodString;
}, z.core.$strip>;
export type AccountInput = z.infer<typeof AccountInputSchema>;
//# sourceMappingURL=account.schema.d.ts.map