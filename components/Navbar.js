"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import Image from "next/image";

export default function Navbar({ user }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("rxflowUser");
    router.push("/");
  };

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
            <Image
              src="/logo.png"
              alt="RxFlow"
              width={28}
              height={28}
            />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-xs font-semibold uppercase tracking-wide text-sky-700">
              Aspect Line
            </span>

            <span className="text-xl font-bold text-slate-900 transition hover:text-sky-700">
              RxFlow
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {user && (
            <Link
              href="/profile"
              className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-100"
            >
              <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-slate-300">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={14} className="text-slate-600" />
                )}
              </div>

              <span className="leading-none">
                {user.name?.split(" ")[0]}
              </span>
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="flex h-10 items-center justify-center rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}