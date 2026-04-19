"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function AllergicRhinitisConsultation() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Step 1
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
    gpName: "",
    gpAddress: "",
    gpContact: "",

    // Step 2
    symptoms: "",
    medicationTried: "",
    medicationList: "",

    // Step 3
    medicalConditions: "",
    pregnant: false,
    breastfeeding: false,
    renalImpairment: "",
    hepaticImpairment: "",
    allergyStatus: "",
    existingMedication: "",
    resistanceAware: "",
    resistanceDetails: "",

    // Step 4
    emergencyFlags: [],
    referralFlags: [],
    limitedSupplyFlags: [],
    hasRedFlags: "",
    referralReason: "",

    // Step 5
    symptomRhinorrhoea: false,
    symptomSneezing: false,
    symptomItchyNoseEyesPalate: false,
    symptomNasalCongestion: false,
    symptomIrritabilityFatigue: false,
    symptomTransverseNasalCrease: false,
    symptomReductionOfSmell: false,
    symptomRhinitisWithConjunctivitis: false,

    symptomRedEye: false,
    symptomEyeItching: false,
    symptomPinkSwellingEyelid: false,
    symptomWateryStringyDischarge: false,
    symptomGrittinessBurningIrritation: false,
    symptomCrustingMorning: false,
    symptomAccompaniedByRhinitis: false,
    symptomUnilateralOrBilateral: false,

    symptomsTypical: "",
    typicalConditionType: "",
    symptomsReferralReason: "",

    // Step 6
    meetsInclusionCriteria: false,
    proceedWithPrescribing: false,
    adviceAndCounselling: false,

    // Step 7
    declarationClinicalInfoSharing: false,
    declarationDispensingChoice: false,
    dispenseToAnotherPharmacy: false,
    dispenseInThisPharmacy: false,
    consentSignature: "",
    guardianConsentSignature: "",
    consentDate: new Date().toISOString().split("T")[0],

    // Step 8
    outcomeReferral: false,
    outcomeSelfCare: false,
    outcomeOTCSupplied: false,
    outcomePOMSupplied: false,
    patientDeclinedTreatment: false,
    declinedReason: "",

    referredToAEDepartment: false,
    referredToGP: false,
    referredToOther: false,
    referredToOtherDetails: "",

    med_INCS_SecondGen: false,
    med_FluticasoneFuroate: false,
    med_FluticasonePropionate: false,
    med_Mometasone: false,
    med_INCS_INAH: false,
    med_AzelastineFluticasone: false,
    med_MometasoneOlopatadine: false,
    med_INCS_FirstGen: false,
    med_Beclometasone: false,
    med_Triamcinolone: false,
    med_INAH: false,
    med_AzelastineHydrochloride: false,
    med_SecondGenAntihistamines: false,
    med_Cetirizine10mgTablets: false,
    med_Cetirizine1mgmlOral: false,
    med_Loratadine10mgTablets: false,
    med_Bilastine10mgODT: false,
    med_Bilastine20mgTablets: false,
    med_Bilastine25mgmlOral: false,
    med_ThirdGenAntihistamines: false,
    med_Desloratadine5mgTablets: false,
    med_Desloratadine05mgmlOral: false,
    med_Fexofenadine120mg: false,
    med_Levocetirizine5mgTablets: false,
    med_Levocetirizine05mgmlOral: false,
    med_IOC: false,
    med_SodiumCromoglicate: false,
    med_IOAH: false,
    med_Ketotifen: false,
    med_OlopatadineEyeDrops: false,

    // Step 9
    pharmacistName: "",
    psiNumber: "",
    pharmacistSignature: "",
    pharmacyAddress: "",
    pharmacyEircode: "",
    pharmacistDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("rxflowUser");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(JSON.parse(storedUser));
  }, [router]);

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
  const isUnder2 = age !== "" && Number(age) < 2;
  const isMale = formData.sex === "Male";
  const stepsSkipped = formData.hasRedFlags === "Yes";

  if (!user) return null;

  // ── Display helpers ──────────────────────────────────────────────────────────

  // Checkboxes: checked = "Yes", unchecked = "-"
  // Pass skipped=true for fields that were never seen due to step skip
  const boolDisplay = (value, skipped = false) => {
    if (skipped) return "-";
    return value ? "Yes" : "-";
  };

  // String/radio fields: show value or "-"
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

  const handleCheckboxArrayChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => {
      const current = prev[name] || [];
      return {
        ...prev,
        [name]: checked ? [...current, value] : current.filter((i) => i !== value),
      };
    });
  };

  const getInputClass = (fieldName) =>
    `w-full rounded-lg border px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition ${
      errors[fieldName]
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
    if (!formData.resistanceAware.trim()) e.resistanceAware = "Please select Yes or No";
    if (formData.resistanceAware === "Yes" && !formData.resistanceDetails.trim())
      e.resistanceDetails = "Please list resistance details";
    return e;
  };

  const validateStepFour = () => {
    const e = {};
    if (!formData.hasRedFlags.trim()) e.hasRedFlags = "Please select Yes or No";
    if (formData.hasRedFlags === "Yes" && !formData.referralReason.trim())
      e.referralReason = "Please document the reason for referral";
    return e;
  };

  const validateStepFive = () => {
    const e = {};
    if (!formData.symptomsTypical.trim()) e.symptomsTypical = "Please select Yes or No";
    if (formData.symptomsTypical === "Yes" && !formData.typicalConditionType.trim())
      e.typicalConditionType = "Please select allergic rhinitis or allergic conjunctivitis";
    if (formData.symptomsTypical === "No" && !formData.symptomsReferralReason.trim())
      e.symptomsReferralReason = "Please document the referral reason";
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
    if (!formData.outcomeReferral && !formData.outcomeSelfCare && !formData.outcomeOTCSupplied && !formData.outcomePOMSupplied)
      e.consultationOutcome = "Please select at least one consultation outcome";
    if (formData.patientDeclinedTreatment && !formData.declinedReason.trim())
      e.declinedReason = "Please provide a reason";
    if (formData.outcomeReferral) {
      if (!formData.referredToAEDepartment && !formData.referredToGP && !formData.referredToOther)
        e.referredTo = "Please select where the patient was referred to";
      if (formData.referredToOther && !formData.referredToOtherDetails.trim())
        e.referredToOtherDetails = "Please specify other referral destination";
    }
    return e;
  };

  const validateStepNine = () => {
    const e = {};
    if (!formData.pharmacistName.trim()) e.pharmacistName = "Pharmacist name is required";
    if (!formData.psiNumber.trim()) e.psiNumber = "PSI number is required";
    if (!formData.pharmacistSignature.trim()) e.pharmacistSignature = "Signature is required";
    if (!formData.pharmacyAddress.trim()) e.pharmacyAddress = "Pharmacy address is required";
    if (!formData.pharmacyEircode.trim()) e.pharmacyEircode = "Eircode is required";
    if (!formData.pharmacistDate) e.pharmacistDate = "Date is required";
    return e;
  };

  // ── Navigation ───────────────────────────────────────────────────────────────

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

    if (step === 4 && formData.hasRedFlags === "Yes") {
      setStep(7);
      return;
    }

    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (step === 7 && formData.hasRedFlags === "Yes") {
      setStep(4);
      return;
    }
    setStep((prev) => prev - 1);
  };

  // ── Save ─────────────────────────────────────────────────────────────────────

  const handleSaveAndFinish = () => {
    const existing = JSON.parse(localStorage.getItem("rxflowConsultations")) || [];
    const newConsultation = {
      id: Date.now(),
      type: "Allergic Rhinitis & Allergic Conjunctivitis",
      createdAt: new Date().toISOString(),
      patientName: formData.patientName,
      pharmacistName: formData.pharmacistName,
      data: formData,
    };
    localStorage.setItem("rxflowConsultations", JSON.stringify([...existing, newConsultation]));
    router.push("/recent-consultations");
  };

  const handlePrintConsultation = () => window.print();

  // ── Shared UI ────────────────────────────────────────────────────────────────

  const NavButtons = ({ hideBack = false }) => (
    <div className="mt-8 flex justify-between">
      {!hideBack ? (
        <button
          type="button"
          onClick={prevStep}
          className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Back
        </button>
      ) : (
        <div />
      )}
      <button
        type="button"
        onClick={nextStep}
        className="rounded-lg bg-sky-700 px-6 py-3 font-medium text-white transition hover:bg-sky-800"
      >
        {hideBack ? "Next" : "Next Step"}
      </button>
    </div>
  );

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar user={user} />

      <div className="mx-auto max-w-6xl px-6 pt-6 md:px-10">
        <Link
          href="/consultation"
          className="inline-flex items-center gap-2 text-slate-600 font-medium transition hover:-translate-x-1 hover:text-sky-700"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back to Consultation Types</span>
        </Link>
      </div>

      <div className="mx-auto max-w-6xl p-6 md:p-10">
        <h1 className="mb-6 text-4xl font-bold text-slate-900">
          Allergic Rhinitis & Allergic Conjunctivitis
        </h1>

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
            "9 Pharmacist Information",
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

                {isUnder2 && (
                  <div className="md:col-span-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                    Patient is under 2 years old. Refer to GP or other relevant medical practitioner.
                  </div>
                )}

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
                  <div className="flex gap-6">
                    {["Male", "Female"].map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm text-slate-700">
                        <input type="radio" name="sex" value={option} checked={formData.sex === option} onChange={handleChange} />
                        {option}
                      </label>
                    ))}
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
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-lg bg-sky-700 px-6 py-3 font-medium text-white transition hover:bg-sky-800"
                >
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
                    Any medication already tried for the management of allergic rhinitis and/or allergic conjunctivitis symptoms?
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
                <button
                  type="button"
                  onClick={prevStep}
                  className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-lg bg-sky-700 px-6 py-3 font-medium text-white transition hover:bg-sky-800"
                >
                  Next Step
                </button>
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

                {!isMale && (
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

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                  <p className="mb-2 text-sm font-medium text-slate-700">Is patient aware if they have resistance to previous treatment?</p>
                  <div className="flex gap-6">
                    {["Yes", "No"].map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm text-slate-700">
                        <input type="radio" name="resistanceAware" value={option} checked={formData.resistanceAware === option} onChange={handleChange} />
                        {option}
                      </label>
                    ))}
                  </div>
                  {errors.resistanceAware && <p className="mt-1 text-sm text-red-500">{errors.resistanceAware}</p>}
                </div>

                {formData.resistanceAware === "Yes" && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">If yes, please list</label>
                    <textarea name="resistanceDetails" placeholder="Enter resistance details" value={formData.resistanceDetails} onChange={handleChange} className={getInputClass("resistanceDetails") + " h-24"} />
                    {errors.resistanceDetails && <p className="mt-1 text-sm text-red-500">{errors.resistanceDetails}</p>}
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-lg bg-sky-700 px-6 py-3 font-medium text-white transition hover:bg-sky-800"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* ── Step 4: Red Flags ── */}
          {step === 4 && (
            <div>
              <h2 className="mb-6 text-2xl font-semibold text-slate-900">Red Flag and Referral Criteria</h2>

              <div className="space-y-8">
                {/* 4.1 Emergency */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-red-700">
                    4.1 Criteria requiring EMERGENCY referral to hospital emergency department, as per 2.4.1 of Protocol. If any of the following are present, then immediate referral needed.
                  </h3>
                  <div className="space-y-3">
                    {[
                      "Symptoms of anaphylaxis including swollen tongue, breathing difficulties, tight chest, trouble swallowing or speaking, feeling dizzy or faint, and collapse",
                      "Symptoms of severe asthma attack",
                    ].map((item) => (
                      <label key={item} className="flex items-start gap-3 text-sm text-slate-700">
                        <input type="checkbox" name="emergencyFlags" value={item} checked={formData.emergencyFlags.includes(item)} onChange={handleCheckboxArrayChange} className="mt-1" />
                        <span>{item}</span>
                      </label>
                    ))}
                    <h3 className="mb-3 text-lg font-semibold text-slate-900">
                      *Pharmacists who have undergone the requisite training should consider use of emergency medicine if clinically appropriate, in addition to calling an ambulance (Medicinal Products (Prescription and Control of Supply)(Amendment)(No. 2) Regulations 2015 (SI 449/2015))
                    </h3>
                  </div>
                </div>

                {/* 4.2 Referral - no prescribing */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-amber-700">
                    4.2 Criteria requiring referral to GP or other relevant medical practitioner, as per 2.4.2 of Protocol. If ANY of the following are present then referral is required and pharmacist prescribing is not permitted.
                  </h3>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {[
                      "Individuals under 2 years of age",
                      "Contraindications as specified in the medication Summary of Product Characteristics",
                      "Pregnancy or suspected pregnancy",
                      "Known hypersensitivity or adverse reaction to medication treatment options or components",
                      "Suspected sinusitis infection or continuous mucopurulent discharge",
                      "Suspected ear infections e.g. otitis media",
                      "Suspected drug induced rhinitis",
                      "Persistent headache, eye or facial pain",
                      "Nasal symptoms present primarily in only one nostril",
                      "Children under 18 years of age on systemic steroid and/or medium to high dose inhaled corticosteroids and/or continuous use of potent topical steroids",
                      "Blurred vision",
                      "Intranasal corticosteroid treatment already used continuously for 8 weeks in children under 18 years of age",
                    ].map((item) => (
                      <label key={item} className="flex items-start gap-3 text-sm text-slate-700">
                        <input type="checkbox" name="referralFlags" value={item} checked={formData.referralFlags.includes(item)} onChange={handleCheckboxArrayChange} className="mt-1" />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 4.3 Limited supply */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-sky-700">
                    4.3 Criteria requiring referral to GP or other relevant medical practitioner, but pharmacist permitted to give INITIAL LIMITED SUPPLY, as per 2.4.3 of protocol.
                  </h3>
                  <h3 className="mb-3 text-lg font-semibold text-slate-900">
                    *Pharmacists can consider prescribing an initial limited supply of treatment if clinically appropriate to mitigate the risk of delay in access to treatment. Treatment should be limited to the dose or time necessary for an individual to access the referral pathway.
                  </h3>
                  <div className="space-y-3">
                    {[
                      "Symptoms not sufficiently controlled under this protocol",
                      "Dyspnoea, wheezing or uncontrolled asthma",
                      "Recent nasal surgery or trauma",
                      "Suspected vernal conjunctivitis",
                    ].map((item) => (
                      <label key={item} className="flex items-start gap-3 text-sm text-slate-700">
                        <input type="checkbox" name="limitedSupplyFlags" value={item} checked={formData.limitedSupplyFlags.includes(item)} onChange={handleCheckboxArrayChange} className="mt-1" />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Red flag present? */}
                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700">Are there any Red Flag or Referral Criteria present?</p>
                  <div className="flex gap-6">
                    {["Yes", "No"].map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm text-slate-700">
                        <input type="radio" name="hasRedFlags" value={option} checked={formData.hasRedFlags === option} onChange={handleChange} />
                        {option}
                      </label>
                    ))}
                  </div>
                  {errors.hasRedFlags && <p className="mt-1 text-sm text-red-500">{errors.hasRedFlags}</p>}
                </div>

                {formData.hasRedFlags === "Yes" && (
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
                <button
                  type="button"
                  onClick={prevStep}
                  className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-lg bg-sky-700 px-6 py-3 font-medium text-white transition hover:bg-sky-800"
                >
                  Next Step
                </button>
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
                    Listed below are the signs and symptoms that are typical of allergic rhinitis and allergic conjunctivitis, tick all that apply:
                  </p>

                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div>
                      <h3 className="mb-3 text-lg font-semibold text-slate-900">Allergic Rhinitis</h3>
                      <div className="space-y-3">
                        {[
                          ["symptomRhinorrhoea", "Rhinorrhoea (watery discharge)"],
                          ["symptomSneezing", "Sneezing"],
                          ["symptomItchyNoseEyesPalate", "Itchy nose, eyes or palate"],
                          ["symptomNasalCongestion", "Nasal congestion"],
                          ["symptomIrritabilityFatigue", "Irritability or fatigue (particularly in young children)"],
                          ["symptomTransverseNasalCrease", "Transverse nasal crease / allergic salute"],
                          ["symptomReductionOfSmell", "Reduction of smell (severe cases)"],
                          ["symptomRhinitisWithConjunctivitis", "May or may not be accompanied by symptoms of allergic conjunctivitis"],
                        ].map(([name, label]) => (
                          <label key={name} className="flex items-start gap-3 text-sm text-slate-700">
                            <input type="checkbox" name={name} checked={formData[name]} onChange={handleChange} className="mt-1" />
                            <span>{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3 text-lg font-semibold text-slate-900">Allergic Conjunctivitis</h3>
                      <div className="space-y-3">
                        {[
                          ["symptomRedEye", "Irritated red eye with dilated/injected vessels"],
                          ["symptomEyeItching", "Eye itching"],
                          ["symptomPinkSwellingEyelid", "Pink mild swelling in the eyelid (puffy eyes)"],
                          ["symptomWateryStringyDischarge", "Profuse watery or mucoserous, stringy discharge"],
                          ["symptomGrittinessBurningIrritation", "Sensation of grittiness, burning, or irritation"],
                          ["symptomCrustingMorning", "Crusting on lid margin in the morning"],
                          ["symptomAccompaniedByRhinitis", "Often accompanied by symptoms associated with allergic rhinitis"],
                          ["symptomUnilateralOrBilateral", "Signs can be unilateral or bilateral but are more often bilateral in allergic conjunctivitis"],
                        ].map(([name, label]) => (
                          <label key={name} className="flex items-start gap-3 text-sm text-slate-700">
                            <input type="checkbox" name={name} checked={formData[name]} onChange={handleChange} className="mt-1" />
                            <span>{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700">
                    Are symptoms typical of allergic rhinitis and/or allergic conjunctivitis?
                  </p>
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

                {formData.symptomsTypical === "Yes" && (
                  <div>
                    <p className="mb-2 text-sm font-medium text-slate-700">Which condition is typical?</p>
                    <div className="flex flex-wrap gap-6">
                      {["Allergic Rhinitis", "Allergic Conjunctivitis"].map((option) => (
                        <label key={option} className="flex items-center gap-2 text-sm text-slate-700">
                          <input type="radio" name="typicalConditionType" value={option} checked={formData.typicalConditionType === option} onChange={handleChange} />
                          {option}
                        </label>
                      ))}
                    </div>
                    {errors.typicalConditionType && <p className="mt-1 text-sm text-red-500">{errors.typicalConditionType}</p>}
                  </div>
                )}

                {formData.symptomsTypical === "No" && (
                  <>
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800">
                      Symptoms are not typical. Refer patient and document the reason below.
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Referral reason</label>
                      <textarea name="symptomsReferralReason" placeholder="Document reason for referral" value={formData.symptomsReferralReason} onChange={handleChange} className={getInputClass("symptomsReferralReason") + " h-24"} />
                      {errors.symptomsReferralReason && <p className="mt-1 text-sm text-red-500">{errors.symptomsReferralReason}</p>}
                    </div>
                  </>
                )}
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-lg bg-sky-700 px-6 py-3 font-medium text-white transition hover:bg-sky-800"
                >
                  Next Step
                </button>
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
                <button
                  type="button"
                  onClick={prevStep}
                  className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-lg bg-sky-700 px-6 py-3 font-medium text-white transition hover:bg-sky-800"
                >
                  Next Step
                </button>
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
                    <li>• I understand the nature of the condition, how the treatment works, the benefits and risks of the treatment. I understand the possible side effects of the prescription medicine issued.</li>
                    <li>• I have been given the opportunity to speak to the pharmacist providing the consultation and to ask questions and raise any concerns.</li>
                    <li>• I have been given information with regards steps to take if my condition gets worse, or does not improve.</li>
                    <li>• The information and details I have provided are accurate, and I understand that this will be recorded and kept by the pharmacy and shared with the HSE for the purposes of public health as required by legislation.</li>
                    <li>• I understand that any data collected will be processed in accordance with relevant data protection requirements.</li>
                  </ul>
                </div>

                <div>
                  <p className="mb-3 text-sm font-medium text-slate-700">Please tick all that apply:</p>
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-start gap-3 text-sm text-slate-700">
                        <input type="checkbox" name="declarationClinicalInfoSharing" checked={formData.declarationClinicalInfoSharing} onChange={handleChange} className="mt-1" />
                        <span>I agree to the sharing of relevant clinical information with another healthcare professional if deemed necessary by the pharmacist, and I understand how this information will support my ongoing care.</span>
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
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-sm font-medium text-slate-700">Please choose one dispensing option</p>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <label className="flex items-start gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="dispenseToAnotherPharmacy"
                        checked={formData.dispenseToAnotherPharmacy}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFormData((prev) => ({ ...prev, dispenseToAnotherPharmacy: checked, dispenseInThisPharmacy: checked ? false : prev.dispenseInThisPharmacy }));
                        }}
                        className="mt-1"
                      />
                      <span>I am choosing to take my prescription to another pharmacy</span>
                    </label>
                    <label className="flex items-start gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="dispenseInThisPharmacy"
                        checked={formData.dispenseInThisPharmacy}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFormData((prev) => ({ ...prev, dispenseInThisPharmacy: checked, dispenseToAnotherPharmacy: checked ? false : prev.dispenseToAnotherPharmacy }));
                        }}
                        className="mt-1"
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
                      <label className="mb-2 block text-sm font-medium text-slate-700">Signature of parent/guardian providing consent if child is aged under 16 years</label>
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
                <button
                  type="button"
                  onClick={prevStep}
                  className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-lg bg-sky-700 px-6 py-3 font-medium text-white transition hover:bg-sky-800"
                >
                  Next Step
                </button>
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
                      { name: "outcomeReferral", label: "Referral" },
                      { name: "outcomeSelfCare", label: "Self-care" },
                      { name: "outcomeOTCSupplied", label: "OTC Product Supplied" },
                      { name: "outcomePOMSupplied", label: "Prescription for POM supplied" },
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
                    <input type="checkbox" name="patientDeclinedTreatment" checked={formData.patientDeclinedTreatment} onChange={handleChange} className="mt-1" />
                    <span>Patient has declined treatment, please give reason:</span>
                  </label>
                  {formData.patientDeclinedTreatment && (
                    <textarea name="declinedReason" placeholder="Enter reason" value={formData.declinedReason} onChange={handleChange} className={getInputClass("declinedReason") + " mt-3 h-24"} />
                  )}
                  {errors.declinedReason && <p className="mt-1 text-sm text-red-500">{errors.declinedReason}</p>}
                </div>

                {formData.outcomeReferral && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                    <h3 className="mb-4 text-lg font-semibold text-amber-800">8.1 Referred to</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {[
                        { name: "referredToAEDepartment", label: "Accident & Emergency Department" },
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

                {formData.outcomePOMSupplied && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                    <h3 className="mb-4 text-lg font-semibold text-amber-800">8.2 Medicine Prescribed / Supplied</h3>
                    <p className="mb-4 text-sm text-slate-600">Please see Protocol and SPCs for dosage and notes for each individual medicinal product.</p>

                    <div className="space-y-6">
                      {/* Nasal Sprays */}
                      <div>
                        <h4 className="mb-3 font-semibold text-slate-900">Allergic Rhinitis – Nasal Sprays</h4>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div className="space-y-3">
                            {[
                              { name: "med_INCS_SecondGen", label: "Intranasal Corticosteroid Spray (INCS) – Second Generation Glucocorticoid" },
                              { name: "med_INCS_INAH", label: "INCS + Intranasal Antihistamine (INAH)" },
                              { name: "med_INCS_FirstGen", label: "INCS – First Generation Glucocorticoid (over 18 only)" },
                              { name: "med_INAH", label: "INAH – Antihistamine Nasal Spray" },
                            ].map(({ name, label }) => (
                              <label key={name} className="flex items-start gap-3 text-sm text-slate-700">
                                <input type="checkbox" name={name} checked={formData[name]} onChange={handleChange} className="mt-1" />
                                <span>{label}</span>
                              </label>
                            ))}
                          </div>
                          <div className="space-y-3">
                            {[
                              { name: "med_FluticasoneFuroate", label: "Fluticasone furoate 27.5 micrograms per spray, nasal spray" },
                              { name: "med_FluticasonePropionate", label: "Fluticasone propionate 50 micrograms, nasal spray" },
                              { name: "med_Mometasone", label: "Mometasone 50 micrograms, nasal spray" },
                              { name: "med_AzelastineFluticasone", label: "Azelastine/fluticasone propionate 137 micrograms/50 micrograms per actuation, nasal spray" },
                              { name: "med_MometasoneOlopatadine", label: "Mometasone/Olopatadine 25 microgram/600 microgram per actuation, nasal spray" },
                              { name: "med_Beclometasone", label: "Beclometasone Dipropionate 50 micrograms, nasal spray" },
                              { name: "med_Triamcinolone", label: "Triamcinolone acetonide 55 micrograms per dose, nasal spray" },
                              { name: "med_AzelastineHydrochloride", label: "Azelastine Hydrochloride 140 micrograms per spray, nasal spray" },
                            ].map(({ name, label }) => (
                              <label key={name} className="flex items-start gap-3 text-sm text-slate-700">
                                <input type="checkbox" name={name} checked={formData[name]} onChange={handleChange} className="mt-1" />
                                <span>{label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Oral Antihistamines */}
                      <div>
                        <h4 className="mb-3 font-semibold text-slate-900">Allergic Rhinitis – Minimally sedating oral antihistamines</h4>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div className="space-y-3">
                            {[
                              { name: "med_SecondGenAntihistamines", label: "Second Generation Antihistamines (minimally sedating antihistamines)" },
                              { name: "med_ThirdGenAntihistamines", label: "Third Generation Antihistamines" },
                            ].map(({ name, label }) => (
                              <label key={name} className="flex items-start gap-3 text-sm text-slate-700">
                                <input type="checkbox" name={name} checked={formData[name]} onChange={handleChange} className="mt-1" />
                                <span>{label}</span>
                              </label>
                            ))}
                          </div>
                          <div className="space-y-3">
                            {[
                              { name: "med_Cetirizine10mgTablets", label: "Cetirizine dihydrochloride 10 mg tablets" },
                              { name: "med_Cetirizine1mgmlOral", label: "Cetirizine dihydrochloride 1 mg/ml oral solution" },
                              { name: "med_Loratadine10mgTablets", label: "Loratadine 10 mg tablets" },
                              { name: "med_Bilastine10mgODT", label: "Bilastine 10 mg orodispersible tablets" },
                              { name: "med_Bilastine20mgTablets", label: "Bilastine 20 mg tablets" },
                              { name: "med_Bilastine25mgmlOral", label: "Bilastine 2.5 mg/ml oral solution" },
                              { name: "med_Desloratadine5mgTablets", label: "Desloratadine 5 mg tablets" },
                              { name: "med_Desloratadine05mgmlOral", label: "Desloratadine 0.5 mg/ml oral solution" },
                              { name: "med_Fexofenadine120mg", label: "Fexofenadine 120mg" },
                              { name: "med_Levocetirizine5mgTablets", label: "Levocetirizine 5mg tablets" },
                              { name: "med_Levocetirizine05mgmlOral", label: "Levocetirizine 0.5mg/ml oral solution" },
                            ].map(({ name, label }) => (
                              <label key={name} className="flex items-start gap-3 text-sm text-slate-700">
                                <input type="checkbox" name={name} checked={formData[name]} onChange={handleChange} className="mt-1" />
                                <span>{label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Eye Drops */}
                      <div>
                        <h4 className="mb-3 font-semibold text-slate-900">Allergic Conjunctivitis</h4>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div className="space-y-3">
                            {[
                              { name: "med_IOC", label: "IOC – Intraocular Cromone (Mast cell stabiliser)" },
                              { name: "med_IOAH", label: "IOAH – Intraocular antihistamine" },
                            ].map(({ name, label }) => (
                              <label key={name} className="flex items-start gap-3 text-sm text-slate-700">
                                <input type="checkbox" name={name} checked={formData[name]} onChange={handleChange} className="mt-1" />
                                <span>{label}</span>
                              </label>
                            ))}
                          </div>
                          <div className="space-y-3">
                            {[
                              { name: "med_SodiumCromoglicate", label: "Sodium cromoglicate 2% w/v eye drops, solution" },
                              { name: "med_Ketotifen", label: "Ketotifen 0.25mg/ml eye drops, solution" },
                              { name: "med_OlopatadineEyeDrops", label: "Olopatadine hydrochloride 1mg/ml eye drops, solution" },
                            ].map(({ name, label }) => (
                              <label key={name} className="flex items-start gap-3 text-sm text-slate-700">
                                <input type="checkbox" name={name} checked={formData[name]} onChange={handleChange} className="mt-1" />
                                <span>{label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-lg bg-sky-700 px-6 py-3 font-medium text-white transition hover:bg-sky-800"
                >
                  Next Step
                </button>
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
                <button
                  type="button"
                  onClick={prevStep}
                  className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-lg bg-sky-700 px-6 py-3 font-medium text-white transition hover:bg-sky-800"
                >
                  Next Step
                </button>
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
                    <p><span className="font-medium">Resistance Aware:</span> {strDisplay(formData.resistanceAware)}</p>
                    <p className="md:col-span-2"><span className="font-medium">Resistance Details:</span> {strDisplay(formData.resistanceDetails)}</p>
                  </div>
                </div>

                {/* 4. Red Flags */}
                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">4. Red Flags and Referral Criteria</h3>
                  <div className="space-y-3 text-sm text-slate-700">
                    <p><span className="font-medium">Emergency Flags:</span> {formData.emergencyFlags.length > 0 ? formData.emergencyFlags.join(", ") : "-"}</p>
                    <p><span className="font-medium">Referral Flags:</span> {formData.referralFlags.length > 0 ? formData.referralFlags.join(", ") : "-"}</p>
                    <p><span className="font-medium">Initial Limited Supply Flags:</span> {formData.limitedSupplyFlags.length > 0 ? formData.limitedSupplyFlags.join(", ") : "-"}</p>
                    <p><span className="font-medium">Any Red Flags Present:</span> {strDisplay(formData.hasRedFlags)}</p>
                    <p><span className="font-medium">Referral Reason:</span> {strDisplay(formData.referralReason)}</p>
                  </div>
                </div>

                {/* 5. Review of Symptoms — all "-" if steps were skipped */}
                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">5. Review of Symptoms</h3>
                  <div className="space-y-3 text-sm text-slate-700">
                    <p><span className="font-medium">Rhinorrhoea:</span> {boolDisplay(formData.symptomRhinorrhoea, stepsSkipped)}</p>
                    <p><span className="font-medium">Sneezing:</span> {boolDisplay(formData.symptomSneezing, stepsSkipped)}</p>
                    <p><span className="font-medium">Itchy Nose / Eyes / Palate:</span> {boolDisplay(formData.symptomItchyNoseEyesPalate, stepsSkipped)}</p>
                    <p><span className="font-medium">Nasal Congestion:</span> {boolDisplay(formData.symptomNasalCongestion, stepsSkipped)}</p>
                    <p><span className="font-medium">Irritability / Fatigue:</span> {boolDisplay(formData.symptomIrritabilityFatigue, stepsSkipped)}</p>
                    <p><span className="font-medium">Transverse Nasal Crease:</span> {boolDisplay(formData.symptomTransverseNasalCrease, stepsSkipped)}</p>
                    <p><span className="font-medium">Reduction of Smell:</span> {boolDisplay(formData.symptomReductionOfSmell, stepsSkipped)}</p>
                    <p><span className="font-medium">Rhinitis with Conjunctivitis:</span> {boolDisplay(formData.symptomRhinitisWithConjunctivitis, stepsSkipped)}</p>
                    <p><span className="font-medium">Red Eye:</span> {boolDisplay(formData.symptomRedEye, stepsSkipped)}</p>
                    <p><span className="font-medium">Eye Itching:</span> {boolDisplay(formData.symptomEyeItching, stepsSkipped)}</p>
                    <p><span className="font-medium">Pink Swelling Eyelid:</span> {boolDisplay(formData.symptomPinkSwellingEyelid, stepsSkipped)}</p>
                    <p><span className="font-medium">Watery / Stringy Discharge:</span> {boolDisplay(formData.symptomWateryStringyDischarge, stepsSkipped)}</p>
                    <p><span className="font-medium">Grittiness / Burning / Irritation:</span> {boolDisplay(formData.symptomGrittinessBurningIrritation, stepsSkipped)}</p>
                    <p><span className="font-medium">Crusting in Morning:</span> {boolDisplay(formData.symptomCrustingMorning, stepsSkipped)}</p>
                    <p><span className="font-medium">Accompanied by Rhinitis:</span> {boolDisplay(formData.symptomAccompaniedByRhinitis, stepsSkipped)}</p>
                    <p><span className="font-medium">Unilateral or Bilateral:</span> {boolDisplay(formData.symptomUnilateralOrBilateral, stepsSkipped)}</p>
                    <p><span className="font-medium">Symptoms Typical:</span> {stepsSkipped ? "-" : strDisplay(formData.symptomsTypical)}</p>
                    <p><span className="font-medium">Typical Condition Type:</span> {stepsSkipped ? "-" : strDisplay(formData.typicalConditionType)}</p>
                    <p><span className="font-medium">Symptoms Referral Reason:</span> {stepsSkipped ? "-" : strDisplay(formData.symptomsReferralReason)}</p>
                  </div>
                </div>

                {/* 6. Treatment Options — all "-" if steps were skipped */}
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
                    <p><span className="font-medium">Referral:</span> {boolDisplay(formData.outcomeReferral)}</p>
                    <p><span className="font-medium">Self-care:</span> {boolDisplay(formData.outcomeSelfCare)}</p>
                    <p><span className="font-medium">OTC Product Supplied:</span> {boolDisplay(formData.outcomeOTCSupplied)}</p>
                    <p><span className="font-medium">Prescription for POM Supplied:</span> {boolDisplay(formData.outcomePOMSupplied)}</p>
                    <p><span className="font-medium">Patient Declined Treatment:</span> {boolDisplay(formData.patientDeclinedTreatment)}</p>
                    <p><span className="font-medium">Declined Reason:</span> {strDisplay(formData.declinedReason)}</p>
                    <p><span className="font-medium">Referred to A&E:</span> {boolDisplay(formData.referredToAEDepartment)}</p>
                    <p><span className="font-medium">Referred to GP:</span> {boolDisplay(formData.referredToGP)}</p>
                    <p><span className="font-medium">Referred to Other:</span> {boolDisplay(formData.referredToOther)}</p>
                    <p><span className="font-medium">Other Referral Details:</span> {strDisplay(formData.referredToOtherDetails)}</p>

                    <p className="mt-2 font-medium text-slate-900">Medicines Prescribed / Supplied:</p>
                    <p><span className="font-medium">INCS Second Gen:</span> {boolDisplay(formData.med_INCS_SecondGen)}</p>
                    <p><span className="font-medium">Fluticasone Furoate:</span> {boolDisplay(formData.med_FluticasoneFuroate)}</p>
                    <p><span className="font-medium">Fluticasone Propionate:</span> {boolDisplay(formData.med_FluticasonePropionate)}</p>
                    <p><span className="font-medium">Mometasone:</span> {boolDisplay(formData.med_Mometasone)}</p>
                    <p><span className="font-medium">INCS + INAH:</span> {boolDisplay(formData.med_INCS_INAH)}</p>
                    <p><span className="font-medium">Azelastine / Fluticasone:</span> {boolDisplay(formData.med_AzelastineFluticasone)}</p>
                    <p><span className="font-medium">Mometasone / Olopatadine:</span> {boolDisplay(formData.med_MometasoneOlopatadine)}</p>
                    <p><span className="font-medium">INCS First Gen:</span> {boolDisplay(formData.med_INCS_FirstGen)}</p>
                    <p><span className="font-medium">Beclometasone:</span> {boolDisplay(formData.med_Beclometasone)}</p>
                    <p><span className="font-medium">Triamcinolone:</span> {boolDisplay(formData.med_Triamcinolone)}</p>
                    <p><span className="font-medium">INAH:</span> {boolDisplay(formData.med_INAH)}</p>
                    <p><span className="font-medium">Azelastine Hydrochloride:</span> {boolDisplay(formData.med_AzelastineHydrochloride)}</p>
                    <p><span className="font-medium">Second Gen Antihistamines:</span> {boolDisplay(formData.med_SecondGenAntihistamines)}</p>
                    <p><span className="font-medium">Cetirizine 10mg Tablets:</span> {boolDisplay(formData.med_Cetirizine10mgTablets)}</p>
                    <p><span className="font-medium">Cetirizine Oral Solution:</span> {boolDisplay(formData.med_Cetirizine1mgmlOral)}</p>
                    <p><span className="font-medium">Loratadine 10mg Tablets:</span> {boolDisplay(formData.med_Loratadine10mgTablets)}</p>
                    <p><span className="font-medium">Bilastine 10mg ODT:</span> {boolDisplay(formData.med_Bilastine10mgODT)}</p>
                    <p><span className="font-medium">Bilastine 20mg Tablets:</span> {boolDisplay(formData.med_Bilastine20mgTablets)}</p>
                    <p><span className="font-medium">Bilastine Oral Solution:</span> {boolDisplay(formData.med_Bilastine25mgmlOral)}</p>
                    <p><span className="font-medium">Third Gen Antihistamines:</span> {boolDisplay(formData.med_ThirdGenAntihistamines)}</p>
                    <p><span className="font-medium">Desloratadine 5mg Tablets:</span> {boolDisplay(formData.med_Desloratadine5mgTablets)}</p>
                    <p><span className="font-medium">Desloratadine Oral Solution:</span> {boolDisplay(formData.med_Desloratadine05mgmlOral)}</p>
                    <p><span className="font-medium">Fexofenadine 120mg:</span> {boolDisplay(formData.med_Fexofenadine120mg)}</p>
                    <p><span className="font-medium">Levocetirizine 5mg Tablets:</span> {boolDisplay(formData.med_Levocetirizine5mgTablets)}</p>
                    <p><span className="font-medium">Levocetirizine Oral Solution:</span> {boolDisplay(formData.med_Levocetirizine05mgmlOral)}</p>
                    <p><span className="font-medium">IOC:</span> {boolDisplay(formData.med_IOC)}</p>
                    <p><span className="font-medium">Sodium Cromoglicate:</span> {boolDisplay(formData.med_SodiumCromoglicate)}</p>
                    <p><span className="font-medium">IOAH:</span> {boolDisplay(formData.med_IOAH)}</p>
                    <p><span className="font-medium">Ketotifen:</span> {boolDisplay(formData.med_Ketotifen)}</p>
                    <p><span className="font-medium">Olopatadine Eye Drops:</span> {boolDisplay(formData.med_OlopatadineEyeDrops)}</p>
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
                <button
                  type="button"
                  onClick={prevStep}
                  className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Back
                </button>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handlePrintConsultation}
                    className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Print
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAndFinish}
                    className="rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-700"
                  >
                    Save & Finish
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
