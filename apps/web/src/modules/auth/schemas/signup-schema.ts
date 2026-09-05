import { z } from "zod";

// Define the schema
export const signupSchema = z
  .object({
    name: z.string().trim().min(1, {
      message: "Name is required !"
    }),
    email: z.email({
      message: "Please enter a valid email address !"
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters long !"
    }),
    confirmPassword: z.string().min(1, {
      message: "Confirm password is required !"
    })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match !",
    path: ["confirmPassword"]
  });

// Inffered Type Definition
export type SignupSchema = z.infer<typeof signupSchema>;
