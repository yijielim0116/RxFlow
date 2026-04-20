// @ts-nocheck
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  ArrowLeft,
  Eye,
  Trash2,
  Search,
  Filter,
  CalendarDays,
  FileText,
  User,
  Phone,
  BadgePlus,
  Share2,
  Pencil,
} from "lucide-react";

export default function RecentConsultationsPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

  useEffect(() => {
    const storedUser = localStorage.getItem("rxflowUser");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(JSON.parse(storedUser));

    const storedConsultations =
      JSON.parse(localStorage.getItem("rxflowConsultations")) || [];

    const sortedConsultations = [...storedConsultations].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setConsultations(sortedConsultations);
  }, [router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const consultationTypes = [
    { label: "All", value: "All" },
    { label: "Cold Sores", value: "Cold Sores Consultation" },
    {
      label: "Allergic Rhinitis & Allergic Conjunctivitis",
      value: "Allergic Rhinitis & Allergic Conjunctivitis",
    },
    { label: "Shingles", value: "Shingles Consultation" },
    { label: "Oral Thrush", value: "Oral Thrush Consultation" },
    {
      label: "Vulvovaginal Thrush",
      value: "Vulvovaginal Thrush Consultation",
    },
    { label: "Impetigo", value: "Impetigo Consultation" },
    {
      label: "Uncomplicated Lower UTI (Cystitis)",
      value: "Uncomplicated Lower UTI (Cystitis) Consultation",
    },
  ];

  const handleDeleteConsultation = (id) => {
    const updatedConsultations = consultations.filter(
      (consultation) => consultation.id !== id
    );

    setConsultations(updatedConsultations);
    localStorage.setItem(
      "rxflowConsultations",
      JSON.stringify(updatedConsultations)
    );
  };

  const handleShareConsultation = async (consultation) => {
    const shareText = `
Patient: ${consultation.patientName || "-"}
Consultation Type: ${consultation.type || "-"}
Pharmacist: ${consultation.pharmacistName || "-"}
Date Saved: ${consultation.createdAt
        ? new Date(consultation.createdAt).toLocaleString()
        : "-"
      }
PPSN: ${consultation.data?.ppsn || "-"}
Contact: ${consultation.data?.contact || "-"}
  `.trim();

    try {
      if (navigator.share) {
        await navigator.share({
          title: consultation.patientName || "Consultation Record",
          text: shareText,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        alert("Consultation details copied to clipboard.");
      } else {
        alert("Sharing is not supported on this device.");
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  const getEditLink = (consultation) => {
    switch ((consultation.type || "").trim()) {
      case "Cold Sores Consultation":
        return `/consultation/cold-sores?id=${consultation.id}&mode=edit`;

      case "Allergic Rhinitis & Allergic Conjunctivitis":
        return `/consultation/allergic-rhinitis-conjunctivitis?id=${consultation.id}&mode=edit`;

      default:
        return `/recent-consultations/${consultation.id}`;
    }
  };

  const filteredConsultations = useMemo(() => {
    const search = debouncedSearch.trim().toLowerCase();
    const now = new Date();

    return consultations.filter((consultation) => {
      const patientName = consultation.patientName?.toLowerCase().trim() || "";
      const type = consultation.type?.toLowerCase().trim() || "";
      const pharmacistName =
        consultation.pharmacistName?.toLowerCase().trim() || "";
      const ppsn = consultation.data?.ppsn?.toLowerCase().trim() || "";
      const contact = consultation.data?.contact?.toLowerCase().trim() || "";

      const matchesSearch =
        !search ||
        patientName.includes(search) ||
        type.includes(search) ||
        pharmacistName.includes(search) ||
        ppsn.includes(search) ||
        contact.includes(search);

      const matchesType =
        typeFilter === "All" ||
        (consultation.type || "").trim() === typeFilter.trim();

      let matchesDate = true;

      if (dateFilter !== "All" && consultation.createdAt) {
        const createdAt = new Date(consultation.createdAt);

        if (dateFilter === "Today") {
          matchesDate = createdAt.toDateString() === now.toDateString();
        }

        if (dateFilter === "Last 7 Days") {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(now.getDate() - 7);
          matchesDate = createdAt >= sevenDaysAgo;
        }

        if (dateFilter === "Last 30 Days") {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(now.getDate() - 30);
          matchesDate = createdAt >= thirtyDaysAgo;
        }
      }

      return matchesSearch && matchesType && matchesDate;
    });
  }, [consultations, debouncedSearch, typeFilter, dateFilter]);

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const highlightMatch = (text) => {
    if (!text) return "-";
    if (!debouncedSearch.trim()) return text;

    const escaped = escapeRegExp(debouncedSearch.trim());
    const regex = new RegExp(`(${escaped})`, "gi");

    return text.replace(
      regex,
      '<mark class="rounded bg-yellow-200 px-1 text-slate-900">$1</mark>'
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setTypeFilter("All");
    setDateFilter("All");
  };

  const getTypeBadgeClass = (type) => {
    switch ((type || "").trim()) {
      case "Cold Sores Consultation":
        return "bg-rose-50 text-rose-700 border border-rose-200";

      case "Allergic Rhinitis & Allergic Conjunctivitis":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";

      case "Shingles Consultation":
        return "bg-violet-50 text-violet-700 border border-violet-200";

      case "Oral Thrush Consultation":
        return "bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200";

      case "Vulvovaginal Thrush Consultation":
        return "bg-pink-50 text-pink-700 border border-pink-200";

      case "Impetigo Consultation":
        return "bg-amber-50 text-amber-700 border border-amber-200";

      case "Uncomplicated Lower UTI (Cystitis) Consultation":
        return "bg-cyan-50 text-cyan-700 border border-cyan-200";

      default:
        return "bg-slate-50 text-slate-700 border border-slate-200";
    }
  };

  const getDisplayType = (type) => {
    if (!type) return "Consultation";
    return type.replace(" Consultation", "");
  };

  if (!user) return null;

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
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              Recent Consultations
            </h1>
            <p className="mt-2 text-slate-600">
              Search and review previously saved consultation records.
            </p>
          </div>

          {consultations.length > 0 && (
            <div className="rounded-xl bg-white px-4 py-3 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500">Results</p>
              <p className="text-2xl font-bold text-slate-900">
                {filteredConsultations.length}
              </p>
            </div>
          )}
        </div>

        {consultations.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm border border-slate-200">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50">
              <FileText className="text-sky-700" size={30} />
            </div>

            <h2 className="text-2xl font-semibold text-slate-900">
              No consultations saved yet
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-slate-500">
              Saved consultations will appear here once a pharmacist completes
              and saves a consultation record.
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
        ) : (
          <>
            <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr_1fr_auto]">
                <div className="relative">
                  <Search
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Search by patient name, PPSN, contact, consultation type, or pharmacist"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 placeholder-slate-400 outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                  />
                </div>

                <div className="relative">
                  <Filter
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full appearance-none rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                  >
                    {consultationTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <CalendarDays
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full appearance-none rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                  >
                    <option value="All">All Dates</option>
                    <option value="Today">Today</option>
                    <option value="Last 7 Days">Last 7 Days</option>
                    <option value="Last 30 Days">Last 30 Days</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Clear
                </button>
              </div>
            </div>

            {filteredConsultations.length === 0 ? (
              <div className="rounded-3xl bg-white p-10 text-center shadow-sm border border-slate-200">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
                  <Search className="text-slate-500" size={28} />
                </div>

                <h2 className="text-2xl font-semibold text-slate-900">
                  No matching consultations found
                </h2>

                <p className="mt-3 text-slate-500">
                  Try a different patient name, consultation type, pharmacist,
                  or date range.
                </p>
              </div>
            ) : (
              <div className="grid gap-5">
                {filteredConsultations.map((consultation) => (
                  <div
                    key={consultation.id}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                          <h2
                            className="text-2xl font-bold text-slate-900"
                            dangerouslySetInnerHTML={{
                              __html: highlightMatch(
                                consultation.patientName || "Unnamed Patient"
                              ),
                            }}
                          />

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getTypeBadgeClass(
                              consultation.type
                            )}`}
                          >
                            {getDisplayType(consultation.type)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                          <div className="rounded-2xl bg-slate-50 p-4">
                            <div className="mb-2 flex items-center gap-2 text-slate-500">
                              <User size={16} />
                              <span className="text-xs font-semibold uppercase tracking-wide">
                                Pharmacist
                              </span>
                            </div>
                            <p
                              className="text-sm font-medium text-slate-800"
                              dangerouslySetInnerHTML={{
                                __html: highlightMatch(
                                  consultation.pharmacistName || "-"
                                ),
                              }}
                            />
                          </div>

                          <div className="rounded-2xl bg-slate-50 p-4">
                            <div className="mb-2 flex items-center gap-2 text-slate-500">
                              <BadgePlus size={16} />
                              <span className="text-xs font-semibold uppercase tracking-wide">
                                PPSN
                              </span>
                            </div>
                            <p
                              className="text-sm font-medium text-slate-800"
                              dangerouslySetInnerHTML={{
                                __html: highlightMatch(
                                  consultation.data?.ppsn || "-"
                                ),
                              }}
                            />
                          </div>

                          <div className="rounded-2xl bg-slate-50 p-4">
                            <div className="mb-2 flex items-center gap-2 text-slate-500">
                              <Phone size={16} />
                              <span className="text-xs font-semibold uppercase tracking-wide">
                                Contact
                              </span>
                            </div>
                            <p
                              className="text-sm font-medium text-slate-800"
                              dangerouslySetInnerHTML={{
                                __html: highlightMatch(
                                  consultation.data?.contact || "-"
                                ),
                              }}
                            />
                          </div>

                          <div className="rounded-2xl bg-slate-50 p-4">
                            <div className="mb-2 flex items-center gap-2 text-slate-500">
                              <CalendarDays size={16} />
                              <span className="text-xs font-semibold uppercase tracking-wide">
                                Date Saved
                              </span>
                            </div>
                            <p className="text-sm font-medium text-slate-800">
                              {consultation.createdAt
                                ? new Date(
                                  consultation.createdAt
                                ).toLocaleString()
                                : "-"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row flex-wrap gap-3 lg:w-auto lg:flex-col">
                        <Link
                          href={`/recent-consultations/${consultation.id}`}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          <Eye size={16} />
                          View
                        </Link>

                        <Link
                          href={getEditLink(consultation)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-amber-600"
                        >
                          <Pencil size={16} />
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleShareConsultation(consultation)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-sky-800"
                        >
                          <Share2 size={16} />
                          Share
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteConsultation(consultation.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-700"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}