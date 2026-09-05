import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.email({
    message: "Please enter a valid email address !"
  })
});

export type ForgotPasswordSchemaT = z.infer<typeof forgotPasswordSchema>;
