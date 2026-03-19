"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

export default function Navbar({ user }) {

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("rxflowUser");
    router.push("/");
  };

  return (

    <nav className="bg-white border-b border-slate-200">

      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* Left */}

        <div>

          <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
            Aspect Line
          </p>

          <Link
            href="/dashboard"
            className="text-2xl font-bold text-slate-900"
          >
            RxFlow
          </Link>

        </div>

        {/* Right */}

        <div className="flex items-center gap-3">

          {user && (

            <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-sm font-semibold shadow-sm">

              <User size={16} />

              {user.name}

            </div>

          )}

          <button
            onClick={handleLogout}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition"
          >
            Logout
          </button>

        </div>

      </div>

    </nav>

  );

}