// src/lib/validations.js
import { z } from "zod";

export const userRegistrationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
  phone: z
    .string()
    .regex(/^[+]?[0-9]{10,15}$/, "Invalid phone number")
    .optional(),
  role: z.enum(["user", "admin"]).default("user"),
});




