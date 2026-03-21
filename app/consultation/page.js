"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function ConsultationSelectionPage() {

  const [user,setUser] = useState(null);
  const router = useRouter();

  useEffect(()=>{

    const storedUser = localStorage.getItem("rxflowUser");

    if(!storedUser){
      router.push("/login");
      return;
    }

    setUser(JSON.parse(storedUser));

  },[router]);

  if(!user){
    return null;
  }

  const conditions = [

    {
      name:"Cold Sores",
      description:"Assessment form for cold sores consultations.",
      href:"/consultation/cold-sores",
      available:true
    },

    {
      name:"Shingles",
      description:"Assessment form coming soon.",
      available:false
    },

    {
      name:"Oral Thrush",
      description:"Assessment form coming soon.",
      available:false
    },

    {
      name:"Vulvovaginal Thrush",
      description:"Assessment form coming soon.",
      available:false
    },

    {
      name:"Impetigo",
      description:"Assessment form coming soon.",
      available:false
    },

    {
      name:"Uncomplicated Lower UTI (Cystitis)",
      description:"Assessment form coming soon.",
      available:false
    },

    {
      name:"Allergic Rhinitis & Allergic Conjunctivitis",
      description:"Assessment form coming soon.",
      available:false
    }

  ];

  return(

    <main className="min-h-screen bg-slate-100">

      <Navbar user={user}/>

      {/* Back navigation */}
      <div className="mx-auto max-w-6xl px-6 pt-6 md:px-10">

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-slate-600 font-medium hover:text-sky-700 hover:-translate-x-1 transition"
        >
          <ArrowLeft size={18}/>
          <span className="text-sm">Back to Dashboard</span>
        </Link>

      </div>

      <div className="mx-auto max-w-6xl p-6 md:p-10">

        <header className="mb-10">

          <h1 className="text-4xl font-bold text-slate-900">
            Select CCS Condition
          </h1>

          <p className="mt-2 text-lg text-slate-600">
            Choose the consultation type you want to begin.
          </p>

        </header>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {conditions.map((condition)=>(

            <div
              key={condition.name}

              className={`rounded-2xl border p-6 shadow-sm transition ${
                condition.available
                ? "bg-white border-slate-200 hover:shadow-md hover:-translate-y-1"
                : "bg-slate-50 border-slate-200 opacity-80"
              }`}
            >

              <div className="flex items-start justify-between gap-4">

                <h2 className="text-2xl font-semibold text-slate-900">
                  {condition.name}
                </h2>

                {!condition.available &&(

                  <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
                    Coming soon
                  </span>

                )}

              </div>

              <p className="mt-3 text-slate-600">
                {condition.description}
              </p>

              <div className="mt-6">

                {condition.available ?(

                  <Link
                    href={condition.href}
                    className="inline-flex items-center rounded-xl bg-sky-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-sky-800"
                  >
                    Start Consultation
                  </Link>

                ):(
                  
                  <button
                    disabled
                    className="inline-flex cursor-not-allowed items-center rounded-xl bg-slate-300 px-5 py-3 text-sm font-medium text-slate-600"
                  >
                    Unavailable
                  </button>

                )}

              </div>

            </div>

          ))}

        </div>

      </div>

    </main>

  );

}