"use client";
/* @ts-nocheck */

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ArrowLeft, Pencil } from "lucide-react";

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

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(JSON.parse(storedUser));

    const storedConsultations =
      JSON.parse(localStorage.getItem("rxflowConsultations")) || [];

    const foundConsultation = storedConsultations.find(
      (item) => String(item.id) === String(params.id)
    );

    setConsultation(foundConsultation || null);
  }, [router, params.id]);

  if (!user) return null;

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
            <h1 className="text-2xl font-bold text-slate-900">Consultation not found</h1>
            <p className="mt-2 text-slate-600">The consultation record could not be found.</p>
          </div>
        </div>
      </main>
    );
  }

  const data = consultation.data || {};

  // ── Display helpers ───────────────────────────────────────────────────────────

  const strDisplay = (value) => value || "-";

  const boolDisplay = (value, skipped = false) => {
    if (skipped) return "-";
    return value ? "Yes" : "-";
  };

  // ── Determine consultation type ───────────────────────────────────────────────

  const isColdSores = (consultation.type || "").trim() === "Cold Sores Consultation";
  const isAllergicRhinitis = (consultation.type || "").trim() === "Allergic Rhinitis & Allergic Conjunctivitis";

  const stepsSkippedColdSores = data.redFlagPresent === "Yes";
  const stepsSkippedRhinitis = data.hasRedFlags === "Yes";

  // ── Edit link ─────────────────────────────────────────────────────────────────

  const getEditLink = () => {
    if (isColdSores) return `/consultation/cold-sores?id=${consultation.id}&mode=edit`;
    if (isAllergicRhinitis) return `/consultation/allergic-rhinitis-conjunctivitis?id=${consultation.id}&mode=edit`;
    return `/recent-consultations`;
  };

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
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Consultation Overview</h1>
            <p className="mt-1 text-slate-500">
              {consultation.type} —{" "}
              {consultation.createdAt
                ? new Date(consultation.createdAt).toLocaleString()
                : "-"}
            </p>
          </div>

          <Link
            href={getEditLink()}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-amber-600"
          >
            <Pencil size={16} />
            Edit Consultation
          </Link>
        </div>

        <div className="space-y-6">

          {/* 1. Personal Details */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">1. Personal Details</h3>
            <div className="grid grid-cols-1 gap-3 text-sm text-slate-700 md:grid-cols-2">
              <p><span className="font-medium">Patient Name:</span> {strDisplay(data.patientName)}</p>
              <p><span className="font-medium">Contact:</span> {strDisplay(data.contact)}</p>
              <p><span className="font-medium">Address:</span> {strDisplay(data.address)}</p>
              <p><span className="font-medium">Eircode:</span> {strDisplay(data.eircode)}</p>
              <p><span className="font-medium">PPSN:</span> {strDisplay(data.ppsn)}</p>
              <p><span className="font-medium">Scheme Number:</span> {strDisplay(data.schemeNumber)}</p>
              <p><span className="font-medium">Scheme Type:</span> {strDisplay(data.schemeType)}</p>
              <p><span className="font-medium">DOB:</span> {strDisplay(data.dob)}</p>
              <p><span className="font-medium">Sex:</span> {strDisplay(data.sex)}</p>
              {data.guardian && (
                <p><span className="font-medium">Guardian:</span> {strDisplay(data.guardian)}</p>
              )}
              <p><span className="font-medium">GP Name:</span> {strDisplay(data.gpName)}</p>
              <p><span className="font-medium">GP Contact:</span> {strDisplay(data.gpContact)}</p>
              <p className="md:col-span-2"><span className="font-medium">GP Address:</span> {strDisplay(data.gpAddress)}</p>
            </div>
          </div>

          {/* 2. Presenting Complaint */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">2. Presenting Complaint</h3>
            <div className="space-y-3 text-sm text-slate-700">
              <p><span className="font-medium">Symptoms:</span> {strDisplay(data.symptoms)}</p>
              <p><span className="font-medium">Medication Tried:</span> {strDisplay(data.medicationTried)}</p>
              <p><span className="font-medium">Medication List:</span> {strDisplay(data.medicationList)}</p>
            </div>
          </div>

          {/* 3. Medical History */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">3. Medical History</h3>
            <div className="grid grid-cols-1 gap-3 text-sm text-slate-700 md:grid-cols-2">
              <p><span className="font-medium">Medical Conditions:</span> {strDisplay(data.medicalConditions)}</p>
              <p><span className="font-medium">Pregnant:</span> {boolDisplay(data.pregnant)}</p>
              <p><span className="font-medium">Breastfeeding:</span> {boolDisplay(data.breastfeeding)}</p>
              <p><span className="font-medium">Renal Impairment:</span> {strDisplay(data.renalImpairment)}</p>
              <p><span className="font-medium">Hepatic Impairment:</span> {strDisplay(data.hepaticImpairment)}</p>
              <p><span className="font-medium">Allergy Status:</span> {strDisplay(data.allergyStatus)}</p>
              <p className="md:col-span-2"><span className="font-medium">Existing Medication:</span> {strDisplay(data.existingMedication)}</p>

              {/* Cold Sores specific */}
              {isColdSores && (
                <>
                  <p><span className="font-medium">Antimicrobial Resistance:</span> {strDisplay(data.antimicrobialResistance)}</p>
                  <p className="md:col-span-2"><span className="font-medium">Resistance Details:</span> {strDisplay(data.resistanceDetails)}</p>
                </>
              )}

              {/* Allergic Rhinitis specific */}
              {isAllergicRhinitis && (
                <>
                  <p><span className="font-medium">Resistance Aware:</span> {strDisplay(data.resistanceAware)}</p>
                  <p className="md:col-span-2"><span className="font-medium">Resistance Details:</span> {strDisplay(data.resistanceDetails)}</p>
                </>
              )}
            </div>
          </div>

          {/* 4. Red Flags and Referral Criteria */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">4. Red Flags and Referral Criteria</h3>
            <div className="space-y-3 text-sm text-slate-700">

              {/* Cold Sores red flags */}
              {isColdSores && (
                <>
                  <p><span className="font-medium">Emergency Referral:</span> {boolDisplay(data.redFlagEmergency)}</p>
                  <p><span className="font-medium">Urgent - Under 1 Month:</span> {boolDisplay(data.urgentUnderOneMonth)}</p>
                  <p><span className="font-medium">Urgent - Eye Involvement:</span> {boolDisplay(data.urgentEyeInvolvement)}</p>
                  <p><span className="font-medium">Urgent - Immunocompromised:</span> {boolDisplay(data.urgentImmunocompromised)}</p>
                  <p><span className="font-medium">Referral - Contraindications:</span> {boolDisplay(data.referralContraindications)}</p>
                  <p><span className="font-medium">Referral - Pregnancy:</span> {boolDisplay(data.referralPregnancy)}</p>
                  <p><span className="font-medium">Referral - Spreading Infection:</span> {boolDisplay(data.referralSpreadingInfection)}</p>
                  <p><span className="font-medium">Referral - Not Improving within 14 Days:</span> {boolDisplay(data.referralNotImproving14Days)}</p>
                  <p><span className="font-medium">Referral - Secondary Infection:</span> {boolDisplay(data.referralSecondaryInfection)}</p>
                  <p><span className="font-medium">Referral - Gingivostomatitis:</span> {boolDisplay(data.referralGingivostomatitis)}</p>
                  <p><span className="font-medium">Referral - Erythema Multiforme:</span> {boolDisplay(data.referralErythemaMultiforme)}</p>
                  <p><span className="font-medium">Referral - Hypersensitivity:</span> {boolDisplay(data.referralHypersensitivity)}</p>
                  <p><span className="font-medium">Limited Supply - Immunocompromised:</span> {boolDisplay(data.limitedSupplyImmunocompromised)}</p>
                  <p><span className="font-medium">Limited Supply - Recurrent Lesions:</span> {boolDisplay(data.limitedSupplyRecurrentLesions)}</p>
                  <p><span className="font-medium">Any Red Flag Present:</span> {strDisplay(data.redFlagPresent)}</p>
                  <p><span className="font-medium">Referral Reason:</span> {strDisplay(data.referralReason)}</p>
                </>
              )}

              {/* Allergic Rhinitis red flags */}
              {isAllergicRhinitis && (
                <>
                  <p><span className="font-medium">Emergency Flags:</span> {data.emergencyFlags?.length > 0 ? data.emergencyFlags.join(", ") : "-"}</p>
                  <p><span className="font-medium">Referral Flags:</span> {data.referralFlags?.length > 0 ? data.referralFlags.join(", ") : "-"}</p>
                  <p><span className="font-medium">Initial Limited Supply Flags:</span> {data.limitedSupplyFlags?.length > 0 ? data.limitedSupplyFlags.join(", ") : "-"}</p>
                  <p><span className="font-medium">Any Red Flags Present:</span> {strDisplay(data.hasRedFlags)}</p>
                  <p><span className="font-medium">Referral Reason:</span> {strDisplay(data.referralReason)}</p>
                </>
              )}
            </div>
          </div>

          {/* 5. Review of Symptoms */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">5. Review of Symptoms</h3>
            <div className="space-y-3 text-sm text-slate-700">

              {/* Cold Sores symptoms */}
              {isColdSores && (
                <>
                  <p><span className="font-medium">Prodromal Phase:</span> {boolDisplay(data.symptomProdromal, stepsSkippedColdSores)}</p>
                  <p><span className="font-medium">Fluid-filled Blisters:</span> {boolDisplay(data.symptomBlisters, stepsSkippedColdSores)}</p>
                  <p><span className="font-medium">Swollen / Tender Glands:</span> {boolDisplay(data.symptomTenderGlands, stepsSkippedColdSores)}</p>
                  <p><span className="font-medium">Gingivostomatitis Symptoms:</span> {boolDisplay(data.symptomGingivostomatitis, stepsSkippedColdSores)}</p>
                  <p><span className="font-medium">Child - Sore Gums:</span> {boolDisplay(data.childSoreGums, stepsSkippedColdSores)}</p>
                  <p><span className="font-medium">Child - Sore Throat:</span> {boolDisplay(data.childSoreThroat, stepsSkippedColdSores)}</p>
                  <p><span className="font-medium">Child - More Saliva:</span> {boolDisplay(data.childMoreSaliva, stepsSkippedColdSores)}</p>
                  <p><span className="font-medium">Child - High Temperature:</span> {boolDisplay(data.childHighTemperature, stepsSkippedColdSores)}</p>
                  <p><span className="font-medium">Child - Headaches:</span> {boolDisplay(data.childHeadaches, stepsSkippedColdSores)}</p>
                  <p><span className="font-medium">Child - Refusal to Drink Fluids:</span> {boolDisplay(data.childRefusalFluids, stepsSkippedColdSores)}</p>
                  <p><span className="font-medium">Symptoms Typical:</span> {stepsSkippedColdSores ? "-" : strDisplay(data.symptomsTypical)}</p>
                  <p><span className="font-medium">Symptoms Referral Reason:</span> {stepsSkippedColdSores ? "-" : strDisplay(data.symptomsReferralReason)}</p>
                </>
              )}

              {/* Allergic Rhinitis symptoms */}
              {isAllergicRhinitis && (
                <>
                  <p><span className="font-medium">Rhinorrhoea:</span> {boolDisplay(data.symptomRhinorrhoea, stepsSkippedRhinitis)}</p>
                  <p><span className="font-medium">Sneezing:</span> {boolDisplay(data.symptomSneezing, stepsSkippedRhinitis)}</p>
                  <p><span className="font-medium">Itchy Nose / Eyes / Palate:</span> {boolDisplay(data.symptomItchyNoseEyesPalate, stepsSkippedRhinitis)}</p>
                  <p><span className="font-medium">Nasal Congestion:</span> {boolDisplay(data.symptomNasalCongestion, stepsSkippedRhinitis)}</p>
                  <p><span className="font-medium">Irritability / Fatigue:</span> {boolDisplay(data.symptomIrritabilityFatigue, stepsSkippedRhinitis)}</p>
                  <p><span className="font-medium">Transverse Nasal Crease:</span> {boolDisplay(data.symptomTransverseNasalCrease, stepsSkippedRhinitis)}</p>
                  <p><span className="font-medium">Reduction of Smell:</span> {boolDisplay(data.symptomReductionOfSmell, stepsSkippedRhinitis)}</p>
                  <p><span className="font-medium">Rhinitis with Conjunctivitis:</span> {boolDisplay(data.symptomRhinitisWithConjunctivitis, stepsSkippedRhinitis)}</p>
                  <p><span className="font-medium">Red Eye:</span> {boolDisplay(data.symptomRedEye, stepsSkippedRhinitis)}</p>
                  <p><span className="font-medium">Eye Itching:</span> {boolDisplay(data.symptomEyeItching, stepsSkippedRhinitis)}</p>
                  <p><span className="font-medium">Pink Swelling Eyelid:</span> {boolDisplay(data.symptomPinkSwellingEyelid, stepsSkippedRhinitis)}</p>
                  <p><span className="font-medium">Watery / Stringy Discharge:</span> {boolDisplay(data.symptomWateryStringyDischarge, stepsSkippedRhinitis)}</p>
                  <p><span className="font-medium">Grittiness / Burning / Irritation:</span> {boolDisplay(data.symptomGrittinessBurningIrritation, stepsSkippedRhinitis)}</p>
                  <p><span className="font-medium">Crusting in Morning:</span> {boolDisplay(data.symptomCrustingMorning, stepsSkippedRhinitis)}</p>
                  <p><span className="font-medium">Accompanied by Rhinitis:</span> {boolDisplay(data.symptomAccompaniedByRhinitis, stepsSkippedRhinitis)}</p>
                  <p><span className="font-medium">Unilateral or Bilateral:</span> {boolDisplay(data.symptomUnilateralOrBilateral, stepsSkippedRhinitis)}</p>
                  <p><span className="font-medium">Symptoms Typical:</span> {stepsSkippedRhinitis ? "-" : strDisplay(data.symptomsTypical)}</p>
                  <p><span className="font-medium">Typical Condition Type:</span> {stepsSkippedRhinitis ? "-" : strDisplay(data.typicalConditionType)}</p>
                  <p><span className="font-medium">Symptoms Referral Reason:</span> {stepsSkippedRhinitis ? "-" : strDisplay(data.symptomsReferralReason)}</p>
                </>
              )}
            </div>
          </div>

          {/* 6. Treatment Options */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">6. Treatment Options</h3>
            <div className="space-y-3 text-sm text-slate-700">
              {isColdSores && (
                <>
                  <p><span className="font-medium">Meets Inclusion Criteria:</span> {boolDisplay(data.meetsInclusionCriteria, stepsSkippedColdSores)}</p>
                  <p><span className="font-medium">Proceed With Prescribing:</span> {boolDisplay(data.proceedWithPrescribing, stepsSkippedColdSores)}</p>
                  <p><span className="font-medium">Advice And Counselling:</span> {boolDisplay(data.adviceAndCounselling, stepsSkippedColdSores)}</p>
                </>
              )}
              {isAllergicRhinitis && (
                <>
                  <p><span className="font-medium">Meets Inclusion Criteria:</span> {boolDisplay(data.meetsInclusionCriteria, stepsSkippedRhinitis)}</p>
                  <p><span className="font-medium">Proceed With Prescribing:</span> {boolDisplay(data.proceedWithPrescribing, stepsSkippedRhinitis)}</p>
                  <p><span className="font-medium">Advice And Counselling:</span> {boolDisplay(data.adviceAndCounselling, stepsSkippedRhinitis)}</p>
                </>
              )}
            </div>
          </div>

          {/* 7. Patient Declaration */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">7. Patient Declaration</h3>
            <div className="space-y-3 text-sm text-slate-700">
              <p><span className="font-medium">Clinical Info Sharing Agreed:</span> {boolDisplay(data.declarationClinicalInfoSharing)}</p>
              <p><span className="font-medium">Dispensing Choice Statement Agreed:</span> {boolDisplay(data.declarationDispensingChoice)}</p>
              <p><span className="font-medium">Dispense To Another Pharmacy:</span> {boolDisplay(data.dispenseToAnotherPharmacy)}</p>
              <p><span className="font-medium">Dispense In This Pharmacy:</span> {boolDisplay(data.dispenseInThisPharmacy)}</p>
              <p><span className="font-medium">Consent Signature:</span> {strDisplay(data.consentSignature)}</p>
              <p><span className="font-medium">Consent Date:</span> {strDisplay(data.consentDate)}</p>
              {data.guardian && (
                <p><span className="font-medium">Guardian Consent Signature:</span> {strDisplay(data.guardianConsentSignature)}</p>
              )}
            </div>
          </div>

          {/* 8. Consultation Outcome */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">8. Consultation Outcome</h3>
            <div className="space-y-3 text-sm text-slate-700">

              {/* Cold Sores outcome */}
              {isColdSores && (
                <>
                  <p><span className="font-medium">Referral:</span> {boolDisplay(data.consultationOutcomeReferral)}</p>
                  <p><span className="font-medium">Self-care:</span> {boolDisplay(data.consultationOutcomeSelfCare)}</p>
                  <p><span className="font-medium">OTC Product Supplied:</span> {boolDisplay(data.consultationOutcomeOTCProduct)}</p>
                  <p><span className="font-medium">Prescription for POM Supplied:</span> {boolDisplay(data.consultationOutcomePOMSupplied)}</p>
                  <p><span className="font-medium">Declined Treatment:</span> {boolDisplay(data.declinedTreatment)}</p>
                  <p><span className="font-medium">Declined Treatment Reason:</span> {strDisplay(data.declinedTreatmentReason)}</p>
                  <p><span className="font-medium">Referred to A&E:</span> {boolDisplay(data.referredToAE)}</p>
                  <p><span className="font-medium">Referred to GP:</span> {boolDisplay(data.referredToGP)}</p>
                  <p><span className="font-medium">Referred to Other:</span> {boolDisplay(data.referredToOther)}</p>
                  <p><span className="font-medium">Other Referral Details:</span> {strDisplay(data.referredToOtherDetails)}</p>
                  <p><span className="font-medium">Prescribed Aciclovir 5% Cream:</span> {boolDisplay(data.prescribedAciclovirCream)}</p>
                </>
              )}

              {/* Allergic Rhinitis outcome */}
              {isAllergicRhinitis && (
                <>
                  <p><span className="font-medium">Referral:</span> {boolDisplay(data.outcomeReferral)}</p>
                  <p><span className="font-medium">Self-care:</span> {boolDisplay(data.outcomeSelfCare)}</p>
                  <p><span className="font-medium">OTC Product Supplied:</span> {boolDisplay(data.outcomeOTCSupplied)}</p>
                  <p><span className="font-medium">Prescription for POM Supplied:</span> {boolDisplay(data.outcomePOMSupplied)}</p>
                  <p><span className="font-medium">Patient Declined Treatment:</span> {boolDisplay(data.patientDeclinedTreatment)}</p>
                  <p><span className="font-medium">Declined Reason:</span> {strDisplay(data.declinedReason)}</p>
                  <p><span className="font-medium">Referred to A&E:</span> {boolDisplay(data.referredToAEDepartment)}</p>
                  <p><span className="font-medium">Referred to GP:</span> {boolDisplay(data.referredToGP)}</p>
                  <p><span className="font-medium">Referred to Other:</span> {boolDisplay(data.referredToOther)}</p>
                  <p><span className="font-medium">Other Referral Details:</span> {strDisplay(data.referredToOtherDetails)}</p>

                  <p className="mt-2 font-medium text-slate-900">Medicines Prescribed / Supplied:</p>
                  <p><span className="font-medium">INCS Second Gen:</span> {boolDisplay(data.med_INCS_SecondGen)}</p>
                  <p><span className="font-medium">Fluticasone Furoate:</span> {boolDisplay(data.med_FluticasoneFuroate)}</p>
                  <p><span className="font-medium">Fluticasone Propionate:</span> {boolDisplay(data.med_FluticasonePropionate)}</p>
                  <p><span className="font-medium">Mometasone:</span> {boolDisplay(data.med_Mometasone)}</p>
                  <p><span className="font-medium">INCS + INAH:</span> {boolDisplay(data.med_INCS_INAH)}</p>
                  <p><span className="font-medium">Azelastine / Fluticasone:</span> {boolDisplay(data.med_AzelastineFluticasone)}</p>
                  <p><span className="font-medium">Mometasone / Olopatadine:</span> {boolDisplay(data.med_MometasoneOlopatadine)}</p>
                  <p><span className="font-medium">INCS First Gen:</span> {boolDisplay(data.med_INCS_FirstGen)}</p>
                  <p><span className="font-medium">Beclometasone:</span> {boolDisplay(data.med_Beclometasone)}</p>
                  <p><span className="font-medium">Triamcinolone:</span> {boolDisplay(data.med_Triamcinolone)}</p>
                  <p><span className="font-medium">INAH:</span> {boolDisplay(data.med_INAH)}</p>
                  <p><span className="font-medium">Azelastine Hydrochloride:</span> {boolDisplay(data.med_AzelastineHydrochloride)}</p>
                  <p><span className="font-medium">Second Gen Antihistamines:</span> {boolDisplay(data.med_SecondGenAntihistamines)}</p>
                  <p><span className="font-medium">Cetirizine 10mg Tablets:</span> {boolDisplay(data.med_Cetirizine10mgTablets)}</p>
                  <p><span className="font-medium">Cetirizine Oral Solution:</span> {boolDisplay(data.med_Cetirizine1mgmlOral)}</p>
                  <p><span className="font-medium">Loratadine 10mg Tablets:</span> {boolDisplay(data.med_Loratadine10mgTablets)}</p>
                  <p><span className="font-medium">Bilastine 10mg ODT:</span> {boolDisplay(data.med_Bilastine10mgODT)}</p>
                  <p><span className="font-medium">Bilastine 20mg Tablets:</span> {boolDisplay(data.med_Bilastine20mgTablets)}</p>
                  <p><span className="font-medium">Bilastine Oral Solution:</span> {boolDisplay(data.med_Bilastine25mgmlOral)}</p>
                  <p><span className="font-medium">Third Gen Antihistamines:</span> {boolDisplay(data.med_ThirdGenAntihistamines)}</p>
                  <p><span className="font-medium">Desloratadine 5mg Tablets:</span> {boolDisplay(data.med_Desloratadine5mgTablets)}</p>
                  <p><span className="font-medium">Desloratadine Oral Solution:</span> {boolDisplay(data.med_Desloratadine05mgmlOral)}</p>
                  <p><span className="font-medium">Fexofenadine 120mg:</span> {boolDisplay(data.med_Fexofenadine120mg)}</p>
                  <p><span className="font-medium">Levocetirizine 5mg Tablets:</span> {boolDisplay(data.med_Levocetirizine5mgTablets)}</p>
                  <p><span className="font-medium">Levocetirizine Oral Solution:</span> {boolDisplay(data.med_Levocetirizine05mgmlOral)}</p>
                  <p><span className="font-medium">IOC:</span> {boolDisplay(data.med_IOC)}</p>
                  <p><span className="font-medium">Sodium Cromoglicate:</span> {boolDisplay(data.med_SodiumCromoglicate)}</p>
                  <p><span className="font-medium">IOAH:</span> {boolDisplay(data.med_IOAH)}</p>
                  <p><span className="font-medium">Ketotifen:</span> {boolDisplay(data.med_Ketotifen)}</p>
                  <p><span className="font-medium">Olopatadine Eye Drops:</span> {boolDisplay(data.med_OlopatadineEyeDrops)}</p>
                </>
              )}
            </div>
          </div>

          {/* 9. Pharmacist Information */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">9. Pharmacist Information</h3>
            <div className="grid grid-cols-1 gap-3 text-sm text-slate-700 md:grid-cols-2">
              <p><span className="font-medium">Pharmacist Name:</span> {strDisplay(data.pharmacistName)}</p>
              <p><span className="font-medium">PSI Number:</span> {strDisplay(data.psiNumber)}</p>
              <p><span className="font-medium">Pharmacy Address:</span> {strDisplay(data.pharmacyAddress)}</p>
              <p><span className="font-medium">Pharmacy Eircode:</span> {strDisplay(data.pharmacyEircode)}</p>
              <p><span className="font-medium">Pharmacist Signature:</span> {strDisplay(data.pharmacistSignature)}</p>
              <p><span className="font-medium">Pharmacist Date:</span> {strDisplay(data.pharmacistDate)}</p>
            </div>
          </div>

        </div>

        {/* Bottom actions */}
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Print
          </button>
          <Link
            href={getEditLink()}
            className="rounded-lg bg-amber-500 px-6 py-3 font-medium text-white transition hover:bg-amber-600"
          >
            Edit Consultation
          </Link>
        </div>
      </div>
    </main>
  );
}