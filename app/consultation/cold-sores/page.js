"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function ColdSoresConsultation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEditMode = searchParams.get("mode") === "edit";

  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    patientName: "",
    address: "",
    eircode: "",
    ppsn: "",
    contact: "",
    schemeNumber: "",
    schemeType: "",
    guardian: "",
    dob: "",
    sex: "",
    otherSex: "", 
    gpName: "",
    gpAddress: "",
    gpContact: "",

    symptoms: "",
    medicationTried: "",
    medicationList: "",

    medicalConditions: "",
    pregnant: false,
    breastfeeding: false,
    renalImpairment: "",
    hepaticImpairment: "",
    allergyStatus: "",
    existingMedication: "",
    antimicrobialResistance: "",
    resistanceDetails: "",

    redFlagEmergency: false,
    urgentUnderOneMonth: false,
    urgentEyeInvolvement: false,
    urgentImmunocompromised: false,
    referralContraindications: false,
    referralPregnancy: false,
    referralSpreadingInfection: false,
    referralNotImproving14Days: false,
    referralSecondaryInfection: false,
    referralGingivostomatitis: false,
    referralErythemaMultiforme: false,
    referralHypersensitivity: false,
    limitedSupplyImmunocompromised: false,
    limitedSupplyRecurrentLesions: false,
    redFlagPresent: "",
    referralReason: "",

    symptomProdromal: false,
    symptomBlisters: false,
    symptomTenderGlands: false,
    symptomGingivostomatitis: false,
    childSoreGums: false,
    childSoreThroat: false,
    childMoreSaliva: false,
    childHighTemperature: false,
    childHeadaches: false,
    childRefusalFluids: false,
    symptomsTypical: "",
    symptomsReferralReason: "",

    meetsInclusionCriteria: false,
    proceedWithPrescribing: false,
    adviceAndCounselling: false,

    declarationClinicalInfoSharing: false,
    declarationDispensingChoice: false,
    dispenseToAnotherPharmacy: false,
    dispenseInThisPharmacy: false,
    consentSignature: "",
    guardianConsentSignature: "",
    consentDate: today,

    consultationOutcomeReferral: false,
    consultationOutcomeSelfCare: false,
    consultationOutcomeOTCProduct: false,
    consultationOutcomePOMSupplied: false,

    declinedTreatment: false,
    declinedTreatmentReason: "",

    referredToAE: false,
    referredToGP: false,
    referredToOther: false,
    referredToOtherDetails: "",

    prescribedAciclovirCream: false,

    pharmacistName: "",
    psiNumber: "",
    pharmacyAddress: "",
    pharmacyEircode: "",
    pharmacistSignature: "",
    pharmacistDate: today,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("rxflowUser");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(JSON.parse(storedUser));

    // ── Edit mode: load existing consultation data ──
    if (isEditMode && editId) {
      const stored = JSON.parse(localStorage.getItem("rxflowConsultations")) || [];
      const existing = stored.find((c) => String(c.id) === String(editId));
      if (existing?.data) {
        setFormData(existing.data);
      }
    }
  }, [router, isEditMode, editId]);

  const age = useMemo(() => {
    if (!formData.dob) return "";
    const dobDate = new Date(formData.dob);
    const today = new Date();
    let years = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      years--;
    }
    return years >= 0 ? years.toString() : "";
  }, [formData.dob]);

  const isUnder16 = age !== "" && Number(age) < 16;
  const stepsSkipped = formData.redFlagPresent === "Yes";

  if (!user) return null;

  // ── Display helpers ───────────────────────────────────────────────────────────

  const boolDisplay = (value, skipped = false) => {
    if (skipped) return "-";
    return value ? "Yes" : "-";
  };

  const strDisplay = (value) => value || "-";

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      if (name === "sex" && value === "Male") {
        updated.pregnant = false;
        updated.breastfeeding = false;
      }
      return updated;
    });
  };

  const getInputClass = (fieldName) =>
    `w-full rounded-lg border px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition ${errors[fieldName]
      ? "border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-slate-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
    }`;

  // ── Validators ───────────────────────────────────────────────────────────────

  const validateStepOne = () => {
    const e = {};
    if (!formData.patientName.trim()) e.patientName = "Required";
    if (!formData.address.trim()) e.address = "Required";
    if (!formData.eircode.trim()) e.eircode = "Required";
    if (!formData.ppsn.trim()) e.ppsn = "Required";
    if (!formData.contact.trim()) e.contact = "Required";
    if (!formData.schemeNumber.trim()) e.schemeNumber = "Required";
    if (!formData.schemeType.trim()) e.schemeType = "Required";
    if (!formData.dob) e.dob = "Required";
    if (!formData.sex.trim()) e.sex = "Required";
    if (isUnder16 && !formData.guardian.trim()) e.guardian = "Required for patients under 16";
    return e;
  };

  const validateStepTwo = () => {
    const e = {};
    if (!formData.symptoms.trim()) e.symptoms = "Required";
    if (!formData.medicationTried.trim()) e.medicationTried = "Please select Yes or No";
    if (formData.medicationTried === "Yes" && !formData.medicationList.trim())
      e.medicationList = "Please list medication already tried";
    return e;
  };

  const validateStepThree = () => {
    const e = {};
    if (!formData.medicalConditions.trim()) e.medicalConditions = "Required";
    if (!formData.renalImpairment.trim()) e.renalImpairment = "Please select Yes or No";
    if (!formData.hepaticImpairment.trim()) e.hepaticImpairment = "Please select Yes or No";
    if (!formData.allergyStatus.trim()) e.allergyStatus = "Required";
    if (!formData.existingMedication.trim()) e.existingMedication = "Required";
    if (!formData.antimicrobialResistance.trim()) e.antimicrobialResistance = "Please select Yes or No";
    if (formData.antimicrobialResistance === "Yes" && !formData.resistanceDetails.trim())
      e.resistanceDetails = "Please list resistance details";
    return e;
  };

  const validateStepFour = () => {
    const e = {};
    if (!formData.redFlagPresent.trim()) e.redFlagPresent = "Please select Yes or No";
    if (formData.redFlagPresent === "Yes" && !formData.referralReason.trim())
      e.referralReason = "Please document the reason for referral";
    return e;
  };

  const validateStepFive = () => {
    const e = {};
    if (!formData.symptomsTypical.trim()) e.symptomsTypical = "Please select Yes or No";
    if (formData.symptomsTypical === "No" && !formData.symptomsReferralReason.trim())
      e.symptomsReferralReason = "Please document the reason for referral";
    return e;
  };

  const validateStepSix = () => {
    const e = {};
    if (!formData.meetsInclusionCriteria) e.meetsInclusionCriteria = "Please confirm inclusion criteria";
    if (!formData.proceedWithPrescribing) e.proceedWithPrescribing = "Please confirm prescribing suitability";
    if (!formData.adviceAndCounselling) e.adviceAndCounselling = "Please confirm advice and counselling";
    return e;
  };

  const validateStepSeven = () => {
    const e = {};
    if (!formData.declarationClinicalInfoSharing)
      e.declarationClinicalInfoSharing = "Please confirm clinical information sharing";
    if (!formData.declarationDispensingChoice)
      e.declarationDispensingChoice = "Please confirm dispensing choice statement";
    if (!formData.dispenseToAnotherPharmacy && !formData.dispenseInThisPharmacy)
      e.dispensingOption = "Please choose one dispensing option";
    if (formData.dispenseToAnotherPharmacy && formData.dispenseInThisPharmacy)
      e.dispensingOption = "Please choose only one dispensing option";
    if (!formData.consentSignature.trim()) e.consentSignature = "Signature is required";
    if (isUnder16 && !formData.guardianConsentSignature.trim())
      e.guardianConsentSignature = "Parent/guardian signature is required";
    if (!formData.consentDate) e.consentDate = "Date is required";
    return e;
  };

  const validateStepEight = () => {
    const e = {};
    if (
      !formData.consultationOutcomeReferral &&
      !formData.consultationOutcomeSelfCare &&
      !formData.consultationOutcomeOTCProduct &&
      !formData.consultationOutcomePOMSupplied
    ) {
      e.consultationOutcome = "Please select at least one consultation outcome";
    }
    if (formData.declinedTreatment && !formData.declinedTreatmentReason.trim())
      e.declinedTreatmentReason = "Please provide a reason";
    if (formData.consultationOutcomeReferral) {
      if (!formData.referredToAE && !formData.referredToGP && !formData.referredToOther)
        e.referredTo = "Please select where the patient was referred to";
      if (formData.referredToOther && !formData.referredToOtherDetails.trim())
        e.referredToOtherDetails = "Please specify other referral destination";
    }
    if (formData.consultationOutcomePOMSupplied && !formData.prescribedAciclovirCream)
      e.prescribedAciclovirCream = "Please select the prescribed medicine";
    return e;
  };

  const validateStepNine = () => {
    const e = {};
    if (!formData.pharmacistName.trim()) e.pharmacistName = "Pharmacist name is required";
    if (!formData.psiNumber.trim()) e.psiNumber = "PSI number is required";
    if (!formData.pharmacyAddress.trim()) e.pharmacyAddress = "Pharmacy address is required";
    if (!formData.pharmacyEircode.trim()) e.pharmacyEircode = "Eircode is required";
    if (!formData.pharmacistSignature.trim()) e.pharmacistSignature = "Signature is required";
    if (!formData.pharmacistDate) e.pharmacistDate = "Date is required";
    return e;
  };

  // ── Navigation ────────────────────────────────────────────────────────────────

  const nextStep = () => {
    const validators = {
      1: validateStepOne,
      2: validateStepTwo,
      3: validateStepThree,
      4: validateStepFour,
      5: validateStepFive,
      6: validateStepSix,
      7: validateStepSeven,
      8: validateStepEight,
      9: validateStepNine,
    };

    const newErrors = validators[step] ? validators[step]() : {};
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (step === 4 && formData.redFlagPresent === "Yes") {
      setStep(7);
      return;
    }

    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (step === 7 && formData.redFlagPresent === "Yes") {
      setStep(4);
      return;
    }
    setStep((prev) => prev - 1);
  };

  // ── Save ──────────────────────────────────────────────────────────────────────

  const handleSaveAndFinish = () => {
    const existing = JSON.parse(localStorage.getItem("rxflowConsultations")) || [];

    let updated;

    if (isEditMode && editId) {
      // Overwrite the existing record, preserve original createdAt
      updated = existing.map((c) =>
        String(c.id) === String(editId)
          ? {
            ...c,
            patientName: formData.patientName,
            pharmacistName: formData.pharmacistName,
            data: formData,
          }
          : c
      );
    } else {
      // Create a new record
      updated = [
        ...existing,
        {
          id: Date.now(),
          type: "Cold Sores Consultation",
          createdAt: new Date().toISOString(),
          patientName: formData.patientName,
          pharmacistName: formData.pharmacistName,
          data: formData,
        },
      ];
    }

    localStorage.setItem("rxflowConsultations", JSON.stringify(updated));
    router.push("/recent-consultations");
  };

  const handlePrintConsultation = () => window.print();

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar user={user} />

      <div className="mx-auto max-w-6xl px-6 pt-6 md:px-10">
        <Link
          href={isEditMode ? "/recent-consultations" : "/consultation"}
          className="inline-flex items-center gap-2 text-slate-600 font-medium transition hover:-translate-x-1 hover:text-sky-700"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">
            {isEditMode ? "Back to Recent Consultations" : "Back to Consultation Types"}
          </span>
        </Link>
      </div>

      <div className="mx-auto max-w-6xl p-6 md:p-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <h1 className="text-4xl font-bold text-slate-900">Cold Sores Consultation</h1>
          {isEditMode && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700 border border-amber-200">
              Editing
            </span>
          )}
        </div>

        {/* Step indicators */}
        <div className="mb-8 flex flex-wrap gap-4 text-sm">
          {[
            "1 Personal Details",
            "2 Presenting Complaint",
            "3 Medical History",
            "4 Red Flags",
            "5 Review of Symptoms",
            "6 Treatment Options",
            "7 Patient Declaration",
            "8 Consultation Outcome",
            "9 Pharmacist Record",
            "10 Overview",
          ].map((label, i) => (
            <div
              key={label}
              className={step >= i + 1 ? "font-semibold text-sky-700" : "text-slate-400"}
            >
              {label}
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm">

          {/* ── Step 1: Personal Details ── */}
          {step === 1 && (
            <div>
              <h2 className="mb-6 text-2xl font-semibold text-slate-900">Personal Details</h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <input name="patientName" placeholder="Patient Name" value={formData.patientName} onChange={handleChange} className={getInputClass("patientName")} />
                  {errors.patientName && <p className="mt-1 text-sm text-red-500">{errors.patientName}</p>}
                </div>

                <div>
                  <input name="contact" placeholder="Contact Number" value={formData.contact} onChange={handleChange} className={getInputClass("contact")} />
                  {errors.contact && <p className="mt-1 text-sm text-red-500">{errors.contact}</p>}
                </div>

                <div className="md:col-span-2">
                  <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} className={getInputClass("address")} />
                  {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                </div>

                <div>
                  <input name="eircode" placeholder="Eircode" value={formData.eircode} onChange={handleChange} className={getInputClass("eircode")} />
                  {errors.eircode && <p className="mt-1 text-sm text-red-500">{errors.eircode}</p>}
                </div>

                <div>
                  <input name="ppsn" placeholder="PPSN" value={formData.ppsn} onChange={handleChange} className={getInputClass("ppsn")} />
                  {errors.ppsn && <p className="mt-1 text-sm text-red-500">{errors.ppsn}</p>}
                </div>

                <div>
                  <input name="schemeNumber" placeholder="Scheme Number" value={formData.schemeNumber} onChange={handleChange} className={getInputClass("schemeNumber")} />
                  {errors.schemeNumber && <p className="mt-1 text-sm text-red-500">{errors.schemeNumber}</p>}
                </div>

                <div>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} className={getInputClass("dob")} />
                  {errors.dob && <p className="mt-1 text-sm text-red-500">{errors.dob}</p>}
                </div>

                <div>
                  <input value={age} readOnly placeholder="Age" className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none" />
                </div>

                <div className="md:col-span-2">
                  <p className="mb-2 text-sm font-medium text-slate-700">Scheme Type</p>
                  <div className="flex flex-wrap gap-4">
                    {["GMS", "DPS", "GP Visit", "Private"].map((scheme) => (
                      <label key={scheme} className="flex items-center gap-2 text-sm text-slate-700">
                        <input type="radio" name="schemeType" value={scheme} checked={formData.schemeType === scheme} onChange={handleChange} />
                        {scheme}
                      </label>
                    ))}
                  </div>
                  {errors.schemeType && <p className="mt-1 text-sm text-red-500">{errors.schemeType}</p>}
                </div>

                <div className="md:col-span-2">
                  <p className="mb-2 text-sm font-medium text-slate-700">Sex</p>

                  <div className="flex flex-wrap items-center gap-6">

                    {["Male", "Female"].map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="radio"
                          name="sex"
                          value={option}
                          checked={formData.sex === option}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              sex: e.target.value,
                              otherSex: ""
                            }))
                          }
                        />
                        {option}
                      </label>
                    ))}

                    {/* Other with input */}
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="radio"
                        name="sex"
                        value="Other"
                        checked={formData.sex === "Other"}
                        onChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            sex: "Other"
                          }))
                        }
                      />
                      Other:
                      <input
                        type="text"
                        placeholder="Please specify"
                        value={formData.otherSex}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            otherSex: e.target.value
                          }))
                        }
                        disabled={formData.sex !== "Other"}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-900 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-100"
                      />
                    </label>

                  </div>

                  {errors.sex && <p className="mt-1 text-sm text-red-500">{errors.sex}</p>}
                </div>

                {isUnder16 && (
                  <div className="md:col-span-2">
                    <input name="guardian" placeholder="Parent/Guardian Name (if patient under 16 years)" value={formData.guardian} onChange={handleChange} className={getInputClass("guardian")} />
                    {errors.guardian && <p className="mt-1 text-sm text-red-500">{errors.guardian}</p>}
                  </div>
                )}

                <div>
                  <input name="gpName" placeholder="GP Name (Optional)" value={formData.gpName} onChange={handleChange} className={getInputClass("gpName")} />
                </div>

                <div>
                  <input name="gpContact" placeholder="GP Contact Number (Optional)" value={formData.gpContact} onChange={handleChange} className={getInputClass("gpContact")} />
                </div>

                <div className="md:col-span-2">
                  <input name="gpAddress" placeholder="GP Address (Optional)" value={formData.gpAddress} onChange={handleChange} className={getInputClass("gpAddress")} />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button type="button" onClick={nextStep} className="rounded-lg bg-sky-700 px-6 py-3 font-medium text-white transition hover:bg-sky-800">
                  Next
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Presenting Complaint ── */}
          {step === 2 && (
            <div>
              <h2 className="mb-6 text-2xl font-semibold text-slate-900">Presenting Complaint</h2>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Document the symptoms of the presenting complaint as described by the patient
                  </label>
                  <textarea name="symptoms" placeholder="Enter symptoms" value={formData.symptoms} onChange={handleChange} className={getInputClass("symptoms") + " h-32"} />
                  {errors.symptoms && <p className="mt-1 text-sm text-red-500">{errors.symptoms}</p>}
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700">
                    Any medication already tried for the management of cold sores symptoms?
                  </p>
                  <div className="flex gap-6">
                    {["Yes", "No"].map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm text-slate-700">
                        <input type="radio" name="medicationTried" value={option} checked={formData.medicationTried === option} onChange={handleChange} />
                        {option}
                      </label>
                    ))}
                  </div>
                  {errors.medicationTried && <p className="mt-1 text-sm text-red-500">{errors.medicationTried}</p>}
                </div>

                {formData.medicationTried === "Yes" && (
                  <div>
                    <textarea name="medicationList" placeholder="If yes, please list" value={formData.medicationList} onChange={handleChange} className={getInputClass("medicationList")} />
                    {errors.medicationList && <p className="mt-1 text-sm text-red-500">{errors.medicationList}</p>}
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-between">
                <button type="button" onClick={prevStep} className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50">Back</button>
                <button type="button" onClick={nextStep} className="rounded-lg bg-sky-700 px-6 py-3 font-medium text-white transition hover:bg-sky-800">Next Step</button>
              </div>
            </div>
          )}

          {/* ── Step 3: Medical History ── */}
          {step === 3 && (
            <div>
              <h2 className="mb-6 text-2xl font-semibold text-slate-900">Medical History</h2>

              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Existing Health Conditions</label>
                  <textarea name="medicalConditions" placeholder="List existing health conditions" value={formData.medicalConditions} onChange={handleChange} className={getInputClass("medicalConditions") + " h-28"} />
                  {errors.medicalConditions && <p className="mt-1 text-sm text-red-500">{errors.medicalConditions}</p>}
                </div>

                {formData.sex === "Female" && (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                      <input type="checkbox" name="pregnant" checked={formData.pregnant} onChange={handleChange} />
                      Pregnant or suspected pregnancy
                    </label>
                    <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                      <input type="checkbox" name="breastfeeding" checked={formData.breastfeeding} onChange={handleChange} />
                      Breastfeeding
                    </label>
                  </div>
                )}

                {formData.pregnant && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                    Refer patient to GP or other relevant medical practitioner.
                  </div>
                )}

                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700">Any known renal (kidney) impairment?</p>
                  <div className="flex gap-6">
                    {["Yes", "No"].map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm text-slate-700">
                        <input type="radio" name="renalImpairment" value={option} checked={formData.renalImpairment === option} onChange={handleChange} />
                        {option}
                      </label>
                    ))}
                  </div>
                  {errors.renalImpairment && <p className="mt-1 text-sm text-red-500">{errors.renalImpairment}</p>}
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700">Any known hepatic (liver) impairment?</p>
                  <div className="flex gap-6">
                    {["Yes", "No"].map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm text-slate-700">
                        <input type="radio" name="hepaticImpairment" value={option} checked={formData.hepaticImpairment === option} onChange={handleChange} />
                        {option}
                      </label>
                    ))}
                  </div>
                  {errors.hepaticImpairment && <p className="mt-1 text-sm text-red-500">{errors.hepaticImpairment}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Allergy Status</label>
                  <input name="allergyStatus" placeholder="Enter allergy status" value={formData.allergyStatus} onChange={handleChange} className={getInputClass("allergyStatus")} />
                  {errors.allergyStatus && <p className="mt-1 text-sm text-red-500">{errors.allergyStatus}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Existing Medication</label>
                  <textarea name="existingMedication" placeholder="List existing medication" value={formData.existingMedication} onChange={handleChange} className={getInputClass("existingMedication") + " h-28"} />
                  {errors.existingMedication && <p className="mt-1 text-sm text-red-500">{errors.existingMedication}</p>}
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700">
                    Is patient aware if they have resistance to previous antimicrobial treatment?
                  </p>
                  <div className="flex gap-6">
                    {["Yes", "No"].map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm text-slate-700">
                        <input type="radio" name="antimicrobialResistance" value={option} checked={formData.antimicrobialResistance === option} onChange={handleChange} />
                        {option}
                      </label>
                    ))}
                  </div>
                  {errors.antimicrobialResistance && <p className="mt-1 text-sm text-red-500">{errors.antimicrobialResistance}</p>}
                </div>

                {formData.antimicrobialResistance === "Yes" && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">If yes, please list</label>
                    <textarea name="resistanceDetails" placeholder="Enter resistance details" value={formData.resistanceDetails} onChange={handleChange} className={getInputClass("resistanceDetails") + " h-24"} />
                    {errors.resistanceDetails && <p className="mt-1 text-sm text-red-500">{errors.resistanceDetails}</p>}
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-between">
                <button type="button" onClick={prevStep} className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50">Back</button>
                <button type="button" onClick={nextStep} className="rounded-lg bg-sky-700 px-6 py-3 font-medium text-white transition hover:bg-sky-800">Next Step</button>
              </div>
            </div>
          )}

          {/* ── Step 4: Red Flags ── */}
          {step === 4 && (
            <div>
              <h2 className="mb-6 text-2xl font-semibold text-slate-900">Red Flag and Referral Criteria</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-red-700">
                    4.1 Criteria requiring EMERGENCY referral to hospital emergency department/contacting emergency services, as per 2.4.1 of Protocol.
                  </h3>
                  <label className="flex items-start gap-3 text-sm text-slate-700">
                    <input type="checkbox" name="redFlagEmergency" checked={formData.redFlagEmergency} onChange={handleChange} className="mt-1" />
                    <span>Individual is systemically very unwell, or showing symptoms of severe/life-threatening infection, or systemic sepsis. Refer urgently to Emergency Department via ambulance.</span>
                  </label>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-amber-700">
                    4.2 Criteria requiring Urgent Medical Assessment (treating service/GP/GP out of hours/hospital emergency department), as per 2.4.2 of Protocol. If ANY of the following are present, then urgent medical assessment is required.
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: "urgentUnderOneMonth", label: "Individuals under 1 month of age" },
                      { name: "urgentEyeInvolvement", label: "Lesions involving the eye" },
                      { name: "urgentImmunocompromised", label: "Individual has moderate to severe immunocompromise due to underlying medical conditions or treatments" },
                    ].map(({ name, label }) => (
                      <label key={name} className="flex items-start gap-3 text-sm text-slate-700">
                        <input type="checkbox" name={name} checked={formData[name]} onChange={handleChange} className="mt-1" />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-sky-700">
                    4.3 Criteria requiring referral to GP or other relevant medical practitioner, but pharmacist permitted to give INITIAL LIMITED SUPPLY, as per 2.4.3 of protocol. If ANY of the following are present then referral is required and pharmacist prescribing is not permitted.
                  </h3>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {[
                      { name: "referralContraindications", label: "Contraindications as specified in the medication Summary of Product Characteristics" },
                      { name: "referralPregnancy", label: "Pregnancy or suspected pregnancy" },
                      { name: "referralSpreadingInfection", label: "Signs of infection spreading" },
                      { name: "referralNotImproving14Days", label: "Symptoms not improving within 14 days, with or without treatment" },
                      { name: "referralSecondaryInfection", label: "Signs of secondary infection, e.g. very painful or very swollen" },
                      { name: "referralGingivostomatitis", label: "Suspected gingivostomatitis" },
                      { name: "referralErythemaMultiforme", label: "Suspected erythema multiforme" },
                      { name: "referralHypersensitivity", label: "Known hypersensitivity or adverse reaction to medication treatment options or components" },
                    ].map(({ name, label }) => (
                      <label key={name} className="flex items-start gap-3 text-sm text-slate-700">
                        <input type="checkbox" name={name} checked={formData[name]} onChange={handleChange} className="mt-1" />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-emerald-900">
                    4.4 Criteria requiring referral to GP or other relevant medical practitioner, but pharmacist permitted to give INITIAL LIMITED SUPPLY, as per 2.4.4 of Protocol.
                  </h3>
                  <h3 className="mb-3 text-lg font-semibold text-slate-900">
                    Pharmacists can consider prescribing an initial limited supply of treatment if clinically appropriate to mitigate the risk of delay in access to treatment. Treatment should be limited to the dose or time necessary for an individual to access the referral pathway.
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: "limitedSupplyImmunocompromised", label: "Individual is immunocompromised due to underlying medical conditions or treatments" },
                      { name: "limitedSupplyRecurrentLesions", label: "Recurrent problematic lesions or frequently recurrent infection" },
                    ].map(({ name, label }) => (
                      <label key={name} className="flex items-start gap-3 text-sm text-slate-700">
                        <input type="checkbox" name={name} checked={formData[name]} onChange={handleChange} className="mt-1" />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700">Are there any Red Flag or Referral Criteria present?</p>
                  <div className="flex gap-6">
                    {["Yes", "No"].map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm text-slate-700">
                        <input type="radio" name="redFlagPresent" value={option} checked={formData.redFlagPresent === option} onChange={handleChange} />
                        {option}
                      </label>
                    ))}
                  </div>
                  {errors.redFlagPresent && <p className="mt-1 text-sm text-red-500">{errors.redFlagPresent}</p>}
                </div>

                {formData.redFlagPresent === "Yes" && (
                  <>
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800">
                      Red flag or referral criteria present. Refer patient and document the reason below.
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Reason for referral</label>
                      <textarea name="referralReason" placeholder="Document reason for referral" value={formData.referralReason} onChange={handleChange} className={getInputClass("referralReason") + " h-24"} />
                      {errors.referralReason && <p className="mt-1 text-sm text-red-500">{errors.referralReason}</p>}
                    </div>
                  </>
                )}
              </div>

              <div className="mt-8 flex justify-between">
                <button type="button" onClick={prevStep} className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50">Back</button>
                <button type="button" onClick={nextStep} className="rounded-lg bg-sky-700 px-6 py-3 font-medium text-white transition hover:bg-sky-800">Next Step</button>
              </div>
            </div>
          )}

          {/* ── Step 5: Review of Symptoms ── */}
          {step === 5 && (
            <div>
              <h2 className="mb-6 text-2xl font-semibold text-slate-900">Review of Symptoms</h2>

              <div className="space-y-8">
                <div>
                  <p className="mb-4 text-sm font-medium text-slate-700">
                    Listed below are the signs and symptoms that are typical of cold sores, tick all that apply:
                  </p>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {[
                      { name: "symptomProdromal", label: "Prodromal phase - tingling, itching or burning feeling on lip" },
                      { name: "symptomBlisters", label: "Fluid-filled blisters may appear, weep and crust over into a scab" },
                      { name: "symptomTenderGlands", label: "Swollen and tender glands" },
                      { name: "symptomGingivostomatitis", label: "Clusters of blisters or sores may develop inside the mouth – known as Gingivostomatitis" },
                    ].map(({ name, label }) => (
                      <label key={name} className="flex items-start gap-3 text-sm text-slate-700">
                        <input type="checkbox" name={name} checked={formData[name]} onChange={handleChange} className="mt-1" />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-4 text-sm font-medium text-slate-700">Other symptoms in children may include:</p>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {[
                      { name: "childSoreGums", label: "Sore gums" },
                      { name: "childSoreThroat", label: "Sore throat and swollen glands" },
                      { name: "childMoreSaliva", label: "More saliva than normal" },
                      { name: "childHighTemperature", label: "High temperature" },
                      { name: "childHeadaches", label: "Headaches" },
                      { name: "childRefusalFluids", label: "Refusal to drink fluids" },
                    ].map(({ name, label }) => (
                      <label key={name} className="flex items-start gap-3 text-sm text-slate-700">
                        <input type="checkbox" name={name} checked={formData[name]} onChange={handleChange} className="mt-1" />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700">Are symptoms typical of cold sores?</p>
                  <div className="flex gap-6">
                    {["Yes", "No"].map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm text-slate-700">
                        <input type="radio" name="symptomsTypical" value={option} checked={formData.symptomsTypical === option} onChange={handleChange} />
                        {option}
                      </label>
                    ))}
                  </div>
                  {errors.symptomsTypical && <p className="mt-1 text-sm text-red-500">{errors.symptomsTypical}</p>}
                </div>

                {formData.symptomsTypical === "No" && (
                  <>
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800">
                      Symptoms are not typical of cold sores. Refer patient and document the reason below.
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Reason for referral</label>
                      <textarea name="symptomsReferralReason" placeholder="Document reason for referral" value={formData.symptomsReferralReason} onChange={handleChange} className={getInputClass("symptomsReferralReason") + " h-24"} />
                      {errors.symptomsReferralReason && <p className="mt-1 text-sm text-red-500">{errors.symptomsReferralReason}</p>}
                    </div>
                  </>
                )}
              </div>

              <div className="mt-8 flex justify-between">
                <button type="button" onClick={prevStep} className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50">Back</button>
                <button type="button" onClick={nextStep} className="rounded-lg bg-sky-700 px-6 py-3 font-medium text-white transition hover:bg-sky-800">Next Step</button>
              </div>
            </div>
          )}

          {/* ── Step 6: Treatment Options ── */}
          {step === 6 && (
            <div>
              <h2 className="mb-6 text-2xl font-semibold text-slate-900">Treatment Options</h2>

              <div className="space-y-5">
                {[
                  { name: "meetsInclusionCriteria", label: "Individual meets the inclusion criteria as per protocol.", error: errors.meetsInclusionCriteria },
                  { name: "proceedWithPrescribing", label: "Appropriate to proceed with pharmacist prescribing and refer to protocol for prescribing information.", error: errors.proceedWithPrescribing },
                  { name: "adviceAndCounselling", label: "Give advice and counselling as per protocol.", error: errors.adviceAndCounselling },
                ].map(({ name, label, error }) => (
                  <div key={name}>
                    <label className="flex items-start gap-3 text-sm text-slate-700">
                      <input type="checkbox" name={name} checked={formData[name]} onChange={handleChange} className="mt-1" />
                      <span>{label}</span>
                    </label>
                    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-between">
                <button type="button" onClick={prevStep} className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50">Back</button>
                <button type="button" onClick={nextStep} className="rounded-lg bg-sky-700 px-6 py-3 font-medium text-white transition hover:bg-sky-800">Next Step</button>
              </div>
            </div>
          )}

          {/* ── Step 7: Patient Declaration ── */}
          {step === 7 && (
            <div>
              <h2 className="mb-6 text-2xl font-semibold text-slate-900">Patient Declaration</h2>

              <div className="space-y-6">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• I understand the nature of the condition, how the treatment works, the benefits and risks of the treatment.</li>
                    <li>• I have been given the opportunity to speak to the pharmacist providing the consultation and to ask questions.</li>
                    <li>• I have been given information on what steps to take if my symptoms get worse or persist for longer than 14 days.</li>
                    <li>• The information and details I have provided are accurate and will be recorded by the pharmacy as required.</li>
                    <li>• I understand that any data collected will be processed in accordance with relevant data protection requirements.</li>
                  </ul>
                </div>

                <div>
                  <label className="flex items-start gap-3 text-sm text-slate-700">
                    <input type="checkbox" name="declarationClinicalInfoSharing" checked={formData.declarationClinicalInfoSharing} onChange={handleChange} className="mt-1" />
                    <span>I agree to the sharing of relevant clinical information with another healthcare professional if deemed necessary by the pharmacist.</span>
                  </label>
                  {errors.declarationClinicalInfoSharing && <p className="mt-1 text-sm text-red-500">{errors.declarationClinicalInfoSharing}</p>}
                </div>

                <div>
                  <label className="flex items-start gap-3 text-sm text-slate-700">
                    <input type="checkbox" name="declarationDispensingChoice" checked={formData.declarationDispensingChoice} onChange={handleChange} className="mt-1" />
                    <span>I understand that I can have this prescription dispensed in this pharmacy or that I can choose to have it dispensed in another pharmacy of my choice.</span>
                  </label>
                  {errors.declarationDispensingChoice && <p className="mt-1 text-sm text-red-500">{errors.declarationDispensingChoice}</p>}
                </div>

                <div>
                  <p className="mb-3 text-sm font-medium text-slate-700">Please choose one dispensing option</p>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="dispenseToAnotherPharmacy"
                        checked={formData.dispenseToAnotherPharmacy}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFormData((prev) => ({ ...prev, dispenseToAnotherPharmacy: checked, dispenseInThisPharmacy: checked ? false : prev.dispenseInThisPharmacy }));
                        }}
                      />
                      <span>I am choosing to take my prescription to another pharmacy</span>
                    </label>
                    <label className="flex items-center gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="dispenseInThisPharmacy"
                        checked={formData.dispenseInThisPharmacy}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFormData((prev) => ({ ...prev, dispenseInThisPharmacy: checked, dispenseToAnotherPharmacy: checked ? false : prev.dispenseToAnotherPharmacy }));
                        }}
                      />
                      <span>I have chosen to have my prescription dispensed in this pharmacy</span>
                    </label>
                  </div>
                  {errors.dispensingOption && <p className="mt-1 text-sm text-red-500">{errors.dispensingOption}</p>}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700">Signature of person providing consent</label>
                    <input name="consentSignature" placeholder="Type full name as signature" value={formData.consentSignature} onChange={handleChange} className={getInputClass("consentSignature")} />
                    {errors.consentSignature && <p className="mt-1 text-sm text-red-500">{errors.consentSignature}</p>}
                  </div>

                  {isUnder16 && (
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-slate-700">Signature of parent/guardian providing consent if child is under 16 years</label>
                      <input name="guardianConsentSignature" placeholder="Type parent/guardian full name as signature" value={formData.guardianConsentSignature} onChange={handleChange} className={getInputClass("guardianConsentSignature")} />
                      {errors.guardianConsentSignature && <p className="mt-1 text-sm text-red-500">{errors.guardianConsentSignature}</p>}
                    </div>
                  )}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Date</label>
                    <input type="date" name="consentDate" value={formData.consentDate} onChange={handleChange} className={getInputClass("consentDate")} />
                    {errors.consentDate && <p className="mt-1 text-sm text-red-500">{errors.consentDate}</p>}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button type="button" onClick={prevStep} className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50">Back</button>
                <button type="button" onClick={nextStep} className="rounded-lg bg-sky-700 px-6 py-3 font-medium text-white transition hover:bg-sky-800">Next Step</button>
              </div>
            </div>
          )}

          {/* ── Step 8: Consultation Outcome ── */}
          {step === 8 && (
            <div>
              <h2 className="mb-6 text-2xl font-semibold text-slate-900">Consultation Outcome</h2>

              <div className="space-y-8">
                <div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {[
                      { name: "consultationOutcomeReferral", label: "Referral" },
                      { name: "consultationOutcomeSelfCare", label: "Self-care" },
                      { name: "consultationOutcomeOTCProduct", label: "OTC Product Supplied" },
                      { name: "consultationOutcomePOMSupplied", label: "Prescription for POM supplied" },
                    ].map(({ name, label }) => (
                      <label key={name} className="flex items-start gap-3 text-sm text-slate-700">
                        <input type="checkbox" name={name} checked={formData[name]} onChange={handleChange} className="mt-1" />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.consultationOutcome && <p className="mt-2 text-sm text-red-500">{errors.consultationOutcome}</p>}
                </div>

                <div>
                  <label className="flex items-start gap-3 text-sm text-slate-700">
                    <input type="checkbox" name="declinedTreatment" checked={formData.declinedTreatment} onChange={handleChange} className="mt-1" />
                    <span>Patient has declined treatment, please give reason:</span>
                  </label>
                  {formData.declinedTreatment && (
                    <textarea name="declinedTreatmentReason" placeholder="Enter reason" value={formData.declinedTreatmentReason} onChange={handleChange} className={getInputClass("declinedTreatmentReason") + " mt-3 h-24"} />
                  )}
                  {errors.declinedTreatmentReason && <p className="mt-1 text-sm text-red-500">{errors.declinedTreatmentReason}</p>}
                </div>

                {formData.consultationOutcomeReferral && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                    <h3 className="mb-4 text-lg font-semibold text-amber-800">8.1 Referred to</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {[
                        { name: "referredToAE", label: "Accident & Emergency Department" },
                        { name: "referredToGP", label: "General Practitioner (GP)" },
                      ].map(({ name, label }) => (
                        <label key={name} className="flex items-start gap-3 text-sm text-slate-700">
                          <input type="checkbox" name={name} checked={formData[name]} onChange={handleChange} className="mt-1" />
                          <span>{label}</span>
                        </label>
                      ))}
                      <label className="flex items-start gap-3 text-sm text-slate-700 md:col-span-2">
                        <input type="checkbox" name="referredToOther" checked={formData.referredToOther} onChange={handleChange} className="mt-1" />
                        <span>Other (please specify)</span>
                      </label>
                    </div>
                    {formData.referredToOther && (
                      <textarea name="referredToOtherDetails" placeholder="Specify other referral destination" value={formData.referredToOtherDetails} onChange={handleChange} className={getInputClass("referredToOtherDetails") + " mt-3 h-20"} />
                    )}
                    {errors.referredTo && <p className="mt-2 text-sm text-red-500">{errors.referredTo}</p>}
                    {errors.referredToOtherDetails && <p className="mt-2 text-sm text-red-500">{errors.referredToOtherDetails}</p>}
                  </div>
                )}

                {formData.consultationOutcomePOMSupplied && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                    <h3 className="mb-4 text-lg font-semibold text-amber-800">8.2 Medicine Prescribed</h3>
                    <p className="mb-4 text-sm text-slate-600">Please see Protocol and SPCs for dosage and notes for each individual medicinal product.</p>
                    <label className="flex items-start gap-3 text-sm text-slate-700">
                      <input type="checkbox" name="prescribedAciclovirCream" checked={formData.prescribedAciclovirCream} onChange={handleChange} className="mt-1" />
                      <span>Aciclovir 5% w/w cream, applied five times daily at approximately four hourly intervals omitting the night time application, for at least four days. If healing has not occurred, treatment may be continued for up to 10 days.</span>
                    </label>
                    {errors.prescribedAciclovirCream && <p className="mt-2 text-sm text-red-500">{errors.prescribedAciclovirCream}</p>}
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-between">
                <button type="button" onClick={prevStep} className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50">Back</button>
                <button type="button" onClick={nextStep} className="rounded-lg bg-sky-700 px-6 py-3 font-medium text-white transition hover:bg-sky-800">Next Step</button>
              </div>
            </div>
          )}

          {/* ── Step 9: Pharmacist Information ── */}
          {step === 9 && (
            <div>
              <h2 className="mb-6 text-2xl font-semibold text-slate-900">Pharmacist Information</h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">First & Last Name</label>
                    <input name="pharmacistName" placeholder="Enter pharmacist name" value={formData.pharmacistName} onChange={handleChange} className={getInputClass("pharmacistName")} />
                    {errors.pharmacistName && <p className="mt-1 text-sm text-red-500">{errors.pharmacistName}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Pharmacy Address</label>
                    <input name="pharmacyAddress" placeholder="Enter pharmacy address" value={formData.pharmacyAddress} onChange={handleChange} className={getInputClass("pharmacyAddress")} />
                    {errors.pharmacyAddress && <p className="mt-1 text-sm text-red-500">{errors.pharmacyAddress}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">PSI No.</label>
                    <input name="psiNumber" placeholder="Enter PSI number" value={formData.psiNumber} onChange={handleChange} className={getInputClass("psiNumber")} />
                    {errors.psiNumber && <p className="mt-1 text-sm text-red-500">{errors.psiNumber}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Eircode</label>
                    <input name="pharmacyEircode" placeholder="Enter eircode" value={formData.pharmacyEircode} onChange={handleChange} className={getInputClass("pharmacyEircode")} />
                    {errors.pharmacyEircode && <p className="mt-1 text-sm text-red-500">{errors.pharmacyEircode}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Pharmacist Signature</label>
                    <input name="pharmacistSignature" placeholder="Type full name as signature" value={formData.pharmacistSignature} onChange={handleChange} className={getInputClass("pharmacistSignature")} />
                    {errors.pharmacistSignature && <p className="mt-1 text-sm text-red-500">{errors.pharmacistSignature}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Date</label>
                    <input type="date" name="pharmacistDate" value={formData.pharmacistDate} onChange={handleChange} className={getInputClass("pharmacistDate")} />
                    {errors.pharmacistDate && <p className="mt-1 text-sm text-red-500">{errors.pharmacistDate}</p>}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button type="button" onClick={prevStep} className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50">Back</button>
                <button type="button" onClick={nextStep} className="rounded-lg bg-sky-700 px-6 py-3 font-medium text-white transition hover:bg-sky-800">Next Step</button>
              </div>
            </div>
          )}

          {/* ── Step 10: Overview ── */}
          {step === 10 && (
            <div>
              <h2 className="mb-6 text-2xl font-semibold text-slate-900">Consultation Overview</h2>

              <div className="space-y-6">
                {/* 1. Personal Details */}
                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">1. Personal Details</h3>
                  <div className="grid grid-cols-1 gap-3 text-sm text-slate-700 md:grid-cols-2">
                    <p><span className="font-medium">Patient Name:</span> {strDisplay(formData.patientName)}</p>
                    <p><span className="font-medium">Contact:</span> {strDisplay(formData.contact)}</p>
                    <p><span className="font-medium">Address:</span> {strDisplay(formData.address)}</p>
                    <p><span className="font-medium">Eircode:</span> {strDisplay(formData.eircode)}</p>
                    <p><span className="font-medium">PPSN:</span> {strDisplay(formData.ppsn)}</p>
                    <p><span className="font-medium">Scheme Number:</span> {strDisplay(formData.schemeNumber)}</p>
                    <p><span className="font-medium">Scheme Type:</span> {strDisplay(formData.schemeType)}</p>
                    <p><span className="font-medium">DOB:</span> {strDisplay(formData.dob)}</p>
                    <p><span className="font-medium">Age:</span> {strDisplay(age)}</p>
                    <p><span className="font-medium">Sex:</span> {strDisplay(formData.sex)}</p>
                    <p><span className="font-medium">GP Name:</span> {strDisplay(formData.gpName)}</p>
                    <p><span className="font-medium">GP Contact:</span> {strDisplay(formData.gpContact)}</p>
                    <p className="md:col-span-2"><span className="font-medium">GP Address:</span> {strDisplay(formData.gpAddress)}</p>
                    {isUnder16 && <p className="md:col-span-2"><span className="font-medium">Guardian:</span> {strDisplay(formData.guardian)}</p>}
                  </div>
                </div>

                {/* 2. Presenting Complaint */}
                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">2. Presenting Complaint</h3>
                  <div className="space-y-3 text-sm text-slate-700">
                    <p><span className="font-medium">Symptoms:</span> {strDisplay(formData.symptoms)}</p>
                    <p><span className="font-medium">Medication Tried:</span> {strDisplay(formData.medicationTried)}</p>
                    <p><span className="font-medium">Medication List:</span> {strDisplay(formData.medicationList)}</p>
                  </div>
                </div>

                {/* 3. Medical History */}
                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">3. Medical History</h3>
                  <div className="grid grid-cols-1 gap-3 text-sm text-slate-700 md:grid-cols-2">
                    <p><span className="font-medium">Medical Conditions:</span> {strDisplay(formData.medicalConditions)}</p>
                    <p><span className="font-medium">Pregnant:</span> {boolDisplay(formData.pregnant)}</p>
                    <p><span className="font-medium">Breastfeeding:</span> {boolDisplay(formData.breastfeeding)}</p>
                    <p><span className="font-medium">Renal Impairment:</span> {strDisplay(formData.renalImpairment)}</p>
                    <p><span className="font-medium">Hepatic Impairment:</span> {strDisplay(formData.hepaticImpairment)}</p>
                    <p><span className="font-medium">Allergy Status:</span> {strDisplay(formData.allergyStatus)}</p>
                    <p className="md:col-span-2"><span className="font-medium">Existing Medication:</span> {strDisplay(formData.existingMedication)}</p>
                    <p><span className="font-medium">Antimicrobial Resistance:</span> {strDisplay(formData.antimicrobialResistance)}</p>
                    <p className="md:col-span-2"><span className="font-medium">Resistance Details:</span> {strDisplay(formData.resistanceDetails)}</p>
                  </div>
                </div>

                {/* 4. Red Flags */}
                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">4. Red Flags and Referral Criteria</h3>
                  <div className="space-y-3 text-sm text-slate-700">
                    <p><span className="font-medium">Emergency Referral:</span> {boolDisplay(formData.redFlagEmergency)}</p>
                    <p><span className="font-medium">Urgent - Under 1 Month:</span> {boolDisplay(formData.urgentUnderOneMonth)}</p>
                    <p><span className="font-medium">Urgent - Eye Involvement:</span> {boolDisplay(formData.urgentEyeInvolvement)}</p>
                    <p><span className="font-medium">Urgent - Immunocompromised:</span> {boolDisplay(formData.urgentImmunocompromised)}</p>
                    <p><span className="font-medium">Referral - Contraindications:</span> {boolDisplay(formData.referralContraindications)}</p>
                    <p><span className="font-medium">Referral - Pregnancy:</span> {boolDisplay(formData.referralPregnancy)}</p>
                    <p><span className="font-medium">Referral - Spreading Infection:</span> {boolDisplay(formData.referralSpreadingInfection)}</p>
                    <p><span className="font-medium">Referral - Not Improving within 14 Days:</span> {boolDisplay(formData.referralNotImproving14Days)}</p>
                    <p><span className="font-medium">Referral - Secondary Infection:</span> {boolDisplay(formData.referralSecondaryInfection)}</p>
                    <p><span className="font-medium">Referral - Gingivostomatitis:</span> {boolDisplay(formData.referralGingivostomatitis)}</p>
                    <p><span className="font-medium">Referral - Erythema Multiforme:</span> {boolDisplay(formData.referralErythemaMultiforme)}</p>
                    <p><span className="font-medium">Referral - Hypersensitivity:</span> {boolDisplay(formData.referralHypersensitivity)}</p>
                    <p><span className="font-medium">Limited Supply - Immunocompromised:</span> {boolDisplay(formData.limitedSupplyImmunocompromised)}</p>
                    <p><span className="font-medium">Limited Supply - Recurrent Lesions:</span> {boolDisplay(formData.limitedSupplyRecurrentLesions)}</p>
                    <p><span className="font-medium">Any Red Flag Present:</span> {strDisplay(formData.redFlagPresent)}</p>
                    <p><span className="font-medium">Referral Reason:</span> {strDisplay(formData.referralReason)}</p>
                  </div>
                </div>

                {/* 5. Review of Symptoms */}
                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">5. Review of Symptoms</h3>
                  <div className="space-y-3 text-sm text-slate-700">
                    <p><span className="font-medium">Prodromal Phase:</span> {boolDisplay(formData.symptomProdromal, stepsSkipped)}</p>
                    <p><span className="font-medium">Fluid-filled Blisters:</span> {boolDisplay(formData.symptomBlisters, stepsSkipped)}</p>
                    <p><span className="font-medium">Swollen / Tender Glands:</span> {boolDisplay(formData.symptomTenderGlands, stepsSkipped)}</p>
                    <p><span className="font-medium">Gingivostomatitis Symptoms:</span> {boolDisplay(formData.symptomGingivostomatitis, stepsSkipped)}</p>
                    <p><span className="font-medium">Child - Sore Gums:</span> {boolDisplay(formData.childSoreGums, stepsSkipped)}</p>
                    <p><span className="font-medium">Child - Sore Throat:</span> {boolDisplay(formData.childSoreThroat, stepsSkipped)}</p>
                    <p><span className="font-medium">Child - More Saliva:</span> {boolDisplay(formData.childMoreSaliva, stepsSkipped)}</p>
                    <p><span className="font-medium">Child - High Temperature:</span> {boolDisplay(formData.childHighTemperature, stepsSkipped)}</p>
                    <p><span className="font-medium">Child - Headaches:</span> {boolDisplay(formData.childHeadaches, stepsSkipped)}</p>
                    <p><span className="font-medium">Child - Refusal to Drink Fluids:</span> {boolDisplay(formData.childRefusalFluids, stepsSkipped)}</p>
                    <p><span className="font-medium">Symptoms Typical:</span> {stepsSkipped ? "-" : strDisplay(formData.symptomsTypical)}</p>
                    <p><span className="font-medium">Symptoms Referral Reason:</span> {stepsSkipped ? "-" : strDisplay(formData.symptomsReferralReason)}</p>
                  </div>
                </div>

                {/* 6. Treatment Options */}
                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">6. Treatment Options</h3>
                  <div className="space-y-3 text-sm text-slate-700">
                    <p><span className="font-medium">Meets Inclusion Criteria:</span> {boolDisplay(formData.meetsInclusionCriteria, stepsSkipped)}</p>
                    <p><span className="font-medium">Proceed With Prescribing:</span> {boolDisplay(formData.proceedWithPrescribing, stepsSkipped)}</p>
                    <p><span className="font-medium">Advice And Counselling:</span> {boolDisplay(formData.adviceAndCounselling, stepsSkipped)}</p>
                  </div>
                </div>

                {/* 7. Patient Declaration */}
                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">7. Patient Declaration</h3>
                  <div className="space-y-3 text-sm text-slate-700">
                    <p><span className="font-medium">Clinical Info Sharing Agreed:</span> {boolDisplay(formData.declarationClinicalInfoSharing)}</p>
                    <p><span className="font-medium">Dispensing Choice Statement Agreed:</span> {boolDisplay(formData.declarationDispensingChoice)}</p>
                    <p><span className="font-medium">Dispense To Another Pharmacy:</span> {boolDisplay(formData.dispenseToAnotherPharmacy)}</p>
                    <p><span className="font-medium">Dispense In This Pharmacy:</span> {boolDisplay(formData.dispenseInThisPharmacy)}</p>
                    <p><span className="font-medium">Consent Signature:</span> {strDisplay(formData.consentSignature)}</p>
                    <p><span className="font-medium">Consent Date:</span> {strDisplay(formData.consentDate)}</p>
                    {isUnder16 && <p><span className="font-medium">Guardian Consent Signature:</span> {strDisplay(formData.guardianConsentSignature)}</p>}
                  </div>
                </div>

                {/* 8. Consultation Outcome */}
                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">8. Consultation Outcome</h3>
                  <div className="space-y-3 text-sm text-slate-700">
                    <p><span className="font-medium">Referral:</span> {boolDisplay(formData.consultationOutcomeReferral)}</p>
                    <p><span className="font-medium">Self-care:</span> {boolDisplay(formData.consultationOutcomeSelfCare)}</p>
                    <p><span className="font-medium">OTC Product Supplied:</span> {boolDisplay(formData.consultationOutcomeOTCProduct)}</p>
                    <p><span className="font-medium">Prescription for POM Supplied:</span> {boolDisplay(formData.consultationOutcomePOMSupplied)}</p>
                    <p><span className="font-medium">Declined Treatment:</span> {boolDisplay(formData.declinedTreatment)}</p>
                    <p><span className="font-medium">Declined Treatment Reason:</span> {strDisplay(formData.declinedTreatmentReason)}</p>
                    <p><span className="font-medium">Referred to A&E:</span> {boolDisplay(formData.referredToAE)}</p>
                    <p><span className="font-medium">Referred to GP:</span> {boolDisplay(formData.referredToGP)}</p>
                    <p><span className="font-medium">Referred to Other:</span> {boolDisplay(formData.referredToOther)}</p>
                    <p><span className="font-medium">Other Referral Details:</span> {strDisplay(formData.referredToOtherDetails)}</p>
                    <p><span className="font-medium">Prescribed Aciclovir 5% Cream:</span> {boolDisplay(formData.prescribedAciclovirCream)}</p>
                  </div>
                </div>

                {/* 9. Pharmacist Information */}
                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">9. Pharmacist Information</h3>
                  <div className="grid grid-cols-1 gap-3 text-sm text-slate-700 md:grid-cols-2">
                    <p><span className="font-medium">Pharmacist Name:</span> {strDisplay(formData.pharmacistName)}</p>
                    <p><span className="font-medium">PSI Number:</span> {strDisplay(formData.psiNumber)}</p>
                    <p><span className="font-medium">Pharmacy Address:</span> {strDisplay(formData.pharmacyAddress)}</p>
                    <p><span className="font-medium">Pharmacy Eircode:</span> {strDisplay(formData.pharmacyEircode)}</p>
                    <p><span className="font-medium">Pharmacist Signature:</span> {strDisplay(formData.pharmacistSignature)}</p>
                    <p><span className="font-medium">Pharmacist Date:</span> {strDisplay(formData.pharmacistDate)}</p>
                  </div>
                </div>
              </div>

              {/* Final action buttons */}
              <div className="mt-8 flex flex-wrap justify-between gap-4">
                <button type="button" onClick={prevStep} className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50">
                  Back
                </button>
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={handlePrintConsultation} className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50">
                    Print
                  </button>
                  <button type="button" onClick={handleSaveAndFinish} className="rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-700">
                    {isEditMode ? "Save Changes" : "Save & Finish"}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}