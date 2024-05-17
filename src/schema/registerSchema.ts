import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({ message: "name is required" })
    .min(4, { message: "name must be at least 4 characters" })
    .max(20, { message: "name must be at most 20 characters" }),
  email: z.string({ message: "Email is required" }).email().trim(),
  password: z
    .string({ message: "password is required" })
    .min(8, { message: "password must be at least 8 characters" }),
});
