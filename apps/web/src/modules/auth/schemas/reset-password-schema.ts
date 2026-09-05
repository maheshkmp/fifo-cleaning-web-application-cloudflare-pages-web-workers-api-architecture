import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match !",
    path: ["confirmPassword"],
  });

export type ResetPasswordSchemaT = z.infer<typeof resetPasswordSchema>;
