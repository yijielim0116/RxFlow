"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length === 0) {
      const existingUsers =
        JSON.parse(localStorage.getItem("rxflowUsers")) || [];

      const matchedUser = existingUsers.find(
        (user) =>
          user.email.toLowerCase() === email.toLowerCase() &&
          user.password === password
      );

      if (!matchedUser) {
        newErrors.password = "Invalid email or password";
      } else {
        localStorage.setItem("rxflowUser", JSON.stringify(matchedUser));
        router.push("/dashboard");
        return;
      }
    }

    setErrors(newErrors);
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
            Streamline CCS consultations and generate structured,
            audit-ready documentation for community pharmacists.
          </p>
        </div>

        {/* Right Side */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full rounded-lg border px-4 py-3 text-slate-800 outline-none transition ${errors.email
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
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full rounded-lg border px-4 py-3 text-slate-800 outline-none transition ${errors.password
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

              <button
                type="submit"
                className="w-full rounded-lg bg-sky-700 py-3 text-lg font-semibold text-white transition hover:bg-sky-800"
              >
                Log In
              </button>
            </form>

            <div className="mt-5 text-center">
              <a
                href="#"
                className="text-sm font-medium text-sky-700 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <div className="my-6 border-t border-slate-200" />

            <div className="text-center">
              <p className="mb-3 text-sm text-slate-600">
                Don&apos;t have an account?
              </p>

              <Link
                href="/signup"
                className="inline-block rounded-lg bg-emerald-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-emerald-700"
              >
                Sign Up
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-slate-600">
            Prototype login page for testing and demonstration purposes.
          </p>
        </div>
      </div>
    </main>
  );
}