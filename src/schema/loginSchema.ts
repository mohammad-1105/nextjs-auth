import { z } from "zod";

export const loginSchema = z.object({
  email: z.string({ message: "Email is required" }).email().trim(),
  password: z
    .string({ message: "password is required" })
    .min(8, { message: "password must be at least 8 characters" }),
});
