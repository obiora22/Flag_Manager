import { z } from "zod";
export const baseUserSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    email: z.email(),
    role: z.enum(["VIEWER", "EDITOR", "ADMIN"]),
});
export const UpdateUserSchema = baseUserSchema.partial();
//# sourceMappingURL=user.schema.js.map