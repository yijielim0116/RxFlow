"use client";
/* @ts-nocheck */

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ArrowLeft } from "lucide-react";

export default function ConsultationDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const [user, setUser] = useState(null);
  const [consultation, setConsultation] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("rxflowUser");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(storedUser));

    const storedConsultations =
      JSON.parse(localStorage.getItem("rxflowConsultations")) || [];

    const foundConsultation = storedConsultations.find(
      (item) => String(item.id) === String(params.id)
    );

    setConsultation(foundConsultation || null);
  }, [router, params.id]);

  if (!user) {
    return null;
  }

  if (!consultation) {
    return (
      <main className="min-h-screen bg-slate-100">
        <Navbar user={user} />

        <div className="mx-auto max-w-6xl px-6 pt-6 md:px-10">
          <Link
            href="/recent-consultations"
            className="inline-flex items-center gap-2 text-slate-600 font-medium transition hover:-translate-x-1 hover:text-sky-700"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back to Recent Consultations</span>
          </Link>
        </div>

        <div className="mx-auto max-w-6xl p-6 md:p-10">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">
              Consultation not found
            </h1>
            <p className="mt-2 text-slate-600">
              The consultation record could not be found.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const data = consultation.data || {};

  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar user={user} />

      <div className="mx-auto max-w-6xl px-6 pt-6 md:px-10">
        <Link
          href="/recent-consultations"
          className="inline-flex items-center gap-2 text-slate-600 font-medium transition hover:-translate-x-1 hover:text-sky-700"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back to Recent Consultations</span>
        </Link>
      </div>

      <div className="mx-auto max-w-6xl p-6 md:p-10">
        <h1 className="mb-6 text-4xl font-bold text-slate-900">
          Consultation Details
        </h1>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">
              {consultation.type}
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-700 md:grid-cols-2">
              <p>
                <span className="font-medium">Patient Name:</span>{" "}
                {consultation.patientName || "-"}
              </p>
              <p>
                <span className="font-medium">Pharmacist Name:</span>{" "}
                {consultation.pharmacistName || "-"}
              </p>
              <p className="md:col-span-2">
                <span className="font-medium">Created:</span>{" "}
                {consultation.createdAt
                  ? new Date(consultation.createdAt).toLocaleString()
                  : "-"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-semibold text-slate-900">
              Personal Details
            </h3>

            <div className="grid grid-cols-1 gap-3 text-sm text-slate-700 md:grid-cols-2">
              <p><span className="font-medium">Patient Name:</span> {data.patientName || "-"}</p>
              <p><span className="font-medium">Contact:</span> {data.contact || "-"}</p>
              <p><span className="font-medium">Address:</span> {data.address || "-"}</p>
              <p><span className="font-medium">Eircode:</span> {data.eircode || "-"}</p>
              <p><span className="font-medium">PPSN:</span> {data.ppsn || "-"}</p>
              <p><span className="font-medium">Scheme Number:</span> {data.schemeNumber || "-"}</p>
              <p><span className="font-medium">Scheme Type:</span> {data.schemeType || "-"}</p>
              <p><span className="font-medium">DOB:</span> {data.dob || "-"}</p>
              <p><span className="font-medium">Sex:</span> {data.sex || "-"}</p>
              <p><span className="font-medium">Guardian:</span> {data.guardian || "-"}</p>
              <p><span className="font-medium">GP Name:</span> {data.gpName || "-"}</p>
              <p><span className="font-medium">GP Contact:</span> {data.gpContact || "-"}</p>
              <p className="md:col-span-2">
                <span className="font-medium">GP Address:</span> {data.gpAddress || "-"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-semibold text-slate-900">
              Presenting Complaint
            </h3>

            <div className="space-y-3 text-sm text-slate-700">
              <p><span className="font-medium">Symptoms:</span> {data.symptoms || "-"}</p>
              <p><span className="font-medium">Medication Tried:</span> {data.medicationTried || "-"}</p>
              <p><span className="font-medium">Medication List:</span> {data.medicationList || "-"}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-semibold text-slate-900">
              Medical History
            </h3>

            <div className="grid grid-cols-1 gap-3 text-sm text-slate-700 md:grid-cols-2">
              <p><span className="font-medium">Medical Conditions:</span> {data.medicalConditions || "-"}</p>
              <p><span className="font-medium">Pregnant:</span> {data.pregnant ? "Yes" : "No"}</p>
              <p><span className="font-medium">Breastfeeding:</span> {data.breastfeeding ? "Yes" : "No"}</p>
              <p><span className="font-medium">Renal Impairment:</span> {data.renalImpairment || "-"}</p>
              <p><span className="font-medium">Hepatic Impairment:</span> {data.hepaticImpairment || "-"}</p>
              <p><span className="font-medium">Allergy Status:</span> {data.allergyStatus || "-"}</p>
              <p className="md:col-span-2">
                <span className="font-medium">Existing Medication:</span> {data.existingMedication || "-"}
              </p>
              <p><span className="font-medium">Antimicrobial Resistance:</span> {data.antimicrobialResistance || "-"}</p>
              <p className="md:col-span-2">
                <span className="font-medium">Resistance Details:</span> {data.resistanceDetails || "-"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-semibold text-slate-900">
              Consultation Outcome
            </h3>

            <div className="grid grid-cols-1 gap-3 text-sm text-slate-700 md:grid-cols-2">
              <p><span className="font-medium">Outcome:</span> {data.consultationOutcome || "-"}</p>
              <p><span className="font-medium">Referral:</span> {data.outcomeReferral ? "Yes" : "No"}</p>
              <p><span className="font-medium">Prescription Issued:</span> {data.outcomePrescriptionIssued ? "Yes" : "No"}</p>
              <p><span className="font-medium">Self-Care Advice:</span> {data.outcomeSelfCareAdvice ? "Yes" : "No"}</p>
              <p><span className="font-medium">No Treatment:</span> {data.outcomeNoTreatment ? "Yes" : "No"}</p>
              <p className="md:col-span-2">
                <span className="font-medium">Outcome Details:</span> {data.outcomeDetails || "-"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-semibold text-slate-900">
              Pharmacist Record
            </h3>

            <div className="grid grid-cols-1 gap-3 text-sm text-slate-700 md:grid-cols-2">
              <p><span className="font-medium">Pharmacist Name:</span> {data.pharmacistName || "-"}</p>
              <p><span className="font-medium">Registration Number:</span> {data.pharmacistRegistration || "-"}</p>
              <p><span className="font-medium">Pharmacy Name:</span> {data.pharmacyName || "-"}</p>
              <p><span className="font-medium">Signature:</span> {data.pharmacistSignature || "-"}</p>
              <p><span className="font-medium">Date:</span> {data.pharmacistDate || "-"}</p>
              <p><span className="font-medium">Record Completed:</span> {data.recordCompleted ? "Yes" : "No"}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}