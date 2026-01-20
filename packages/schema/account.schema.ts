import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8)
  .superRefine((arg, context) => {
    const includesUpperCase = /[A-Z]+/.test(arg);
    const includesLowerCase = /[a-z]+/.test(arg);
    const includesNumber = /[0-9]+/.test(arg);
    const includesSpecialCharacter = /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]+/.test(arg);
    const isInvalid = !(
      includesLowerCase &&
      includesUpperCase &&
      includesSpecialCharacter &&
      includesNumber
    );
    if (isInvalid) {
      context.addIssue({
        code: "custom",
        message: `Your password must be at least 8 characters long
          and contain at least one uppercase letter, lowercase letter, number and special character.`,
      });
    }
  });

export const AccountInputSchema = z.object({
  organizationName: z.string().min(1),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.email(),
  password: z.string().min(10),
  passwordConfirmation: z.string().min(10),
});

export type AccountInput = z.infer<typeof AccountInputSchema>;
