// @ts-nocheck
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ArrowLeft, Eye, Trash2, Search } from "lucide-react";

export default function RecentConsultationsPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("rxflowUser");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    const storedConsultations =
      JSON.parse(localStorage.getItem("rxflowConsultations")) || [];

    setConsultations(storedConsultations.reverse());
  }, [router]);

  const handleDeleteConsultation = (id) => {
    const updatedConsultations = consultations.filter(
      (consultation) => consultation.id !== id
    );

    setConsultations(updatedConsultations);

    localStorage.setItem(
      "rxflowConsultations",
      JSON.stringify([...updatedConsultations].reverse())
    );
  };

  const filteredConsultations = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return consultations;

    return consultations.filter((consultation) => {
      const patientName = consultation.patientName?.toLowerCase() || "";
      const type = consultation.type?.toLowerCase() || "";
      const pharmacistName = consultation.pharmacistName?.toLowerCase() || "";

      return (
        patientName.includes(search) ||
        type.includes(search) ||
        pharmacistName.includes(search)
      );
    });
  }, [consultations, searchTerm]);

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar user={user} />

      <div className="mx-auto max-w-6xl px-6 pt-6 md:px-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-slate-600 font-medium transition hover:-translate-x-1 hover:text-sky-700"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back to Dashboard</span>
        </Link>
      </div>

      <div className="mx-auto max-w-6xl p-6 md:p-10">
        <h1 className="mb-2 text-4xl font-bold text-slate-900">
          Recent Consultations
        </h1>

        <p className="mb-6 text-slate-600">
          View previously saved consultation records.
        </p>

        {consultations.length > 0 && (
          <div className="mb-8">
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search by patient name, consultation type, or pharmacist"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 placeholder-slate-400 outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </div>
        )}

        {consultations.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              No consultations saved yet
            </h2>
            <p className="mt-2 text-slate-500">
              Saved consultations will appear here once you complete and save
              them.
            </p>

            <div className="mt-6">
              <Link
                href="/consultation"
                className="inline-flex items-center rounded-xl bg-sky-700 px-6 py-3 text-base font-medium text-white transition hover:bg-sky-800"
              >
                Start Consultation
              </Link>
            </div>
          </div>
        ) : filteredConsultations.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              No matching consultations found
            </h2>
            <p className="mt-2 text-slate-500">
              Try searching with a patient name, consultation type, or
              pharmacist name.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200 text-left">
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Patient
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Consultation Type
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Pharmacist
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Date Saved
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredConsultations.map((consultation) => (
                    <tr
                      key={consultation.id}
                      className="border-b border-slate-100 last:border-b-0"
                    >
                      <td className="px-6 py-4 text-sm text-slate-800">
                        {consultation.patientName || "-"}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {consultation.type || "-"}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {consultation.pharmacistName || "-"}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {consultation.createdAt
                          ? new Date(consultation.createdAt).toLocaleString()
                          : "-"}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-3">
                          <Link
                            href={`/recent-consultations/${consultation.id}`}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                          >
                            <Eye size={16} />
                            View
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteConsultation(consultation.id)
                            }
                            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}