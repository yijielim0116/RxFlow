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

    // Step 8.2 Medicine supplied / prescribed
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

    setUser(JSON.parse(storedUser));
  }, [router]);

  const age = useMemo(() => {
    if (!formData.dob) return "";

    const dobDate = new Date(formData.dob);
    const today = new Date();

    let years = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dobDate.getDate())
    ) {
      years--;
    }

    return years >= 0 ? years.toString() : "";
  }, [formData.dob]);

  const isUnder16 = age !== "" && Number(age) < 16;
  const isUnder2 = age !== "" && Number(age) < 2;
  const isMale = formData.sex === "Male";

  if (!user) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      // If male selected, clear pregnancy/breastfeeding
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
      const currentValues = prev[name] || [];

      return {
        ...prev,
        [name]: checked
          ? [...currentValues, value]
          : currentValues.filter((item) => item !== value),
      };
    });
  };

  const handleSaveAndFinish = () => {
    const existingConsultations =
      JSON.parse(localStorage.getItem("rxflowConsultations")) || [];

    const newConsultation = {
      id: Date.now(),
      type: "Allergic Rhinitis & Allergic Conjunctivitis",
      createdAt: new Date().toISOString(),
      patientName: formData.patientName,
      pharmacistName: formData.pharmacistName,
      data: formData,
    };

    localStorage.setItem(
      "rxflowConsultations",
      JSON.stringify([...existingConsultations, newConsultation])
    );

    router.push("/recent-consultations");
  };

  const handlePrintConsultation = () => {
    window.print();
  };

  const getInputClass = (fieldName) =>
    `w-full rounded-lg border px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition ${errors[fieldName]
      ? "border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-slate-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
    }`;

  const validateStepOne = () => {
    const newErrors = {};

    if (!formData.patientName.trim()) newErrors.patientName = "Required";
    if (!formData.address.trim()) newErrors.address = "Required";
    if (!formData.eircode.trim()) newErrors.eircode = "Required";
    if (!formData.ppsn.trim()) newErrors.ppsn = "Required";
    if (!formData.contact.trim()) newErrors.contact = "Required";
    if (!formData.schemeNumber.trim()) newErrors.schemeNumber = "Required";
    if (!formData.schemeType.trim()) newErrors.schemeType = "Required";
    if (!formData.dob) newErrors.dob = "Required";
    if (!formData.sex.trim()) newErrors.sex = "Required";

    if (isUnder16 && !formData.guardian.trim()) {
      newErrors.guardian = "Required for patients under 16";
    }

    return newErrors;
  };

  const validateStepTwo = () => {
    const newErrors = {};

    if (!formData.symptoms.trim()) {
      newErrors.symptoms = "Required";
    }

    if (!formData.medicationTried.trim()) {
      newErrors.medicationTried = "Please select Yes or No";
    }

    if (
      formData.medicationTried === "Yes" &&
      !formData.medicationList.trim()
    ) {
      newErrors.medicationList = "Please list medication already tried";
    }

    return newErrors;
  };

  const validateStepThree = () => {
    const newErrors = {};

    if (!formData.medicalConditions.trim()) {
      newErrors.medicalConditions = "Required";
    }

    if (!formData.renalImpairment.trim()) {
      newErrors.renalImpairment = "Please select Yes or No";
    }

    if (!formData.hepaticImpairment.trim()) {
      newErrors.hepaticImpairment = "Please select Yes or No";
    }

    if (!formData.allergyStatus.trim()) {
      newErrors.allergyStatus = "Required";
    }

    if (!formData.existingMedication.trim()) {
      newErrors.existingMedication = "Required";
    }

    if (!formData.resistanceAware.trim()) {
      newErrors.resistanceAware = "Please select Yes or No";
    }

    if (
      formData.resistanceAware === "Yes" &&
      !formData.resistanceDetails.trim()
    ) {
      newErrors.resistanceDetails = "Please list resistance details";
    }

    return newErrors;
  };

  const validateStepFour = () => {
    const newErrors = {};

    if (!formData.hasRedFlags.trim()) {
      newErrors.hasRedFlags = "Please select Yes or No";
    }

    if (formData.hasRedFlags === "Yes" && !formData.referralReason.trim()) {
      newErrors.referralReason = "Please document the reason for referral";
    }

    return newErrors;
  };

  const validateStepFive = () => {
    const newErrors = {};

    if (!formData.symptomsTypical.trim()) {
      newErrors.symptomsTypical = "Please select Yes or No";
    }

    if (
      formData.symptomsTypical === "Yes" &&
      !formData.typicalConditionType.trim()
    ) {
      newErrors.typicalConditionType =
        "Please select allergic rhinitis or allergic conjunctivitis";
    }

    if (
      formData.symptomsTypical === "No" &&
      !formData.symptomsReferralReason.trim()
    ) {
      newErrors.symptomsReferralReason =
        "Please document the referral reason";
    }

    return newErrors;
  };

  const validateStepSix = () => {
    const newErrors = {};

    if (!formData.meetsInclusionCriteria) {
      newErrors.meetsInclusionCriteria = "Please confirm inclusion criteria";
    }

    if (!formData.proceedWithPrescribing) {
      newErrors.proceedWithPrescribing =
        "Please confirm prescribing suitability";
    }

    if (!formData.adviceAndCounselling) {
      newErrors.adviceAndCounselling =
        "Please confirm advice and counselling";
    }

    return newErrors;
  };

  const validateStepSeven = () => {
    const newErrors = {};

    if (!formData.declarationClinicalInfoSharing) {
      newErrors.declarationClinicalInfoSharing =
        "Please confirm clinical information sharing";
    }

    if (!formData.declarationDispensingChoice) {
      newErrors.declarationDispensingChoice =
        "Please confirm dispensing choice statement";
    }

    if (
      !formData.dispenseToAnotherPharmacy &&
      !formData.dispenseInThisPharmacy
    ) {
      newErrors.dispensingOption = "Please choose one dispensing option";
    }

    if (
      formData.dispenseToAnotherPharmacy &&
      formData.dispenseInThisPharmacy
    ) {
      newErrors.dispensingOption = "Please choose only one dispensing option";
    }

    if (!formData.consentSignature.trim()) {
      newErrors.consentSignature = "Signature is required";
    }

    if (isUnder16 && !formData.guardianConsentSignature.trim()) {
      newErrors.guardianConsentSignature =
        "Parent/guardian signature is required";
    }

    if (!formData.consentDate) {
      newErrors.consentDate = "Date is required";
    }

    return newErrors;
  };

  const validateStepEight = () => {
    const newErrors = {};

    if (
      !formData.outcomeReferral &&
      !formData.outcomeSelfCare &&
      !formData.outcomeOTCSupplied &&
      !formData.outcomePOMSupplied
    ) {
      newErrors.consultationOutcome =
        "Please select at least one consultation outcome";
    }

    if (formData.patientDeclinedTreatment && !formData.declinedReason.trim()) {
      newErrors.declinedReason = "Please provide a reason";
    }

    if (formData.outcomeReferral) {
      if (
        !formData.referredToAEDepartment &&
        !formData.referredToGP &&
        !formData.referredToOther
      ) {
        newErrors.referredTo = "Please select where the patient was referred to";
      }

      if (formData.referredToOther && !formData.referredToOtherDetails.trim()) {
        newErrors.referredToOtherDetails = "Please specify other referral destination";
      }
    }

    return newErrors;
  };

  const validateStepNine = () => {
    const newErrors = {};

    if (!formData.pharmacistName.trim()) {
      newErrors.pharmacistName = "Pharmacist name is required";
    }

    if (!formData.psiNumber.trim()) {
      newErrors.psiNumber = "PSI number is required";
    }

    if (!formData.pharmacistSignature.trim()) {
      newErrors.pharmacistSignature = "Signature is required";
    }

    if (!formData.pharmacyAddress.trim()) {
      newErrors.pharmacyAddress = "Pharmacy address is required";
    }

    if (!formData.pharmacyEircode.trim()) {
      newErrors.pharmacyEircode = "Eircode is required";
    }

    if (!formData.pharmacistDate) {
      newErrors.pharmacistDate = "Date is required";
    }

    return newErrors;
  };

  const nextStep = () => {
    let newErrors = {};

    if (step === 1) newErrors = validateStepOne();
    if (step === 2) newErrors = validateStepTwo();
    if (step === 3) newErrors = validateStepThree();
    if (step === 4) newErrors = validateStepFour();
    if (step === 5) newErrors = validateStepFive();
    if (step === 6) newErrors = validateStepSix();
    if (step === 7) newErrors = validateStepSeven();
    if (step === 8) newErrors = validateStepEight();
    if (step === 9) newErrors = validateStepNine();

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

        <div className="mb-8 flex flex-wrap gap-4 text-sm">
          <div className={step >= 1 ? "font-semibold text-sky-700" : "text-slate-500"}>
            1 Personal Details
          </div>
          <div className={step >= 2 ? "font-semibold text-sky-700" : "text-slate-500"}>
            2 Presenting Complaint
          </div>
          <div className={step >= 3 ? "font-semibold text-sky-700" : "text-slate-500"}>
            3 Medical History
          </div>
          <div className={step >= 4 ? "font-semibold text-sky-700" : "text-slate-500"}>
            4 Red Flags
          </div>
          <div className={step >= 5 ? "font-semibold text-sky-700" : "text-slate-400"}>
            5 Review of Symptoms
          </div>
          <div className={step >= 6 ? "font-semibold text-sky-700" : "text-slate-400"}>
            6 Treatment Options
          </div>
          <div className={step >= 7 ? "font-semibold text-sky-700" : "text-slate-400"}>
            7 Patient Declaration
          </div>
          <div className={step >= 8 ? "font-semibold text-sky-700" : "text-slate-400"}>
            8 Consultation Outcome
          </div>
          <div className={step >= 9 ? "font-semibold text-sky-700" : "text-slate-400"}>
            9 Pharmacist Information
          </div>
          <div className={step >= 10 ? "font-semibold text-sky-700" : "text-slate-400"}>
            10 Overview
          </div>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm">
          {step === 1 && (
            <div>
              <h2 className="mb-6 text-2xl font-semibold text-slate-900">
                Personal Details
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <input
                    name="patientName"
                    placeholder="Patient Name"
                    value={formData.patientName}
                    onChange={handleChange}
                    className={getInputClass("patientName")}
                  />
                  {errors.patientName && (
                    <p className="mt-1 text-sm text-red-500">{errors.patientName}</p>
                  )}
                </div>

                <div>
                  <input
                    name="contact"
                    placeholder="Contact Number"
                    value={formData.contact}
                    onChange={handleChange}
                    className={getInputClass("contact")}
                  />
                  {errors.contact && (
                    <p className="mt-1 text-sm text-red-500">{errors.contact}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <input
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    className={getInputClass("address")}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                  )}
                </div>

                <div>
                  <input
                    name="eircode"
                    placeholder="Eircode"
                    value={formData.eircode}
                    onChange={handleChange}
                    className={getInputClass("eircode")}
                  />
                  {errors.eircode && (
                    <p className="mt-1 text-sm text-red-500">{errors.eircode}</p>
                  )}
                </div>

                <div>
                  <input
                    name="ppsn"
                    placeholder="PPSN"
                    value={formData.ppsn}
                    onChange={handleChange}
                    className={getInputClass("ppsn")}
                  />
                  {errors.ppsn && (
                    <p className="mt-1 text-sm text-red-500">{errors.ppsn}</p>
                  )}
                </div>

                <div>
                  <input
                    name="schemeNumber"
                    placeholder="Scheme Number"
                    value={formData.schemeNumber}
                    onChange={handleChange}
                    className={getInputClass("schemeNumber")}
                  />
                  {errors.schemeNumber && (
                    <p className="mt-1 text-sm text-red-500">{errors.schemeNumber}</p>
                  )}
                </div>

                <div>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className={getInputClass("dob")}
                  />
                  {errors.dob && (
                    <p className="mt-1 text-sm text-red-500">{errors.dob}</p>
                  )}
                </div>

                <div>
                  <input
                    value={age}
                    readOnly
                    placeholder="Age"
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                  />
                </div>

                {isUnder2 && (
                  <div className="md:col-span-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                    Patient is under 2 years old. Refer to GP or other relevant medical practitioner.
                  </div>
                )}

                <div className="md:col-span-2">
                  <p className="mb-2 text-sm font-medium text-slate-700">
                    Scheme Type
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {["GMS", "DPS", "GP Visit", "Private"].map((scheme) => (
                      <label
                        key={scheme}
                        className="flex items-center gap-2 text-sm text-slate-700"
                      >
                        <input
                          type="radio"
                          name="schemeType"
                          value={scheme}
                          checked={formData.schemeType === scheme}
                          onChange={handleChange}
                        />
                        {scheme}
                      </label>
                    ))}
                  </div>
                  {errors.schemeType && (
                    <p className="mt-1 text-sm text-red-500">{errors.schemeType}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <p className="mb-2 text-sm font-medium text-slate-700">Sex</p>
                  <div className="flex gap-6">
                    {["Male", "Female"].map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 text-sm text-slate-700"
                      >
                        <input
                          type="radio"
                          name="sex"
                          value={option}
                          checked={formData.sex === option}
                          onChange={handleChange}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                  {errors.sex && (
                    <p className="mt-1 text-sm text-red-500">{errors.sex}</p>
                  )}
                </div>

                {isUnder16 && (
                  <div className="md:col-span-2">
                    <input
                      name="guardian"
                      placeholder="Parent/Guardian Name (if patient under 16 years)"
                      value={formData.guardian}
                      onChange={handleChange}
                      className={getInputClass("guardian")}
                    />
                    {errors.guardian && (
                      <p className="mt-1 text-sm text-red-500">{errors.guardian}</p>
                    )}
                  </div>
                )}

                <div>
                  <input
                    name="gpName"
                    placeholder="GP Name (Optional)"
                    value={formData.gpName}
                    onChange={handleChange}
                    className={getInputClass("gpName")}
                  />
                </div>

                <div>
                  <input
                    name="gpContact"
                    placeholder="GP Contact Number (Optional)"
                    value={formData.gpContact}
                    onChange={handleChange}
                    className={getInputClass("gpContact")}
                  />
                </div>

                <div className="md:col-span-2">
                  <input
                    name="gpAddress"
                    placeholder="GP Address (Optional)"
                    value={formData.gpAddress}
                    onChange={handleChange}
                    className={getInputClass("gpAddress")}
                  />
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

          {step === 2 && (
            <div>
              <h2 className="mb-6 text-2xl font-semibold text-slate-900">
                Presenting Complaint
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Document the symptoms of the presenting complaint as described by the patient
                  </label>
                  <textarea
                    name="symptoms"
                    placeholder="Enter symptoms"
                    value={formData.symptoms}
                    onChange={handleChange}
                    className={getInputClass("symptoms") + " h-32"}
                  />
                  {errors.symptoms && (
                    <p className="mt-1 text-sm text-red-500">{errors.symptoms}</p>
                  )}
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700">
                    Any medication already tried for the management of allergic rhinitis and/or allergic conjunctivitis symptoms?
                  </p>
                  <div className="flex gap-6">
                    {["Yes", "No"].map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 text-sm text-slate-700"
                      >
                        <input
                          type="radio"
                          name="medicationTried"
                          value={option}
                          checked={formData.medicationTried === option}
                          onChange={handleChange}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                  {errors.medicationTried && (
                    <p className="mt-1 text-sm text-red-500">{errors.medicationTried}</p>
                  )}
                </div>

                {formData.medicationTried === "Yes" && (
                  <div>
                    <textarea
                      name="medicationList"
                      placeholder="If yes, please list"
                      value={formData.medicationList}
                      onChange={handleChange}
                      className={getInputClass("medicationList")}
                    />
                    {errors.medicationList && (
                      <p className="mt-1 text-sm text-red-500">{errors.medicationList}</p>
                    )}
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

          {step === 3 && (
            <div>
              <h2 className="mb-6 text-2xl font-semibold text-slate-900">
                Medical History
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Existing Health Conditions
                  </label>
                  <textarea
                    name="medicalConditions"
                    placeholder="List existing health conditions"
                    value={formData.medicalConditions}
                    onChange={handleChange}
                    className={getInputClass("medicalConditions") + " h-28"}
                  />
                  {errors.medicalConditions && (
                    <p className="mt-1 text-sm text-red-500">{errors.medicalConditions}</p>
                  )}
                </div>

                {!isMale && (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                      <input
                        type="checkbox"
                        name="pregnant"
                        checked={formData.pregnant}
                        onChange={handleChange}
                      />
                      Pregnant or suspected pregnancy
                    </label>

                    <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                      <input
                        type="checkbox"
                        name="breastfeeding"
                        checked={formData.breastfeeding}
                        onChange={handleChange}
                      />
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
                    <p className="mb-2 text-sm font-medium text-slate-700">
                      Any known renal (kidney) impairment?
                    </p>
                    <div className="flex gap-6">
                      {["Yes", "No"].map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-2 text-sm text-slate-700"
                        >
                          <input
                            type="radio"
                            name="renalImpairment"
                            value={option}
                            checked={formData.renalImpairment === option}
                            onChange={handleChange}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                    {errors.renalImpairment && (
                      <p className="mt-1 text-sm text-red-500">{errors.renalImpairment}</p>
                    )}
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium text-slate-700">
                      Any known hepatic (liver) impairment?
                    </p>
                    <div className="flex gap-6">
                      {["Yes", "No"].map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-2 text-sm text-slate-700"
                        >
                          <input
                            type="radio"
                            name="hepaticImpairment"
                            value={option}
                            checked={formData.hepaticImpairment === option}
                            onChange={handleChange}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                    {errors.hepaticImpairment && (
                      <p className="mt-1 text-sm text-red-500">{errors.hepaticImpairment}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Allergy Status
                  </label>
                  <input
                    name="allergyStatus"
                    placeholder="Enter allergy status"
                    value={formData.allergyStatus}
                    onChange={handleChange}
                    className={getInputClass("allergyStatus")}
                  />
                  {errors.allergyStatus && (
                    <p className="mt-1 text-sm text-red-500">{errors.allergyStatus}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Existing Medication
                  </label>
                  <textarea
                    name="existingMedication"
                    placeholder="List existing medication"
                    value={formData.existingMedication}
                    onChange={handleChange}
                    className={getInputClass("existingMedication") + " h-28"}
                  />
                  {errors.existingMedication && (
                    <p className="mt-1 text-sm text-red-500">{errors.existingMedication}</p>
                  )}
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700">
                    Is patient aware if they have resistance to previous treatment?
                  </p>
                  <div className="flex gap-6">
                    {["Yes", "No"].map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 text-sm text-slate-700"
                      >
                        <input
                          type="radio"
                          name="resistanceAware"
                          value={option}
                          checked={formData.resistanceAware === option}
                          onChange={handleChange}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                  {errors.resistanceAware && (
                    <p className="mt-1 text-sm text-red-500">{errors.resistanceAware}</p>
                  )}
                </div>

                {formData.resistanceAware === "Yes" && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      If yes, please list
                    </label>
                    <textarea
                      name="resistanceDetails"
                      placeholder="Enter resistance details"
                      value={formData.resistanceDetails}
                      onChange={handleChange}
                      className={getInputClass("resistanceDetails") + " h-24"}
                    />
                    {errors.resistanceDetails && (
                      <p className="mt-1 text-sm text-red-500">{errors.resistanceDetails}</p>
                    )}
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

          {step === 4 && (
            <div>
              <h2 className="mb-6 text-2xl font-semibold text-slate-900">
                Red Flag and Referral Criteria
              </h2>

              <div className="space-y-8">
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-red-700">
                    4.1 Criteria requiring EMERGENCY referral to hospital emergency department, as per 2.4.1 of Protocol. If any of the following are present, then immediate referral needed.
                  </h3>

                  <div className="space-y-3">
                    {[
                      "Symptoms of anaphylaxis including swollen tongue, breathing difficulties, tight chest, trouble swallowing or speaking, feeling dizzy or faint, and collapse",
                      "Symptoms of severe asthma attack",
                    ].map((item) => (
                      <label
                        key={item}
                        className="flex items-start gap-3 text-sm text-slate-700"
                      >
                        <input
                          type="checkbox"
                          name="emergencyFlags"
                          value={item}
                          checked={formData.emergencyFlags.includes(item)}
                          onChange={handleCheckboxArrayChange}
                          className="mt-1"
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                    <h3 className="mb-3 text-lg font-semibold text-slate-900">
                      *Pharmacists who have undergone the requisite training should consider use of emergency medicine if clinically appropriate, in addtion to calling an ambulance (Medicinal Products (Prescription and Control of Supply)(Amendment)(No. 2) Regulations 2015 (SI 449/2015))
                    </h3>
                  </div>
                </div>

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
                      <label
                        key={item}
                        className="flex items-start gap-3 text-sm text-slate-700"
                      >
                        <input
                          type="checkbox"
                          name="referralFlags"
                          value={item}
                          checked={formData.referralFlags.includes(item)}
                          onChange={handleCheckboxArrayChange}
                          className="mt-1"
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

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
                      <label
                        key={item}
                        className="flex items-start gap-3 text-sm text-slate-700"
                      >
                        <input
                          type="checkbox"
                          name="limitedSupplyFlags"
                          value={item}
                          checked={formData.limitedSupplyFlags.includes(item)}
                          onChange={handleCheckboxArrayChange}
                          className="mt-1"
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700">
                    Are there any Red Flag or Referral Criteria present?
                  </p>

                  <div className="flex gap-6">
                    {["Yes", "No"].map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 text-sm text-slate-700"
                      >
                        <input
                          type="radio"
                          name="hasRedFlags"
                          value={option}
                          checked={formData.hasRedFlags === option}
                          onChange={handleChange}
                        />
                        {option}
                      </label>
                    ))}
                  </div>

                  {errors.hasRedFlags && (
                    <p className="mt-1 text-sm text-red-500">{errors.hasRedFlags}</p>
                  )}
                </div>

                {formData.hasRedFlags === "Yes" && (
                  <>
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800">
                      Red flag or referral criteria present. Refer patient and document the reason below.
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Reason for referral
                      </label>
                      <textarea
                        name="referralReason"
                        placeholder="Document reason for referral"
                        value={formData.referralReason}
                        onChange={handleChange}
                        className={getInputClass("referralReason") + " h-24"}
                      />
                      {errors.referralReason && (
                        <p className="mt-1 text-sm text-red-500">{errors.referralReason}</p>
                      )}
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

          {step === 5 && (
            <div>
              <h2 className="mb-6 text-2xl font-semibold text-slate-900">
                Review of Symptoms
              </h2>

              <div className="space-y-8">
                <div>
                  <p className="mb-4 text-sm font-medium text-slate-700">
                    Listed below are the signs and symptoms that are typical of allergic rhinitis and allergic conjunctivitis, tick all that apply:
                  </p>

                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div>
                      <h3 className="mb-3 text-lg font-semibold text-slate-900">
                        Allergic Rhinitis
                      </h3>

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
                          <label
                            key={name}
                            className="flex items-start gap-3 text-sm text-slate-700"
                          >
                            <input
                              type="checkbox"
                              name={name}
                              checked={formData[name]}
                              onChange={handleChange}
                              className="mt-1"
                            />
                            <span>{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3 text-lg font-semibold text-slate-900">
                        Allergic Conjunctivitis
                      </h3>

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
                          <label
                            key={name}
                            className="flex items-start gap-3 text-sm text-slate-700"
                          >
                            <input
                              type="checkbox"
                              name={name}
                              checked={formData[name]}
                              onChange={handleChange}
                              className="mt-1"
                            />
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
                      <label
                        key={option}
                        className="flex items-center gap-2 text-sm text-slate-700"
                      >
                        <input
                          type="radio"
                          name="symptomsTypical"
                          value={option}
                          checked={formData.symptomsTypical === option}
                          onChange={handleChange}
                        />
                        {option}
                      </label>
                    ))}
                  </div>

                  {errors.symptomsTypical && (
                    <p className="mt-1 text-sm text-red-500">{errors.symptomsTypical}</p>
                  )}
                </div>

                {formData.symptomsTypical === "Yes" && (
                  <div>
                    <p className="mb-2 text-sm font-medium text-slate-700">
                      Which condition is typical?
                    </p>

                    <div className="flex flex-wrap gap-6">
                      {["Allergic Rhinitis", "Allergic Conjunctivitis"].map(
                        (option) => (
                          <label
                            key={option}
                            className="flex items-center gap-2 text-sm text-slate-700"
                          >
                            <input
                              type="radio"
                              name="typicalConditionType"
                              value={option}
                              checked={formData.typicalConditionType === option}
                              onChange={handleChange}
                            />
                            {option}
                          </label>
                        )
                      )}
                    </div>

                    {errors.typicalConditionType && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.typicalConditionType}
                      </p>
                    )}
                  </div>
                )}

                {formData.symptomsTypical === "No" && (
                  <>
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800">
                      Symptoms are not typical. Refer patient and document the reason below.
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Referral reason
                      </label>
                      <textarea
                        name="symptomsReferralReason"
                        placeholder="Document reason for referral"
                        value={formData.symptomsReferralReason}
                        onChange={handleChange}
                        className={getInputClass("symptomsReferralReason") + " h-24"}
                      />
                      {errors.symptomsReferralReason && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.symptomsReferralReason}
                        </p>
                      )}
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

          {step === 6 && (
            <div>
              <h2 className="mb-6 text-2xl font-semibold text-slate-900">
                Treatment Options
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="flex items-start gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="meetsInclusionCriteria"
                      checked={formData.meetsInclusionCriteria}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <span>
                      Individual meets the inclusion criteria as per protocol.
                    </span>
                  </label>
                  {errors.meetsInclusionCriteria && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.meetsInclusionCriteria}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-start gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="proceedWithPrescribing"
                      checked={formData.proceedWithPrescribing}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <span>
                      Appropriate to proceed with pharmacist prescribing and refer to protocol for prescribing information.
                    </span>
                  </label>
                  {errors.proceedWithPrescribing && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.proceedWithPrescribing}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-start gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="adviceAndCounselling"
                      checked={formData.adviceAndCounselling}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <span>
                      Give advice and counselling as per protocol.
                    </span>
                  </label>
                  {errors.adviceAndCounselling && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.adviceAndCounselling}
                    </p>
                  )}
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

          {step === 7 && (
            <div>
              <h2 className="mb-6 text-2xl font-semibold text-slate-900">
                Patient Declaration
              </h2>

              <div className="space-y-6">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>
                      • I understand the nature of the condition, how the treatment works,
                      the benefits and risks of the treatment. I understand the possible side effects
                      of the prescription medicine issued.
                    </li>
                    <li>
                      • I have been given the opportunity to speak to the pharmacist
                      providing the consultation and to ask questions and raise any
                      concerns.
                    </li>
                    <li>
                      • I have been given information with regards steps to take if my
                      condition gets worse, or does not improve.
                    </li>
                    <li>
                      • The information and details I have provided are accurate, and I
                      understand that this will be recorded and kept by the pharmacy and
                      shared with the HSE for the purposes of public health as required by
                      legislation.
                    </li>
                    <li>
                      • I understand that any data collected will be processed in
                      accordance with relevant data protection requirements.
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="mb-3 text-sm font-medium text-slate-700">
                    Please tick all that apply:
                  </p>

                  <div className="space-y-4">
                    <label className="flex items-start gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="declarationClinicalInfoSharing"
                        checked={formData.declarationClinicalInfoSharing}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <span>
                        I agree to the sharing of relevant clinical information with
                        another healthcare professional if deemed necessary by the
                        pharmacist, and I understand how this information will support my
                        ongoing care.
                      </span>
                    </label>
                    {errors.declarationClinicalInfoSharing && (
                      <p className="text-sm text-red-500">
                        {errors.declarationClinicalInfoSharing}
                      </p>
                    )}

                    <label className="flex items-start gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="declarationDispensingChoice"
                        checked={formData.declarationDispensingChoice}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <span>
                        I understand that I can have this prescription dispensed in this
                        pharmacy or that I can choose to have it dispensed in another
                        pharmacy of my choice.
                      </span>
                    </label>
                    {errors.declarationDispensingChoice && (
                      <p className="text-sm text-red-500">
                        {errors.declarationDispensingChoice}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-sm font-medium text-slate-700">
                    Please choose one dispensing option
                  </p>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <label className="flex items-start gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="dispenseToAnotherPharmacy"
                        checked={formData.dispenseToAnotherPharmacy}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFormData((prev) => ({
                            ...prev,
                            dispenseToAnotherPharmacy: checked,
                            dispenseInThisPharmacy: checked
                              ? false
                              : prev.dispenseInThisPharmacy,
                          }));
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
                          setFormData((prev) => ({
                            ...prev,
                            dispenseInThisPharmacy: checked,
                            dispenseToAnotherPharmacy: checked
                              ? false
                              : prev.dispenseToAnotherPharmacy,
                          }));
                        }}
                        className="mt-1"
                      />
                      <span>I have chosen to have my prescription dispensed in this pharmacy</span>
                    </label>
                  </div>

                  {errors.dispensingOption && (
                    <p className="mt-1 text-sm text-red-500">{errors.dispensingOption}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Signature of person providing consent
                    </label>
                    <input
                      name="consentSignature"
                      placeholder="Type full name as signature"
                      value={formData.consentSignature}
                      onChange={handleChange}
                      className={getInputClass("consentSignature")}
                    />
                    {errors.consentSignature && (
                      <p className="mt-1 text-sm text-red-500">{errors.consentSignature}</p>
                    )}
                  </div>

                  {isUnder16 && (
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Signature of parent/guardian providing consent if child is aged under 16 years
                      </label>
                      <input
                        name="guardianConsentSignature"
                        placeholder="Type parent/guardian full name as signature"
                        value={formData.guardianConsentSignature}
                        onChange={handleChange}
                        className={getInputClass("guardianConsentSignature")}
                      />
                      {errors.guardianConsentSignature && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.guardianConsentSignature}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Date
                    </label>
                    <input
                      type="date"
                      name="consentDate"
                      value={formData.consentDate}
                      onChange={handleChange}
                      className={getInputClass("consentDate")}
                    />
                    {errors.consentDate && (
                      <p className="mt-1 text-sm text-red-500">{errors.consentDate}</p>
                    )}
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

          {step === 8 && (
            <div>
              <h2 className="mb-6 text-2xl font-semibold text-slate-900">
                Consultation Outcome
              </h2>

              <div className="space-y-8">
                <div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <label className="flex items-start gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="outcomeReferral"
                        checked={formData.outcomeReferral}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <span>Referral</span>
                    </label>

                    <label className="flex items-start gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="outcomeSelfCare"
                        checked={formData.outcomeSelfCare}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <span>Self-care</span>
                    </label>

                    <label className="flex items-start gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="outcomeOTCSupplied"
                        checked={formData.outcomeOTCSupplied}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <span>OTC Product Supplied</span>
                    </label>

                    <label className="flex items-start gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="outcomePOMSupplied"
                        checked={formData.outcomePOMSupplied}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <span>Prescription for POM supplied</span>
                    </label>
                  </div>

                  {errors.consultationOutcome && (
                    <p className="mt-2 text-sm text-red-500">{errors.consultationOutcome}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-start gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="patientDeclinedTreatment"
                      checked={formData.patientDeclinedTreatment}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <span>Patient has declined treatment, please give reason:</span>
                  </label>

                  {formData.patientDeclinedTreatment && (
                    <textarea
                      name="declinedReason"
                      placeholder="Enter reason"
                      value={formData.declinedReason}
                      onChange={handleChange}
                      className={getInputClass("declinedReason") + " mt-3 h-24"}
                    />
                  )}

                  {errors.declinedReason && (
                    <p className="mt-1 text-sm text-red-500">{errors.declinedReason}</p>
                  )}
                </div>

                {formData.outcomeReferral && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                    <h3 className="mb-4 text-lg font-semibold text-amber-800">
                      8.1 Referred to
                    </h3>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <label className="flex items-start gap-3 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          name="referredToAEDepartment"
                          checked={formData.referredToAEDepartment}
                          onChange={handleChange}
                          className="mt-1"
                        />
                        <span>Accident & Emergency Department</span>
                      </label>

                      <label className="flex items-start gap-3 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          name="referredToGP"
                          checked={formData.referredToGP}
                          onChange={handleChange}
                          className="mt-1"
                        />
                        <span>General Practitioner (GP)</span>
                      </label>

                      <label className="flex items-start gap-3 text-sm text-slate-700 md:col-span-2">
                        <input
                          type="checkbox"
                          name="referredToOther"
                          checked={formData.referredToOther}
                          onChange={handleChange}
                          className="mt-1"
                        />
                        <span>Other (please specify)</span>
                      </label>
                    </div>

                    {formData.referredToOther && (
                      <textarea
                        name="referredToOtherDetails"
                        placeholder="Specify other referral destination"
                        value={formData.referredToOtherDetails}
                        onChange={handleChange}
                        className={getInputClass("referredToOtherDetails") + " mt-3 h-20"}
                      />
                    )}

                    {errors.referredTo && (
                      <p className="mt-2 text-sm text-red-500">{errors.referredTo}</p>
                    )}

                    {errors.referredToOtherDetails && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.referredToOtherDetails}
                      </p>
                    )}
                  </div>
                )}

                {(formData.outcomePOMSupplied) && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                    <h3 className="mb-4 text-lg font-semibold text-amber-800">
                      8.2 Medicine Prescribed / Supplied
                    </h3>

                    <p className="text-sm text-slate-600">
                      Please see Protocol and SPCs for dosage and notes for each individual medicinal product.
                    </p>

                    <div className="space-y-6">
                      <div>
                        <h4 className="mb-3 font-semibold text-slate-900">
                          Allergic Rhinitis – Nasal Sprays
                        </h4>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div className="space-y-3">
                            <label className="flex items-start gap-3 text-sm text-slate-700">
                              <input type="checkbox" name="med_INCS_SecondGen" checked={formData.med_INCS_SecondGen} onChange={handleChange} className="mt-1" />
                              <span>Intranasal Corticosteroid Spray (INCS) – Second Generation Glucocorticoid</span>
                            </label>

                            <label className="flex items-start gap-3 text-sm text-slate-700">
                              <input type="checkbox" name="med_INCS_INAH" checked={formData.med_INCS_INAH} onChange={handleChange} className="mt-1" />
                              <span>INCS + Intranasal Antihistamine (INAH)</span>
                            </label>

                            <label className="flex items-start gap-3 text-sm text-slate-700">
                              <input type="checkbox" name="med_INCS_FirstGen" checked={formData.med_INCS_FirstGen} onChange={handleChange} className="mt-1" />
                              <span>INCS – First Generation Glucocorticoid (over 18 only)</span>
                            </label>

                            <label className="flex items-start gap-3 text-sm text-slate-700">
                              <input type="checkbox" name="med_INAH" checked={formData.med_INAH} onChange={handleChange} className="mt-1" />
                              <span>INAH – Antihistamine Nasal Spray</span>
                            </label>
                          </div>

                          <div className="space-y-3">
                            <label className="flex items-start gap-3 text-sm text-slate-700">
                              <input type="checkbox" name="med_FluticasoneFuroate" checked={formData.med_FluticasoneFuroate} onChange={handleChange} className="mt-1" />
                              <span>Fluticasone furoate 27.5 micrograms per spray, nasal spray</span>
                            </label>

                            <label className="flex items-start gap-3 text-sm text-slate-700">
                              <input type="checkbox" name="med_FluticasonePropionate" checked={formData.med_FluticasonePropionate} onChange={handleChange} className="mt-1" />
                              <span>Fluticasone propionate 50 micrograms, nasal spray</span>
                            </label>

                            <label className="flex items-start gap-3 text-sm text-slate-700">
                              <input type="checkbox" name="med_Mometasone" checked={formData.med_Mometasone} onChange={handleChange} className="mt-1" />
                              <span>Mometasone 50 micrograms, nasal spray</span>
                            </label>

                            <label className="flex items-start gap-3 text-sm text-slate-700">
                              <input type="checkbox" name="med_AzelastineFluticasone" checked={formData.med_AzelastineFluticasone} onChange={handleChange} className="mt-1" />
                              <span>Azelastine/fluticasone propionate 137 micrograms/50 micrograms per actuation, nasal spray</span>
                            </label>

                            <label className="flex items-start gap-3 text-sm text-slate-700">
                              <input type="checkbox" name="med_MometasoneOlopatadine" checked={formData.med_MometasoneOlopatadine} onChange={handleChange} className="mt-1" />
                              <span>Mometasone/Olopatadine 25 microgram/600 microgram per actuation, nasal spray</span>
                            </label>

                            <label className="flex items-start gap-3 text-sm text-slate-700">
                              <input type="checkbox" name="med_Beclometasone" checked={formData.med_Beclometasone} onChange={handleChange} className="mt-1" />
                              <span>Beclometasone Dipropionate 50 micrograms, nasal spray</span>
                            </label>

                            <label className="flex items-start gap-3 text-sm text-slate-700">
                              <input type="checkbox" name="med_Triamcinolone" checked={formData.med_Triamcinolone} onChange={handleChange} className="mt-1" />
                              <span>Triamcinolone acetonide 55 micrograms per dose, nasal spray</span>
                            </label>

                            <label className="flex items-start gap-3 text-sm text-slate-700">
                              <input type="checkbox" name="med_AzelastineHydrochloride" checked={formData.med_AzelastineHydrochloride} onChange={handleChange} className="mt-1" />
                              <span>Azelastine Hydrochloride 140 micrograms per spray, nasal spray</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="mb-3 font-semibold text-slate-900">
                          Allergic Rhinitis – Minimally sedating oral antihistamines
                        </h4>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div className="space-y-3">
                            <label className="flex items-start gap-3 text-sm text-slate-700">
                              <input type="checkbox" name="med_SecondGenAntihistamines" checked={formData.med_SecondGenAntihistamines} onChange={handleChange} className="mt-1" />
                              <span>Second Generation Antihistamines (minimally sedating antihistamines)</span>
                            </label>

                            <label className="flex items-start gap-3 text-sm text-slate-700">
                              <input type="checkbox" name="med_ThirdGenAntihistamines" checked={formData.med_ThirdGenAntihistamines} onChange={handleChange} className="mt-1" />
                              <span>Third Generation Antihistamines</span>
                            </label>
                          </div>

                          <div className="space-y-3">
                            <label className="flex items-start gap-3 text-sm text-slate-700">
                              <input type="checkbox" name="med_Cetirizine10mgTablets" checked={formData.med_Cetirizine10mgTablets} onChange={handleChange} className="mt-1" />
                              <span>Cetirizine dihydrochloride 10 mg tablets</span>
                            </label>
                            <label className="flex items-start gap-3 text-sm text-slate-700">
                              <input type="checkbox" name="med_Cetirizine1mgmlOral" checked={formData.med_Cetirizine1mgmlOral} onChange={handleChange} className="mt-1" />
                              <span>Cetirizine dihydrochloride 1 mg/ml oral solution</span>
                            </label>
                            <label className="flex items-start gap-3 text-sm text-slate-700">
                              <input type="checkbox" name="med_Loratadine10mgTablets" checked={formData.med_Loratadine10mgTablets} onChange={handleChange} className="mt-1" />
                              <span>Loratadine 10 mg tablets</span>
                            </label>
                            <label className="flex items-start gap-3 text-sm text-slate-700">
                              <input type="checkbox" name="med_Bilastine10mgODT" checked={formData.med_Bilastine10mgODT} onChange={handleChange} className="mt-1" />
                              <span>Bilastine 10 mg orodispersible tablets</span>
                            </label>
                            <label className="flex items-start gap-3 text-sm text-slate-700">
                              <input type="checkbox" name="med_Bilastine20mgTablets" checked={formData.med_Bilastine20mgTablets} onChange={handleChange} className="mt-1" />
                              <span>Bilastine 20 mg tablets</span>
                            </label>
                            <label className="flex items-start gap-3 text-sm text-slate-700">
                              <input type="checkbox" name="med_Bilastine25mgmlOral" checked={formData.med_Bilastine25mgmlOral} onChange={handleChange} className="mt-1" />
                              <span>Bilastine 2.5 mg/ml oral solution</span>
                            </label>
                            <label className="flex items-start gap-3 text-sm text-slate-700">
                              <input type="checkbox" name="med_Desloratadine5mgTablets" checked={formData.med_Desloratadine5mgTablets} onChange={handleChange} className="mt-1" />
                              <span>Desloratadine 5 mg tablets</span>
                            </label>
                            <label className="flex items-start gap-3 text-sm text-slate-700">
                              <input type="checkbox" name="med_Desloratadine05mgmlOral" checked={formData.med_Desloratadine05mgmlOral} onChange={handleChange} className="mt-1" />
                              <span>Desloratadine 0.5 mg/ml oral solution</span>
                            </label>
                            <label className="flex items-start gap-3 text-sm text-slate-700">
                              <input type="checkbox" name="med_Fexofenadine120mg" checked={formData.med_Fexofenadine120mg} onChange={handleChange} className="mt-1" />
                              <span>Fexofenadine 120mg</span>
                            </label>
                            <label className="flex items-start gap-3 text-sm text-slate-700">
                              <input type="checkbox" name="med_Levocetirizine5mgTablets" checked={formData.med_Levocetirizine5mgTablets} onChange={handleChange} className="mt-1" />
                              <span>Levocetirizine 5mg tablets</span>
                            </label>
                            <label className="flex items-start gap-3 text-sm text-slate-700">
                              <input type="checkbox" name="med_Levocetirizine05mgmlOral" checked={formData.med_Levocetirizine05mgmlOral} onChange={handleChange} className="mt-1" />
                              <span>Levocetirizine 0.5mg/ml oral solution</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="mb-3 font-semibold text-slate-900">
                          Allergic Conjunctivitis
                        </h4>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div className="space-y-3">
                            <label className="flex items-start gap-3 text-sm text-slate-700">
                              <input type="checkbox" name="med_IOC" checked={formData.med_IOC} onChange={handleChange} className="mt-1" />
                              <span>IOC – Intraocular Cromone (Mast cell stabiliser)</span>
                            </label>

                            <label className="flex items-start gap-3 text-sm text-slate-700">
                              <input type="checkbox" name="med_IOAH" checked={formData.med_IOAH} onChange={handleChange} className="mt-1" />
                              <span>IOAH – Intraocular antihistamine</span>
                            </label>
                          </div>

                          <div className="space-y-3">
                            <label className="flex items-start gap-3 text-sm text-slate-700">
                              <input type="checkbox" name="med_SodiumCromoglicate" checked={formData.med_SodiumCromoglicate} onChange={handleChange} className="mt-1" />
                              <span>Sodium cromoglicate 2% w/v eye drops, solution</span>
                            </label>

                            <label className="flex items-start gap-3 text-sm text-slate-700">
                              <input type="checkbox" name="med_Ketotifen" checked={formData.med_Ketotifen} onChange={handleChange} className="mt-1" />
                              <span>Ketotifen 0.25mg/ml eye drops, solution</span>
                            </label>

                            <label className="flex items-start gap-3 text-sm text-slate-700">
                              <input type="checkbox" name="med_OlopatadineEyeDrops" checked={formData.med_OlopatadineEyeDrops} onChange={handleChange} className="mt-1" />
                              <span>Olopatadine hydrochloride 1mg/ml eye drops, solution</span>
                            </label>
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
          {step === 9 && (
            <div>
              <h2 className="mb-6 text-2xl font-semibold text-slate-900">
                Pharmacist Information
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      First & Last Name
                    </label>
                    <input
                      name="pharmacistName"
                      placeholder="Enter pharmacist name"
                      value={formData.pharmacistName}
                      onChange={handleChange}
                      className={getInputClass("pharmacistName")}
                    />
                    {errors.pharmacistName && (
                      <p className="mt-1 text-sm text-red-500">{errors.pharmacistName}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Pharmacy Address
                    </label>
                    <input
                      name="pharmacyAddress"
                      placeholder="Enter pharmacy address"
                      value={formData.pharmacyAddress}
                      onChange={handleChange}
                      className={getInputClass("pharmacyAddress")}
                    />
                    {errors.pharmacyAddress && (
                      <p className="mt-1 text-sm text-red-500">{errors.pharmacyAddress}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      PSI No.
                    </label>
                    <input
                      name="psiNumber"
                      placeholder="Enter PSI number"
                      value={formData.psiNumber}
                      onChange={handleChange}
                      className={getInputClass("psiNumber")}
                    />
                    {errors.psiNumber && (
                      <p className="mt-1 text-sm text-red-500">{errors.psiNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Eircode
                    </label>
                    <input
                      name="pharmacyEircode"
                      placeholder="Enter eircode"
                      value={formData.pharmacyEircode}
                      onChange={handleChange}
                      className={getInputClass("pharmacyEircode")}
                    />
                    {errors.pharmacyEircode && (
                      <p className="mt-1 text-sm text-red-500">{errors.pharmacyEircode}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Pharmacist Signature
                    </label>
                    <input
                      name="pharmacistSignature"
                      placeholder="Type full name as signature"
                      value={formData.pharmacistSignature}
                      onChange={handleChange}
                      className={getInputClass("pharmacistSignature")}
                    />
                    {errors.pharmacistSignature && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.pharmacistSignature}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Date
                    </label>
                    <input
                      type="date"
                      name="pharmacistDate"
                      value={formData.pharmacistDate}
                      onChange={handleChange}
                      className={getInputClass("pharmacistDate")}
                    />
                    {errors.pharmacistDate && (
                      <p className="mt-1 text-sm text-red-500">{errors.pharmacistDate}</p>
                    )}
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
          {step === 10 && (
            <div>
              <h2 className="mb-6 text-2xl font-semibold text-slate-900">
                Consultation Overview
              </h2>

              <div className="space-y-6">
                {/* Step 1 */}
                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">
                    1. Personal Details
                  </h3>

                  <div className="grid grid-cols-1 gap-3 text-sm text-slate-700 md:grid-cols-2">
                    <p><span className="font-medium">Patient Name:</span> {formData.patientName || "-"}</p>
                    <p><span className="font-medium">Contact:</span> {formData.contact || "-"}</p>
                    <p><span className="font-medium">Address:</span> {formData.address || "-"}</p>
                    <p><span className="font-medium">Eircode:</span> {formData.eircode || "-"}</p>
                    <p><span className="font-medium">PPSN:</span> {formData.ppsn || "-"}</p>
                    <p><span className="font-medium">Scheme Number:</span> {formData.schemeNumber || "-"}</p>
                    <p><span className="font-medium">Scheme Type:</span> {formData.schemeType || "-"}</p>
                    <p><span className="font-medium">DOB:</span> {formData.dob || "-"}</p>
                    <p><span className="font-medium">Age:</span> {age || "-"}</p>
                    <p><span className="font-medium">Sex:</span> {formData.sex || "-"}</p>
                    <p><span className="font-medium">GP Name:</span> {formData.gpName || "-"}</p>
                    <p><span className="font-medium">GP Contact:</span> {formData.gpContact || "-"}</p>
                    <p className="md:col-span-2"><span className="font-medium">GP Address:</span> {formData.gpAddress || "-"}</p>

                    {isUnder16 && (
                      <p className="md:col-span-2">
                        <span className="font-medium">Guardian:</span> {formData.guardian || "-"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Step 2 */}
                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">
                    2. Presenting Complaint
                  </h3>

                  <div className="space-y-3 text-sm text-slate-700">
                    <p><span className="font-medium">Symptoms:</span> {formData.symptoms || "-"}</p>
                    <p><span className="font-medium">Medication Tried:</span> {formData.medicationTried || "-"}</p>
                    <p><span className="font-medium">Medication List:</span> {formData.medicationList || "-"}</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">
                    3. Medical History
                  </h3>

                  <div className="grid grid-cols-1 gap-3 text-sm text-slate-700 md:grid-cols-2">
                    <p><span className="font-medium">Medical Conditions:</span> {formData.medicalConditions || "-"}</p>
                    <p><span className="font-medium">Pregnant:</span> {formData.pregnant ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Breastfeeding:</span> {formData.breastfeeding ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Renal Impairment:</span> {formData.renalImpairment || "-"}</p>
                    <p><span className="font-medium">Hepatic Impairment:</span> {formData.hepaticImpairment || "-"}</p>
                    <p><span className="font-medium">Allergy Status:</span> {formData.allergyStatus || "-"}</p>
                    <p className="md:col-span-2"><span className="font-medium">Existing Medication:</span> {formData.existingMedication || "-"}</p>
                    <p><span className="font-medium">Resistance Aware:</span> {formData.resistanceAware || "-"}</p>
                    <p className="md:col-span-2"><span className="font-medium">Resistance Details:</span> {formData.resistanceDetails || "-"}</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">
                    4. Red Flags and Referral Criteria
                  </h3>

                  <div className="space-y-3 text-sm text-slate-700">
                    <p><span className="font-medium">Emergency Flags:</span> {formData.emergencyFlags.length > 0 ? formData.emergencyFlags.join(", ") : "-"}</p>
                    <p><span className="font-medium">Referral Flags:</span> {formData.referralFlags.length > 0 ? formData.referralFlags.join(", ") : "-"}</p>
                    <p><span className="font-medium">Initial Limited Supply Flags:</span> {formData.limitedSupplyFlags.length > 0 ? formData.limitedSupplyFlags.join(", ") : "-"}</p>
                    <p><span className="font-medium">Any Red Flags Present:</span> {formData.hasRedFlags || "-"}</p>
                    <p><span className="font-medium">Referral Reason:</span> {formData.referralReason || "-"}</p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">
                    5. Review of Symptoms
                  </h3>

                  <div className="space-y-3 text-sm text-slate-700">
                    <p><span className="font-medium">Rhinorrhoea:</span> {formData.symptomRhinorrhoea ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Sneezing:</span> {formData.symptomSneezing ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Itchy Nose / Eyes / Palate:</span> {formData.symptomItchyNoseEyesPalate ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Nasal Congestion:</span> {formData.symptomNasalCongestion ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Irritability / Fatigue:</span> {formData.symptomIrritabilityFatigue ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Transverse Nasal Crease:</span> {formData.symptomTransverseNasalCrease ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Reduction of Smell:</span> {formData.symptomReductionOfSmell ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Rhinitis with Conjunctivitis:</span> {formData.symptomRhinitisWithConjunctivitis ? "Yes" : "No"}</p>

                    <p><span className="font-medium">Red Eye:</span> {formData.symptomRedEye ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Eye Itching:</span> {formData.symptomEyeItching ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Pink Swelling Eyelid:</span> {formData.symptomPinkSwellingEyelid ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Watery / Stringy Discharge:</span> {formData.symptomWateryStringyDischarge ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Grittiness / Burning / Irritation:</span> {formData.symptomGrittinessBurningIrritation ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Crusting in Morning:</span> {formData.symptomCrustingMorning ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Accompanied by Rhinitis:</span> {formData.symptomAccompaniedByRhinitis ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Unilateral or Bilateral:</span> {formData.symptomUnilateralOrBilateral ? "Yes" : "No"}</p>

                    <p><span className="font-medium">Symptoms Typical:</span> {formData.symptomsTypical || "-"}</p>
                    <p><span className="font-medium">Typical Condition Type:</span> {formData.typicalConditionType || "-"}</p>
                    <p><span className="font-medium">Symptoms Referral Reason:</span> {formData.symptomsReferralReason || "-"}</p>
                  </div>
                </div>

                {/* Step 6 */}
                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">
                    6. Treatment Options
                  </h3>

                  <div className="space-y-3 text-sm text-slate-700">
                    <p><span className="font-medium">Meets Inclusion Criteria:</span> {formData.meetsInclusionCriteria ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Proceed With Prescribing:</span> {formData.proceedWithPrescribing ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Advice And Counselling:</span> {formData.adviceAndCounselling ? "Yes" : "No"}</p>
                  </div>
                </div>

                {/* Step 7 */}
                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">
                    7. Patient Declaration
                  </h3>

                  <div className="space-y-3 text-sm text-slate-700">
                    <p><span className="font-medium">Clinical Info Sharing Agreed:</span> {formData.declarationClinicalInfoSharing ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Dispensing Choice Statement Agreed:</span> {formData.declarationDispensingChoice ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Dispense To Another Pharmacy:</span> {formData.dispenseToAnotherPharmacy ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Dispense In This Pharmacy:</span> {formData.dispenseInThisPharmacy ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Consent Signature:</span> {formData.consentSignature || "-"}</p>
                    <p><span className="font-medium">Consent Date:</span> {formData.consentDate || "-"}</p>

                    {isUnder16 && (
                      <p><span className="font-medium">Guardian Consent Signature:</span> {formData.guardianConsentSignature || "-"}</p>
                    )}
                  </div>
                </div>

                {/* Step 8 */}
                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">
                    8. Consultation Outcome
                  </h3>

                  <div className="space-y-3 text-sm text-slate-700">
                    <p><span className="font-medium">Referral:</span> {formData.outcomeReferral ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Self-care:</span> {formData.outcomeSelfCare ? "Yes" : "No"}</p>
                    <p><span className="font-medium">OTC Product Supplied:</span> {formData.outcomeOTCSupplied ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Prescription for POM Supplied:</span> {formData.outcomePOMSupplied ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Patient Declined Treatment:</span> {formData.patientDeclinedTreatment ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Declined Reason:</span> {formData.declinedReason || "-"}</p>

                    <p><span className="font-medium">Referred to A&E:</span> {formData.referredToAEDepartment ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Referred to GP:</span> {formData.referredToGP ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Referred to Other:</span> {formData.referredToOther ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Other Referral Details:</span> {formData.referredToOtherDetails || "-"}</p>

                    <p><span className="font-medium">INCS Second Gen:</span> {formData.med_INCS_SecondGen ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Fluticasone Furoate:</span> {formData.med_FluticasoneFuroate ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Fluticasone Propionate:</span> {formData.med_FluticasonePropionate ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Mometasone:</span> {formData.med_Mometasone ? "Yes" : "No"}</p>
                    <p><span className="font-medium">INCS + INAH:</span> {formData.med_INCS_INAH ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Azelastine / Fluticasone:</span> {formData.med_AzelastineFluticasone ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Mometasone / Olopatadine:</span> {formData.med_MometasoneOlopatadine ? "Yes" : "No"}</p>
                    <p><span className="font-medium">INCS First Gen:</span> {formData.med_INCS_FirstGen ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Beclometasone:</span> {formData.med_Beclometasone ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Triamcinolone:</span> {formData.med_Triamcinolone ? "Yes" : "No"}</p>
                    <p><span className="font-medium">INAH:</span> {formData.med_INAH ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Azelastine Hydrochloride:</span> {formData.med_AzelastineHydrochloride ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Second Gen Antihistamines:</span> {formData.med_SecondGenAntihistamines ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Cetirizine 10mg Tablets:</span> {formData.med_Cetirizine10mgTablets ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Cetirizine Oral Solution:</span> {formData.med_Cetirizine1mgmlOral ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Loratadine 10mg Tablets:</span> {formData.med_Loratadine10mgTablets ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Bilastine 10mg ODT:</span> {formData.med_Bilastine10mgODT ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Bilastine 20mg Tablets:</span> {formData.med_Bilastine20mgTablets ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Bilastine Oral Solution:</span> {formData.med_Bilastine25mgmlOral ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Third Gen Antihistamines:</span> {formData.med_ThirdGenAntihistamines ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Desloratadine 5mg Tablets:</span> {formData.med_Desloratadine5mgTablets ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Desloratadine Oral Solution:</span> {formData.med_Desloratadine05mgmlOral ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Fexofenadine 120mg:</span> {formData.med_Fexofenadine120mg ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Levocetirizine 5mg Tablets:</span> {formData.med_Levocetirizine5mgTablets ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Levocetirizine Oral Solution:</span> {formData.med_Levocetirizine05mgmlOral ? "Yes" : "No"}</p>
                    <p><span className="font-medium">IOC:</span> {formData.med_IOC ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Sodium Cromoglicate:</span> {formData.med_SodiumCromoglicate ? "Yes" : "No"}</p>
                    <p><span className="font-medium">IOAH:</span> {formData.med_IOAH ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Ketotifen:</span> {formData.med_Ketotifen ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Olopatadine Eye Drops:</span> {formData.med_OlopatadineEyeDrops ? "Yes" : "No"}</p>
                  </div>
                </div>

                {/* Step 9 */}
                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">
                    9. Pharmacist Information
                  </h3>

                  <div className="grid grid-cols-1 gap-3 text-sm text-slate-700 md:grid-cols-2">
                    <p><span className="font-medium">Pharmacist Name:</span> {formData.pharmacistName || "-"}</p>
                    <p><span className="font-medium">PSI Number:</span> {formData.psiNumber || "-"}</p>
                    <p><span className="font-medium">Pharmacy Address:</span> {formData.pharmacyAddress || "-"}</p>
                    <p><span className="font-medium">Pharmacy Eircode:</span> {formData.pharmacyEircode || "-"}</p>
                    <p><span className="font-medium">Pharmacist Signature:</span> {formData.pharmacistSignature || "-"}</p>
                    <p><span className="font-medium">Pharmacist Date:</span> {formData.pharmacistDate || "-"}</p>
                  </div>
                </div>
              </div>

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