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

        {/* Left */}

        <Link href="/dashboard" className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">

            <Image
              src="/logo.png"   // put your icon in public folder
              alt="RxFlow"
              width={28}
              height={28}
            />

          </div>

          <div className="flex flex-col leading-tight">

            <span className="text-xs font-semibold uppercase tracking-wide text-sky-700">
              Aspectline
            </span>

            <span className="text-xl font-bold text-slate-900 hover:text-sky-700 transition">
              RxFlow
            </span>

          </div>

        </Link>

        {/* Right */}

        <div className="flex items-center gap-3">

          {user && (

            <Link
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-sm font-semibold shadow-sm hover:bg-slate-100 hover:border-slate-300 transition"
            >

              <div className="w-8 h-8 rounded-full bg-slate-300 overflow-hidden flex items-center justify-center">

                {user.avatar ? (

                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <User size={16} className="text-slate-600"/>

                )}

              </div>

              <span>
                {user.name?.split(" ")[0]}
              </span>

            </Link>

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