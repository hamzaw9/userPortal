import { useState } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  signupSchema,
  loginSchema,
  type SignupFormData,
  type LoginFormData,
} from "../schemas/auth.schema";

/* Union type because form switches */
type AuthFormData = SignupFormData | LoginFormData;

export const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: yupResolver(isSignup ? signupSchema : loginSchema),
  });

  const onSubmit = (data: AuthFormData) => {
    const existingUsers: SignupFormData[] = JSON.parse(
      localStorage.getItem("userData") || "[]",
    );

    // SIGNUP
    if (isSignup) {
      const signupData = data as SignupFormData;

      const userExists = existingUsers.find(
        (user) => user.email === signupData.email,
      );

      if (userExists) {
        alert("Email already exists");
        return;
      }

      existingUsers.push(signupData);
      localStorage.setItem("userData", JSON.stringify(existingUsers));

      alert("Signup successful!");
    }

    // LOGIN
    else {
      const loginData = data as LoginFormData;

      const user = existingUsers.find(
        (u) => u.email === loginData.email && u.password === loginData.password,
      );

      if (!user) {
        alert("Invalid email or password");
        return;
      }

      alert("Login successful!");
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          {isSignup ? "Sign Up" : "Login"}
        </h2>

        <form
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {/* Email */}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* DOB (Only for Signup) */}
          {isSignup && (
            <div>
              <label className="block text-sm mb-1">Date of Birth</label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2"
                {...register("dob")}
              />
              {(errors as FieldErrors<SignupFormData>).dob && (
                <p className="text-red-500 text-sm">
                  {(errors as FieldErrors<SignupFormData>).dob?.message}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="ml-2 text-blue-500 font-medium"
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};
