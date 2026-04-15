"use client";

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100">
      {/* Top Navigation */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
              <Image
                src="/logo.png"
                alt="RxFlow"
                width={28}
                height={28}
              />
            </div>

            <div className="leading-tight">
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
                Aspect line
              </p>

              <h1 className="text-xl font-bold text-slate-900">RxFlow</h1>
            </div>
          </Link>

          <div className="flex gap-3">
            <Link
              href="/login"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl p-6 md:p-10">
        {/* Header */}
        <header className="mb-10">
          <h2 className="text-4xl font-bold text-slate-900 md:text-5xl">
            CCS Workflow Support System
          </h2>

          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            RxFlow helps community pharmacists document CCS consultations
            efficiently with structured workflows and clear records.
          </p>
        </header>

        {/* Prototype Notice */}
        <section className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h3 className="text-sm font-semibold text-amber-800">
            Prototype Notice
          </h3>

          <p className="mt-2 text-sm text-amber-700">
            This is an early prototype developed for workflow testing and
            research. It is not intended for clinical decision making.
          </p>
        </section>

        {/* Main Cards */}
        <section className="grid gap-6 md:grid-cols-3">
          {/* Main Action */}
          <div className="rounded-2xl bg-white p-7 shadow-sm md:col-span-2">
            <h3 className="text-2xl font-semibold text-slate-900">
              Start Consultation
            </h3>

            <p className="mt-3 text-slate-600">
              Begin a structured CCS consultation and generate a documentation
              record.
            </p>

            <div className="mt-7 flex gap-4">
              <Link
                href="/consultation"
                className="rounded-xl bg-sky-700 px-7 py-3 text-base font-medium text-white hover:bg-sky-800"
              >
                Start Consultation
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="rounded-2xl bg-white p-7 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              System Features
            </h3>

            <ul className="mt-5 space-y-3 text-sm text-slate-600">
              <li>• Structured CCS consultation workflow</li>
              <li>• Red-flag safety checks</li>
              <li>• Standardised documentation</li>
              <li>• Tablet optimised interface</li>
              <li>• Audit-ready consultation records</li>
            </ul>
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
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

          {/* Future Features Row */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Compliance Reports
            </h3>

            <p className="mt-2 text-sm text-slate-500">Planned feature</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Multi-branch Management
            </h3>

            <p className="mt-2 text-sm text-slate-500">Planned feature</p>
          </div>
        </section>
      </div>
    </main>
  );
}