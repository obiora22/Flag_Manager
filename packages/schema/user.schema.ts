import { z } from "zod";

export const BaseUserSchema = z.object({
  name: z.string(),
  email: z.email(),
  role: z.enum(["VIEWER", "EDITOR", "ADMIN"]),
});

export const UpdateUserSchema = BaseUserSchema.extend({ id: z.uuid() });
console.log("user.schema loaded, BaseUserSchema:", BaseUserSchema);
export type BaseUser = z.infer<typeof BaseUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;

export default BaseUserSchema;
