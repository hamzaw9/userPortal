import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type FormData = {
  email: string;
  password: string;
  dob?: string;
};

// YUP SCHEMA

const signupSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Enter valid email"),

  password: yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/,
      "Password must be 8+ chars, include letter, number & special char",
    ),

  dob: yup
    .string()
    .required("Date of birth is required")
    .test("age-check", "You must be at least 18 years old", (value) => {
        console.log(value)
      if (!value) return false;

      const dob = new Date(value);
      const today = new Date();

      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      return age >= 18;
    }),
});

const loginSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Enter valid email"),

  password: yup.string().required("Password is required"),
});


export const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(isSignup ? signupSchema : loginSchema),
  });

  const onSubmit = (data: FormData) => {
    const existingUsers: any[] = JSON.parse(
      localStorage.getItem("userData") || "[]",
    );

    // SIGNUP
    if (isSignup) {
      const userExists = existingUsers.find(
        (user) => user.email === data.email,
      );

      if (userExists) {
        alert("Email already exists");
        return;
      }

      existingUsers.push(data);
      localStorage.setItem("userData", JSON.stringify(existingUsers));

      alert("Signup successful!");
    }

    // LOGIN
    else {
      const user = existingUsers.find(
        (u) => u.email === data.email && u.password === data.password,
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

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Email */}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {errors.email.message}
              </p>
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
              <p className="text-red-500 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* DOB */}
          {isSignup && (
            <div>
              <label className="block text-sm mb-1">Date of Birth</label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2"
                {...register("dob")}
              />
              {errors.dob && (
                <p className="text-red-500 text-sm">
                  {errors.dob.message}
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
