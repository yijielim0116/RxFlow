"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("rxflowUser");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [router]);

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar user={user} />

      <div className="mx-auto max-w-6xl p-6 md:p-10">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Welcome back, {user.name}
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Access your CCS workflow tools and prototype features below.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm md:col-span-2">
            <h2 className="text-2xl font-semibold text-slate-900">
              Start Consultation
            </h2>
            <p className="mt-2 text-slate-600">
              Begin a structured CCS consultation workflow and generate
              documentation.
            </p>

            <div className="mt-6">
              <Link
                href="/consultation"
                className="inline-flex items-center rounded-xl bg-sky-700 px-6 py-3 text-base font-medium text-white hover:bg-sky-800"
              >
                Start New Consultation
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Quick Overview
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>• Guided CCS workflow</li>
              <li>• Red-flag checks</li>
              <li>• Structured documentation</li>
              <li>• Tablet-optimised design</li>
            </ul>
          </div>
        </section>

        <section className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Recent Consultations
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              View saved consultation records.
            </p>

            <div className="mt-4">
              <Link
                href="/recent-consultations"
                className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-medium text-white hover:bg-sky-800 transition"
              >
                Open
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Documentation Summary
            </h3>
            <p className="mt-2 text-sm text-slate-500">Coming soon</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Compliance Tools
            </h3>
            <p className="mt-2 text-sm text-slate-500">Coming soon</p>
          </div>
        </section>
      </div>
    </main>
  );
}