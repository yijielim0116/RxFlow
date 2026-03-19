"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pharmacy, setPharmacy] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>_\-\\[\]/`~+=;'"]/;

    if (!name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!pharmacy.trim()) {
      newErrors.pharmacy = "Pharmacy name is required";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else {
      if (password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (!specialCharacterRegex.test(password)) {
        newErrors.password =
          "Password must include at least 1 special character";
      }
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length === 0) {
      const existingUsers =
        JSON.parse(localStorage.getItem("rxflowUsers")) || [];

      const emailExists = existingUsers.find(
        (user) => user.email.toLowerCase() === email.toLowerCase()
      );

      if (emailExists) {
        newErrors.email = "An account with this email already exists";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const user = {
        name,
        email,
        pharmacy,
        password,
      };

      const existingUsers =
        JSON.parse(localStorage.getItem("rxflowUsers")) || [];

      existingUsers.push(user);

      localStorage.setItem("rxflowUsers", JSON.stringify(existingUsers));
      localStorage.setItem("rxflowUser", JSON.stringify(user));

      router.push("/dashboard");
    }
  };

  return (
    <main className="relative min-h-screen bg-slate-200 flex items-center justify-center px-6">
      {/* Back Button */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-600 font-medium hover:text-sky-700 hover:-translate-x-1 transition"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">Back to Home</span>
        </Link>
      </div>

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-16 items-center">
        {/* Left Side */}
        <div className="max-w-xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-sky-700">
            Aspect Line
          </p>

          <h1 className="text-6xl font-bold text-sky-700 mb-4">
            RxFlow
          </h1>

          <p className="text-2xl leading-snug text-slate-800">
            Create an account to access structured CCS workflow and
            documentation tools for community pharmacy consultations.
          </p>
        </div>

        {/* Right Side */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full rounded-lg border px-4 py-3 text-slate-800 outline-none transition ${
                    errors.name
                      ? "border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-slate-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full rounded-lg border px-4 py-3 text-slate-800 outline-none transition ${
                    errors.email
                      ? "border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-slate-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Pharmacy name"
                  value={pharmacy}
                  onChange={(e) => setPharmacy(e.target.value)}
                  className={`w-full rounded-lg border px-4 py-3 text-slate-800 outline-none transition ${
                    errors.pharmacy
                      ? "border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-slate-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                  }`}
                />
                {errors.pharmacy && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.pharmacy}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full rounded-lg border px-4 py-3 text-slate-800 outline-none transition ${
                    errors.password
                      ? "border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-slate-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full rounded-lg border px-4 py-3 text-slate-800 outline-none transition ${
                    errors.confirmPassword
                      ? "border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-slate-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-emerald-600 py-3 text-lg font-semibold text-white transition hover:bg-emerald-700"
              >
                Sign Up
              </button>
            </form>

            <div className="my-6 border-t border-slate-200" />

            <div className="text-center">
              <p className="text-sm text-slate-600">
                Already have an account?
              </p>

              <Link
                href="/login"
                className="mt-2 inline-block text-sm font-medium text-sky-700 hover:underline"
              >
                Go to Login
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-slate-600">
            Prototype sign up page for demonstration purposes only.
          </p>
        </div>
      </div>
    </main>
  );
}