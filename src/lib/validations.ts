import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().optional(),
});

export const addressSchema = z.object({
  label: z.string().optional(),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "Valid ZIP code required"),
  country: z.string().default("US"),
});

export const phoneSchema = z.object({
  number: z.string().min(10, "Valid phone number required"),
  type: z.string().optional(),
});

export const scanRequestSchema = z.object({
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
});

export const authorizationSchema = z.object({
  signature: z.string().min(1, "Signature is required"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type PhoneInput = z.infer<typeof phoneSchema>;
