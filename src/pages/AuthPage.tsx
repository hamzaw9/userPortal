import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";

import {
  signupSchema,
  loginSchema,
  type SignupFormData,
  type LoginFormData,
} from "../schemas/auth.schema";

interface AuthPageProps {
  showOnlyNameFields?: boolean;
  onLogin?: () => void;
  onNameSaved?: () => void;
}

// Dashboard-only type
type NameFormData = {
  firstName: string;
  lastName: string;
};

// Full auth type
type CurrentForm = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  dob?: string;
};


export const AuthPage = ({ showOnlyNameFields = false, onLogin, onNameSaved }: AuthPageProps) => {
  const [isSignup, setIsSignup] = useState(true);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CurrentForm>({
    resolver: yupResolver(
      (showOnlyNameFields
        ? signupSchema.pick(["firstName", "lastName"])
        : isSignup
        ? signupSchema.omit(["firstName", "lastName"])
        : loginSchema) as any
    ),
  });

  // Prefill dashboard names from userData
  useEffect(() => {
    if (showOnlyNameFields) {
      const email = localStorage.getItem("loggedInEmail") || "";
      const users: SignupFormData[] = JSON.parse(
        localStorage.getItem("userData") || "[]"
      );
      const user = users.find((u) => u.email === email);
      setValue("firstName", user?.firstName ?? "");
      setValue("lastName", user?.lastName ?? "");
    }
  }, [showOnlyNameFields, setValue]);

  const onSubmit: SubmitHandler<CurrentForm> = (data) => {
    if (showOnlyNameFields) {
      // Dashboard: save names into the user's record inside userData
      const { firstName, lastName } = data as NameFormData;
      const email = localStorage.getItem("loggedInEmail") || "";
      const users: SignupFormData[] = JSON.parse(
        localStorage.getItem("userData") || "[]"
      );
      const updatedUsers = users.map((u) =>
        u.email === email ? { ...u, firstName, lastName } : u
      );
      localStorage.setItem("userData", JSON.stringify(updatedUsers));
      onNameSaved?.();
      return;
    }

    const existingUsers: SignupFormData[] = JSON.parse(
      localStorage.getItem("userData") || "[]"
    );

    if (isSignup) {
      const signupData = data as SignupFormData;
      if (existingUsers.find((u) => u.email === signupData.email)) {
        alert("Email already exists");
        reset();
        return;
      }
      existingUsers.push(signupData);
      localStorage.setItem("userData", JSON.stringify(existingUsers));

      alert("Signup successful! Please log in.");
      reset();
      setIsSignup(false);
    } else {
      const loginData = data as LoginFormData;
      const user = existingUsers.find(
        (u) => u.email === loginData.email && u.password === loginData.password
      );
      if (!user) {
        alert("Invalid email or password");
        return;
      }

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("loggedInEmail", user.email);

      onLogin?.();
      navigate("/dashboard");
    }
  };

  // Dashboard embed: render bare form only, no wrapper
  if (showOnlyNameFields) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your first name"
            {...register("firstName")}
          />
          {errors.firstName?.message && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your last name"
            {...register("lastName")}
          />
          {errors.lastName?.message && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors"
        >
          Save Name
        </button>
      </form>
    );
  }

  return (
    <div className="h-full flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          {isSignup ? "Sign Up" : "Login"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Email */}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2"
              {...register("email")}
            />
            {errors.email?.message && (
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
            {errors.password?.message && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* DOB — signup only */}
          {isSignup && (
            <div>
              <label className="block text-sm mb-1">Date of Birth</label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2"
                {...register("dob")}
              />
              {errors.dob?.message && (
                <p className="text-red-500 text-sm">{errors.dob.message}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg cursor-pointer"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>

          <p className="text-sm text-center mt-4">
            {isSignup ? "Already have an account?" : "Don't have an account?"}
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="ml-2 text-blue-500 font-medium cursor-pointer"
            >
              {isSignup ? "Login" : "Sign Up"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};