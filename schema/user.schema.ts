import { z } from "zod";

export const baseUserSchema = z.object({
  name: z.string(),
  email: z.email(),
  role: z.enum(["VIEWER", "EDITOR", "ADMIN"]),
});

export const updateUserSchema = baseUserSchema.extend({ id: z.uuid() });

export type BaseUser = z.infer<typeof baseUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
