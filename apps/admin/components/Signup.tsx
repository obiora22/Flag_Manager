"use client";

import { accountRegistrationAction } from "@admin/actions/registration";
import { Loader2 } from "lucide-react";
import { useActionState, useState } from "react";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  organizationName: "",
  password: "",
  passwordConfirmation: "",
};

export function Signup() {
  const [form, setForm] = useState<typeof initialState>(initialState);
  const [passwordConfirmation, setPasswordConfirmation] = useState(true);
  const [state, formAction, isPending] = useActionState(accountRegistrationAction, {
    status: "idle",
  });

  console.log({ state });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.name, e.target.value);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Create an Account</h1>

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">
              Organization Name
            </label>
            <input
              id="organizationName"
              type="text"
              name="organizationName"
              value={form.organizationName}
              onChange={handleChange}
              placeholder="organization name"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="passwordConfirmation"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="passwordConfirmation"
              type="password"
              name="passwordConfirmation"
              value={form.passwordConfirmation}
              onChange={handleChange}
              onBlur={(e) => {
                const password = document.getElementById("password") as HTMLInputElement;
                if (password.value !== e.target.value) {
                  setPasswordConfirmation(false);
                } else {
                  setPasswordConfirmation(true);
                }
              }}
              placeholder="********"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            {!passwordConfirmation && (
              <span className="text-red-300">Password confirmation does not match</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending || !passwordConfirmation}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Loader2
              className={`animate-spin ${isPending ? "inline-block" : "hidden"}`}
              size={16}
            />
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
