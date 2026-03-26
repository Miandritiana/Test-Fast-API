"use client"

import * as z from "zod";


// Form auth sign-in with comprehensive validation
export const getFormSchemaSignIn = () => z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .min(5, "Email must contain at least 5 characters")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, "Password is required")
});

// Form auth sign-up with comprehensive validation
export const getFormSchemaSignUp = () => z.object({
  last_name: z
    .string()
    .min(1, "Last name is required")
    .toLowerCase()
    .trim(),
  first_name: z
    .string()
    .min(1, "First name is required")
    .toLowerCase()
    .trim(),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password is too short"),
  passwordConfirm: z
    .string()
    .min(1, "Password confirmation is required")
})
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });