import * as yup from "yup";
import type { InferType } from "yup";

export const signupSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().required("Email is required").email("Enter valid email"),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/,
      "Password must be 8+ chars, include letter, number & special char"
    ),
  dob: yup
    .string()
    .required("Date of birth is required")
    .test("age-check", "You must be at least 18 years old", (value) => {
      if (!value) return false;
      const dob = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
      return age >= 18;
    }),
});

export const loginSchema = yup.object({
  firstName: yup.string(),
  lastName: yup.string(),
  email: yup.string().required("Email is required").email("Enter valid email"),
  password: yup.string().required("Password is required"),
});

export type SignupFormData = InferType<typeof signupSchema>;
export type LoginFormData = InferType<typeof loginSchema>;